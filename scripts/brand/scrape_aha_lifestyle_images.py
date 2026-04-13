#!/usr/bin/env python3

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import shutil
import sys
import time
from dataclasses import dataclass
from html import unescape
from html.parser import HTMLParser
from io import BytesIO
from pathlib import Path
from typing import Iterable
from urllib.parse import parse_qsl, urlencode, urljoin, urlparse, urlunparse
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET

from PIL import Image, UnidentifiedImageError

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
)
HEADERS = {
    "User-Agent": USER_AGENT,
    "Accept": (
        "text/html,application/xhtml+xml,application/xml;q=0.9,"
        "image/avif,image/webp,*/*;q=0.8"
    ),
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Upgrade-Insecure-Requests": "1",
}

SITEMAPS = (
    "https://www.heart.org/sitemap.xml",
    "https://www.stroke.org/sitemap.xml",
)

MIN_WIDTH = 1000
DEFAULT_TARGET = 34
DEFAULT_MAX_PAGES = 180
REQUEST_TIMEOUT = 25

PERSON_KEYWORDS = {
    "people",
    "person",
    "man",
    "men",
    "woman",
    "women",
    "family",
    "families",
    "patient",
    "patients",
    "doctor",
    "nurse",
    "caregiver",
    "caregivers",
    "survivor",
    "survivors",
    "child",
    "children",
    "kid",
    "kids",
    "teen",
    "teens",
    "adult",
    "adults",
    "senior",
    "seniors",
    "elderly",
    "couple",
    "mother",
    "father",
    "mom",
    "dad",
    "friend",
    "friends",
    "girl",
    "boy",
    "therapist",
    "grandmother",
    "grandfather",
    "granddaughter",
    "grandson",
    "daughter",
    "son",
}

LIFESTYLE_KEYWORDS = {
    "healthy",
    "health",
    "lifestyle",
    "living",
    "fitness",
    "exercise",
    "exercising",
    "walk",
    "walking",
    "run",
    "running",
    "jog",
    "workout",
    "yoga",
    "cook",
    "cooking",
    "kitchen",
    "eat",
    "eating",
    "meal",
    "grocery",
    "sleep",
    "stress",
    "relax",
    "relaxing",
    "meditate",
    "meditation",
    "recovery",
    "rehab",
    "rehabilitation",
    "support",
    "caregiver",
    "caregivers",
    "therapy",
    "outdoors",
    "chatting",
    "club",
    "prevention",
    "preventing",
    "mental",
    "wellbeing",
    "well-being",
    "smoking",
    "quit",
    "habit",
    "habits",
}

STRONG_PAGE_KEYWORDS = {
    "healthy-living",
    "healthy-lifestyle",
    "healthy-eating",
    "fitness",
    "walking",
    "sleep",
    "stress",
    "mental-health",
    "wellbeing",
    "quit-smoking",
    "life-after-stroke",
    "stroke-rehabilitation",
    "caregiver",
    "caregivers",
    "recover",
    "recovery",
    "preventing-another-stroke",
}

BLOCKED_PAGE_KEYWORDS = {
    "professional",
    "volunteer",
    "donate",
    "newsroom",
    "jobs",
    "careers",
    "shop",
    "cpr",
    "mission-lifeline",
    "event",
    "events",
    "conference",
    "awards",
    "vote-",
    "resource-library",
}

NEGATIVE_IMAGE_KEYWORDS = {
    "logo",
    "icon",
    "graphic",
    "infographic",
    "illustration",
    "chart",
    "diagram",
    "seal",
    "badge",
    "symbol",
    "facebook",
    "instagram",
    "twitter",
    "linkedin",
    "youtube",
    "tiktok",
    "pinterest",
    "header",
    "footer",
    "menu",
    "search",
    "donate",
    "cookie",
    "powered by",
    "open graph",
    "application now open",
    "pdf",
    "screenshot",
}

