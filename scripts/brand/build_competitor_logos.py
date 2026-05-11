#!/usr/bin/env python3

from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path
from typing import Dict

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[2]
SCORES_CSV = ROOT / "reference/data/aha_space_brand_matrix_scores_global20.csv"
OVERRIDES_CSV = ROOT / "reference/data/aha_space_logo_overrides.csv"
FINAL_DIR = ROOT / "reference/evidence/logos/aha-space-competitors-global-2026-04/final"
REVIEW_SHEET = ROOT / "reference/evidence/logos/aha-space-competitors-global-2026-04/logo-review-sheet.png"

CANVAS_W = 520
CANVAS_H = 220


@dataclass
class Override:
    source_file: Path
    x1: int
    y1: int
    x2: int
    y2: int
    trim_mode: str


def read_csv_rows(path: Path):
    with path.open("r", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def parse_overrides(path: Path) -> Dict[str, Override]:
    rows = read_csv_rows(path)
    overrides: Dict[str, Override] = {}
    for row in rows:
        overrides[row["slug"]] = Override(
            source_file=ROOT / row["source_file"],
            x1=int(row["x1"]),
            y1=int(row["y1"]),
            x2=int(row["x2"]),
            y2=int(row["y2"]),
            trim_mode=row["trim_mode"].strip() or "white",
        )
    return overrides


def load_image(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def crop_from_override(image: Image.Image, override: Override) -> Image.Image:
    if override.x2 > override.x1 and override.y2 > override.y1:
        return image.crop((override.x1, override.y1, override.x2, override.y2))
    return image


def remove_white_background(image: Image.Image, threshold: int = 245) -> Image.Image:
    image = image.copy()
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            if r >= threshold and g >= threshold and b >= threshold:
                pixels[x, y] = (255, 255, 255, 0)
    return image


def remove_key_background(image: Image.Image, tolerance: int = 28) -> Image.Image:
    image = image.copy()
    sample_points = [
        (0, 0),
        (image.width - 1, 0),
        (0, image.height - 1),
        (image.width - 1, image.height - 1),
    ]
    samples = [image.getpixel(point) for point in sample_points]
    r = sum(pixel[0] for pixel in samples) // len(samples)
    g = sum(pixel[1] for pixel in samples) // len(samples)
    b = sum(pixel[2] for pixel in samples) // len(samples)
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            pr, pg, pb, pa = pixels[x, y]
            if pa == 0:
                continue
            if abs(pr - r) <= tolerance and abs(pg - g) <= tolerance and abs(pb - b) <= tolerance:
                pixels[x, y] = (255, 255, 255, 0)
    return image


def remove_dark_background(image: Image.Image, threshold: int = 28) -> Image.Image:
    image = image.copy()
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            if r <= threshold and g <= threshold and b <= threshold:
                pixels[x, y] = (255, 255, 255, 0)
    return image


def trim_transparent(image: Image.Image) -> Image.Image:
    bbox = image.getbbox()
    if bbox is None:
        return image
    return image.crop(bbox)


def normalize_logo(image: Image.Image, scale: float) -> Image.Image:
    image = trim_transparent(image)
    if image.width == 0 or image.height == 0:
        return Image.new("RGBA", (CANVAS_W, CANVAS_H), (255, 255, 255, 255))

    target_w = int(CANVAS_W * 0.84 * scale)
    target_h = int(CANVAS_H * 0.72 * scale)
    ratio = min(target_w / image.width, target_h / image.height)
    resized = image.resize((max(1, int(image.width * ratio)), max(1, int(image.height * ratio))), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (255, 255, 255, 255))
    x = (CANVAS_W - resized.width) // 2
    y = (CANVAS_H - resized.height) // 2
    canvas.alpha_composite(resized, (x, y))
    return canvas


def apply_override_or_default(slug: str, raw_path: Path, overrides: Dict[str, Override]) -> Image.Image:
    if slug in overrides:
      override = overrides[slug]
      image = load_image(override.source_file)
      image = crop_from_override(image, override)
      if override.trim_mode == "key":
          image = remove_key_background(image)
      elif override.trim_mode == "key_strict":
          image = remove_key_background(image, tolerance=12)
      elif override.trim_mode == "dark":
          image = remove_dark_background(image)
      elif override.trim_mode == "white":
          image = remove_white_background(image)
      return image

    image = load_image(raw_path)
    image = remove_white_background(image)
    return image


def write_review_sheet(score_rows):
    files = [ROOT / row["logo_file"] for row in score_rows]
    labels = [row["slug"] for row in score_rows]
    thumb_w = 330
    thumb_h = 140
    cols = 2
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + 26)), "white")
    draw = ImageDraw.Draw(sheet)

    for index, (path, label) in enumerate(zip(files, labels)):
        image = Image.open(path).convert("RGB")
        image.thumbnail((thumb_w - 20, thumb_h - 20), Image.Resampling.LANCZOS)
        x = (index % cols) * thumb_w + 10
        y = (index // cols) * (thumb_h + 26) + 10
        sheet.paste(image, (x, y))
        draw.text((x, y + thumb_h), label, fill="black")

    REVIEW_SHEET.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(REVIEW_SHEET)


def main():
    score_rows = read_csv_rows(SCORES_CSV)
    overrides = parse_overrides(OVERRIDES_CSV)
    FINAL_DIR.mkdir(parents=True, exist_ok=True)

    for row in score_rows:
        raw_path = ROOT / row["logo_raw_file"]
        final_path = ROOT / row["logo_file"]
        final_path.parent.mkdir(parents=True, exist_ok=True)

        image = apply_override_or_default(row["slug"], raw_path, overrides)
        image = normalize_logo(image, float(row["logo_scale"]))
        image.save(final_path)

    write_review_sheet(score_rows)
    print(REVIEW_SHEET)


if __name__ == "__main__":
    main()
