# One-Colour Topic Icon Sheet Review

## Status
- Project: `aha-website-refresh`.
- Date: `2026-06-24`.
- Status: candidate review asset.
- Style name: `Chunky One-Colour Flat Line`.
- Output type: transparent bitmap topic sheet.

## Review Files
- `aha-one-colour-topic-icons-v2-alpha-cutout-grid.png`
- `cutouts-v2/`
- `aha-one-colour-topic-icons-v1-alpha-cutout-grid.png`
- `aha-one-colour-topic-icons-v1-alpha-clean-large.png`
- `aha-one-colour-topic-icons-v1-alpha-clean.png`
- `aha-one-colour-topic-icons-v1-alpha.png`
- `aha-one-colour-topic-icons-v1-chromakey.png`

## Processing Files
- `aha-one-colour-topic-icons-v2-chromakey.png`
- `aha-one-colour-topic-icons-v2-chromakey-large.png`
- `aha-one-colour-topic-icons-v2-alpha-red-only.png`
- `aha-one-colour-topic-icons-v2-alpha-cutout-grid-raw.png`

## Current Pick
- Use `aha-one-colour-topic-icons-v2-alpha-cutout-grid.png`.
- Use `cutouts-v2/` for the 54 separate same-size transparent PNGs.
- Treat `aha-one-colour-topic-icons-v2-alpha-red-only.png` and `aha-one-colour-topic-icons-v2-alpha-cutout-grid-raw.png` as processing intermediates, not review picks.

## Cutout Grid
- Canvas: `8064 x 5376`.
- Columns: `8`.
- Rows: `7`.
- Cell size: `1008 x 768`.
- Occupied cells: `54`.
- Empty cells: final row, columns `7` and `8`.

## Source
- Prompt source: `prompts/image-generation/one-colour-topic-icon-sheet.md`.
- Reference image: `/var/folders/rw/9jhrlh_10712yxzp7d29g8440000gn/T/codex-clipboard-426be1ac-1ef9-498d-ae61-e279de457122.png`.
- Generated chroma-key source: `/Users/alexanderbeck/.codex/generated_images/019ef4cd-64a3-7b00-867e-658139c8abf0/ig_00a15fc83ecc8564016a3be5c88e48819597c1b612120206c2.png`.
- Revision source for `v2`: `/Users/alexanderbeck/.codex/generated_images/019ef4cd-64a3-7b00-867e-658139c8abf0/ig_017cfe71e46d6237016a3bead19cc881919f40ad5ba37f62c8.png`.
- Revision references: `/Users/alexanderbeck/Library/Application Support/CleanShot/media/media_sZ3WLbPdBB/CleanShot 2026-06-24 at 15.27.21.jpg` and `/Users/alexanderbeck/Library/Application Support/CleanShot/media/media_HdrufAaHqA/CleanShot 2026-06-24 at 15.27.31.jpg`.

## Validation
- Final file is `RGBA`.
- Final dimensions are `8064 x 5376`.
- Transparent corner alpha values are all `0`.
- Visible pixels are sanitized to AHA red `#c8102e`.
- Green fringe check found `0` greenish visible pixels.
- `v2` removes white/off-white fills and keeps only red linework.
- `v2` sheet validation found `0` non-red visible pixels, `0` visible white pixels, `0` visible green pixels, and `0` non-white RGB values behind fully transparent pixels.
- `cutouts-v2/` contains `54` files. Each cutout is `1008 x 768`, has transparent corners, and has `0` non-red, white, or green visible pixels.
- The `v2` cutouts were generated with component-aware cropping so adjacent row fragments are not included in the individual files.

## Notes
- This is a bitmap review asset, not vector source.
- The final cutout grid intentionally uses rectangular cells because the generated sheet followed a landscape layout. Use the recorded cell size for consistent extraction.
- The `v2` revision was created to reduce line collisions in dense chunky icons, especially emergency and pill forms, and to remove white fills from closed outlines.
- The source image includes a few topic symbols that inherently use marks, such as information and blood pressure readings. These are retained as topic signals, not labels.
- The processing files are retained here for traceability, but the durable lookup surfaces should point to the review pick and cutouts rather than the chromakey/raw intermediates.