RASTER_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def fetch_bytes(url: str, *, referer: str | None = None) -> bytes:
    headers = dict(HEADERS)
    if referer:
        headers["Referer"] = referer
    req = Request(url, headers=headers)
    with urlopen(req, timeout=REQUEST_TIMEOUT) as response:
        return response.read()


def fetch_text(url: str, *, referer: str | None = None) -> str:
    return fetch_bytes(url, referer=referer).decode("utf-8", "ignore")


def slugify(value: str) -> str:
    cleaned = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return cleaned or "image"


def normalize_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", unescape(value or "")).strip()


def allowed_image_domain(url: str) -> bool:
    host = urlparse(url).netloc.lower()
    return host.endswith("heart.org") or host.endswith("stroke.org")


def image_extension(url: str) -> str:
    return Path(urlparse(url).path).suffix.lower()


def strip_query(url: str) -> str:
    parsed = urlparse(url)
    return urlunparse(parsed._replace(query="", fragment=""))


def with_width_hint(url: str, width: int) -> str:
    parsed = urlparse(url)
    query = dict(parse_qsl(parsed.query, keep_blank_values=True))
    query["w"] = str(width)
    query["mw"] = str(width)
    query.setdefault("iar", "0")
    if "heart.org" in parsed.netloc or "stroke.org" in parsed.netloc:
        query.setdefault("sc_lang", "en")
    return urlunparse(parsed._replace(query=urlencode(query)))


def parse_srcset(value: str) -> list[str]:
    urls: list[tuple[int, str]] = []
    for item in value.split(","):
        token = item.strip()
        if not token:
            continue
        parts = token.split()
        candidate = parts[0]
        width = 0
        if len(parts) > 1 and parts[1].endswith("w"):
            try:
                width = int(parts[1][:-1])
            except ValueError:
                width = 0
        urls.append((width, candidate))
    urls.sort(key=lambda item: item[0], reverse=True)
    return [candidate for _, candidate in urls]


def dhash(image: Image.Image, size: int = 8) -> str:
    grayscale = image.convert("L").resize((size + 1, size), Image.Resampling.LANCZOS)
    pixels = grayscale.load()
    bits: list[str] = []
    for row in range(size):
        for col in range(size):
            left = pixels[col, row]
            right = pixels[col + 1, row]
            bits.append("1" if left > right else "0")
    hex_width = size * size // 4
    return f"{int(''.join(bits), 2):0{hex_width}x}"


def hamming_distance(left: str, right: str) -> int:
    return bin(int(left, 16) ^ int(right, 16)).count("1")


def token_hits(text: str, keywords: Iterable[str]) -> int:
    score = 0
    for keyword in keywords:
        if keyword in text:
            score += 1
    return score


def normalized_alt_key(value: str) -> str:
    normalized = normalize_whitespace(value).lower()
    if len(normalized) < 18:
        return ""
    return normalized


def relevant_page(url: str) -> bool:
    lowered = url.lower()
    if not ("/en/" in lowered and allowed_image_domain(url)):
        return False
    if any(keyword in lowered for keyword in BLOCKED_PAGE_KEYWORDS):
        return False
    return any(keyword in lowered for keyword in STRONG_PAGE_KEYWORDS)


def page_priority(url: str) -> tuple[int, int, str]:
    lowered = url.lower()
    domain_bias = 0 if "stroke.org" in lowered else 1
    strong = token_hits(lowered, STRONG_PAGE_KEYWORDS)
    return (-strong, domain_bias, lowered)


@dataclass
class RawImage:
    page_url: str
    page_title: str
    page_description: str
    source_url: str
    alt: str
    title: str
    css_class: str

    @property
    def text_blob(self) -> str:
        parts = [
            self.page_url,
            self.page_title,
            self.page_description,
            self.source_url,
            self.alt,
            self.title,
            self.css_class,
            Path(urlparse(self.source_url).path).name.replace("_", " ").replace("-", " "),
        ]
        return normalize_whitespace(" ".join(part for part in parts if part)).lower()

    @property
    def image_blob(self) -> str:
        parts = [
            self.source_url,
            self.alt,
            self.title,
            self.css_class,
            Path(urlparse(self.source_url).path).name.replace("_", " ").replace("-", " "),
        ]
        return normalize_whitespace(" ".join(part for part in parts if part)).lower()


