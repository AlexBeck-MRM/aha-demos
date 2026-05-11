#!/usr/bin/env python3
from pathlib import Path
from PIL import Image


ROOT = Path(".artifacts/output/playwright/brand-landscape")
SIZE = 300
PADDING = 20


def build_tile(source_path: Path, target_path: Path) -> None:
    with Image.open(source_path) as source:
        source = source.convert("RGBA")
        max_w = SIZE - (PADDING * 2)
        max_h = SIZE - (PADDING * 2)
        scale = min(max_w / source.width, max_h / source.height, 1.0)
        new_w = max(1, int(round(source.width * scale)))
        new_h = max(1, int(round(source.height * scale)))
        logo = source.resize((new_w, new_h), Image.Resampling.LANCZOS)

        canvas = Image.new("RGBA", (SIZE, SIZE), (255, 255, 255, 255))
        offset_x = (SIZE - new_w) // 2
        offset_y = (SIZE - new_h) // 2
        canvas.paste(logo, (offset_x, offset_y), logo)
        canvas.convert("RGB").save(target_path, "PNG")


def main() -> None:
    raw_files = sorted(ROOT.glob("04-adjacent-purpose/*-logo-raw.png"))
    if not raw_files:
        print("No raw logo files found.")
        return

    for raw_path in raw_files:
        final_path = raw_path.with_name(raw_path.name.replace("-logo-raw.png", "-logo-300.png"))
        build_tile(raw_path, final_path)
        print(f"Created {final_path}")


if __name__ == "__main__":
    main()