@dataclass
class AcceptedImage:
    rank: int
    filename: str
    source_domain: str
    page_url: str
    page_title: str
    alt: str
    image_url: str
    width: int
    height: int
    file_size_bytes: int
    sha256: str
    dhash: str
    score: int


class ImageParser(HTMLParser):
    def __init__(self, page_url: str) -> None:
        super().__init__()
        self.page_url = page_url
        self.title_parts: list[str] = []
        self.description = ""
        self.images: list[dict[str, str]] = []
        self._in_title = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = {key.lower(): (value or "") for key, value in attrs}
        if tag == "title":
            self._in_title = True
            return

        if tag == "meta":
            name = (data.get("name") or data.get("property") or "").lower()
            if name in {"description", "og:description", "twitter:description"} and not self.description:
                self.description = normalize_whitespace(data.get("content", ""))
            return

        if tag != "img":
            return

        self.images.append(
            {
                "src": data.get("src", ""),
                "srcset": data.get("srcset", ""),
                "data-src": data.get("data-src", ""),
                "data-srcset": data.get("data-srcset", ""),
                "data-lazy-src": data.get("data-lazy-src", ""),
                "alt": normalize_whitespace(data.get("alt", "")),
                "title": normalize_whitespace(data.get("title", "")),
                "class": normalize_whitespace(data.get("class", "")),
            }
        )

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_parts.append(data)

    @property
    def title(self) -> str:
        return normalize_whitespace(" ".join(self.title_parts))


def extract_image_candidates(page_url: str, html: str) -> list[RawImage]:
    parser = ImageParser(page_url)
    parser.feed(html)
    candidates: list[RawImage] = []
    for image in parser.images:
        urls: list[str] = []
        for key in ("src", "data-src", "data-lazy-src"):
            value = image.get(key, "")
            if value:
                urls.append(value)
        for key in ("srcset", "data-srcset"):
            urls.extend(parse_srcset(image.get(key, "")))

        for raw_url in urls:
            full_url = urljoin(page_url, raw_url)
            ext = image_extension(full_url)
            if ext not in RASTER_EXTENSIONS:
                continue
            if not allowed_image_domain(full_url):
                continue
            candidates.append(
                RawImage(
                    page_url=page_url,
                    page_title=parser.title,
                    page_description=parser.description,
                    source_url=full_url,
                    alt=image.get("alt", ""),
                    title=image.get("title", ""),
                    css_class=image.get("class", ""),
                )
            )
    return candidates


def image_score(candidate: RawImage) -> int:
    text = candidate.text_blob
    image_text = candidate.image_blob
    if any(term in image_text for term in NEGATIVE_IMAGE_KEYWORDS):
        return -100

    person_hits = token_hits(image_text, PERSON_KEYWORDS)
    if person_hits == 0:
        return -100

    score = 0
    score += person_hits * 4
    score += token_hits(image_text, LIFESTYLE_KEYWORDS) * 2
    score += token_hits(candidate.page_url.lower(), STRONG_PAGE_KEYWORDS) * 2

    if "/healthy-living/" in candidate.page_url.lower():
        score += 2
    if "/life-after-stroke/" in candidate.page_url.lower():
        score += 2
    if "rehab" in text or "recovery" in text:
        score += 2

    if not candidate.alt and person_hits == 0:
        score -= 3

    if any(term in image_text for term in {"food", "recipe", "salad", "vegetable"}) and person_hits == 0:
        score -= 4

    return score


def unique_pages_from_sitemaps(max_pages: int) -> list[str]:
    pages: list[str] = []
    seen: set[str] = set()
    for sitemap in SITEMAPS:
        root = ET.fromstring(fetch_bytes(sitemap))
        for loc in root.findall("sm:url/sm:loc", NS):
            url = normalize_whitespace(loc.text or "")
            if not url or url in seen:
                continue
            if not relevant_page(url):
                continue
            seen.add(url)
            pages.append(url)
    pages.sort(key=page_priority)
    return pages[:max_pages]


def candidate_download_urls(source_url: str) -> list[str]:
    base = strip_query(source_url)
    urls = [base]
    if "/-/media/" in base:
        urls.append(with_width_hint(base, 1600))
        urls.append(with_width_hint(base, 1200))
    deduped: list[str] = []
    seen: set[str] = set()
    for url in urls:
        if url not in seen:
            seen.add(url)
            deduped.append(url)
    return deduped


def duplicate_index(new_hash: str, accepted: list[AcceptedImage]) -> int | None:
    for index, existing in enumerate(accepted):
        if hamming_distance(new_hash, existing.dhash) <= 4:
            return index
    return None


def duplicate_alt_index(new_alt: str, accepted: list[AcceptedImage]) -> int | None:
    alt_key = normalized_alt_key(new_alt)
    if not alt_key:
        return None
    for index, existing in enumerate(accepted):
        if normalized_alt_key(existing.alt) == alt_key:
            return index
    return None


def write_manifest(path: Path, rows: list[AcceptedImage]) -> None:
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(
            [
                "rank",
                "filename",
                "source_domain",
                "page_url",
                "page_title",
                "alt",
                "image_url",
                "width",
                "height",
                "file_size_bytes",
                "sha256",
                "dhash",
                "score",
            ]
        )
        for row in rows:
            writer.writerow(
                [
                    row.rank,
                    row.filename,
                    row.source_domain,
                    row.page_url,
                    row.page_title,
                    row.alt,
                    row.image_url,
                    row.width,
                    row.height,
                    row.file_size_bytes,
                    row.sha256,
                    row.dhash,
                    row.score,
                ]
            )


def build_argument_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Scrape high-resolution lifestyle/person images from heart.org and stroke.org."
    )
    parser.add_argument("--out-dir", default="output/aha-lifestyle-images", help="Output directory")
    parser.add_argument("--min-width", type=int, default=MIN_WIDTH, help="Minimum accepted width in pixels")
    parser.add_argument("--target-count", type=int, default=DEFAULT_TARGET, help="Minimum number of images to keep")
    parser.add_argument("--max-pages", type=int, default=DEFAULT_MAX_PAGES, help="Maximum sitemap pages to inspect")
    parser.add_argument("--overwrite", action="store_true", help="Clear the output directory before writing")
    return parser


def main() -> int:
    args = build_argument_parser().parse_args()
    out_dir = Path(args.out_dir)
    if args.overwrite and out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    pages = unique_pages_from_sitemaps(args.max_pages)
    if not pages:
        print("No candidate pages found.", file=sys.stderr)
        return 1

    raw_candidates: list[tuple[int, RawImage]] = []
    seen_sources: set[str] = set()

    for index, page_url in enumerate(pages, start=1):
        try:
            html = fetch_text(page_url)
        except Exception as error:  # noqa: BLE001
            print(f"[warn] page fetch failed: {page_url} :: {error}", file=sys.stderr)
            continue

        for candidate in extract_image_candidates(page_url, html):
            base_source = strip_query(candidate.source_url)
            if base_source in seen_sources:
                continue
            seen_sources.add(base_source)
            score = image_score(candidate)
            if score < 6:
                continue
            raw_candidates.append((score, candidate))

        if index % 25 == 0:
            print(f"[info] scanned {index}/{len(pages)} pages; candidates={len(raw_candidates)}", file=sys.stderr)

    raw_candidates.sort(
        key=lambda item: (
            -item[0],
            item[1].page_url.lower(),
            item[1].source_url.lower(),
        )
    )

    accepted: list[AcceptedImage] = []
    seen_sha: dict[str, int] = {}
    next_file_number = 1

    for score, candidate in raw_candidates:
        if len(accepted) >= args.target_count:
            break

        selected_url = None
        selected_bytes = b""
        selected_image = None

        for download_url in candidate_download_urls(candidate.source_url):
            try:
                payload = fetch_bytes(download_url, referer=candidate.page_url)
            except Exception:
                continue
            try:
                image = Image.open(BytesIO(payload))
                image.load()
            except (UnidentifiedImageError, OSError):
                continue
            if image.width < args.min_width:
                continue
            selected_url = download_url
            selected_bytes = payload
            selected_image = image
            break

        if not selected_url or selected_image is None:
            continue

        sha256 = hashlib.sha256(selected_bytes).hexdigest()
        if sha256 in seen_sha:
            continue

        perceptual = dhash(selected_image)
        duplicate_at = duplicate_index(perceptual, accepted)
        if duplicate_at is not None:
            existing = accepted[duplicate_at]
            existing_area = existing.width * existing.height
            new_area = selected_image.width * selected_image.height
            if new_area <= existing_area:
                continue
            old_path = out_dir / existing.filename
            if old_path.exists():
                old_path.unlink()
            del seen_sha[existing.sha256]
            accepted.pop(duplicate_at)

        alt_duplicate_at = duplicate_alt_index(candidate.alt or candidate.title, accepted)
        if alt_duplicate_at is not None:
            existing = accepted[alt_duplicate_at]
            existing_area = existing.width * existing.height
            new_area = selected_image.width * selected_image.height
            if new_area <= existing_area:
                continue
            old_path = out_dir / existing.filename
            if old_path.exists():
                old_path.unlink()
            del seen_sha[existing.sha256]
            accepted.pop(alt_duplicate_at)

        filename = (
            f"{next_file_number:03d}_"
            f"{slugify(Path(urlparse(selected_url).path).stem)}"
            f"{image_extension(selected_url) or '.jpg'}"
        )
        next_file_number += 1
        file_path = out_dir / filename
        file_path.write_bytes(selected_bytes)

        accepted.append(
            AcceptedImage(
                rank=len(accepted) + 1,
                filename=filename,
                source_domain=urlparse(selected_url).netloc,
                page_url=candidate.page_url,
                page_title=candidate.page_title,
                alt=candidate.alt or candidate.title,
                image_url=selected_url,
                width=selected_image.width,
                height=selected_image.height,
                file_size_bytes=len(selected_bytes),
                sha256=sha256,
                dhash=perceptual,
                score=score,
            )
        )
        seen_sha[sha256] = len(accepted) - 1

    accepted.sort(key=lambda row: row.rank)
    for rank, row in enumerate(accepted, start=1):
        row.rank = rank

    manifest_csv = out_dir / "manifest.csv"
    manifest_json = out_dir / "manifest.json"
    summary_json = out_dir / "summary.json"

    write_manifest(manifest_csv, accepted)
    manifest_json.write_text(
        json.dumps([row.__dict__ for row in accepted], indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    summary_json.write_text(
        json.dumps(
            {
                "generated_at": int(time.time()),
                "page_count": len(pages),
                "candidate_count": len(raw_candidates),
                "accepted_count": len(accepted),
                "min_width": args.min_width,
                "target_count": args.target_count,
                "output_dir": str(out_dir),
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    print(
        json.dumps(
            {
                "accepted_count": len(accepted),
                "page_count": len(pages),
                "candidate_count": len(raw_candidates),
                "manifest_csv": str(manifest_csv),
                "manifest_json": str(manifest_json),
            }
        )
    )

    if len(accepted) < args.target_count:
        print(
            f"Only collected {len(accepted)} images that met the filters; "
            f"target was {args.target_count}.",
            file=sys.stderr,
        )
        return 2

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
