# Flat Clinical Line Icon Review

## Status
- Project: `aha-website-refresh`.
- Date: `2026-06-23` to `2026-06-24`.
- Status: candidate review asset.
- Style name: `Flat Clinical Line`; v2 explores `Chunky Flat Line`; v5 explores `Chunky Warm Grey Duo Line`.
- Output type: bitmap reference sheet.

## Files
- `aha-flat-clinical-line-12-sheet-v1.png`
- `aha-flat-clinical-line-12-sheet-v2.png`
- `aha-flat-clinical-line-12-sheet-v3-no-backgrounds.png`
- `aha-flat-clinical-line-12-sheet-v4-duo-colour.png`
- `aha-flat-clinical-line-12-sheet-v5-warm-grey.png`

## Source
- Prompt source: `prompts/image-generation/flat-clinical-line-icon-sheet.md`
- v1 generated source copy: `/Users/alexanderbeck/.codex/generated_images/019ef4cd-64a3-7b00-867e-658139c8abf0/ig_05ed5c84755d0e1f016a3a9a75d9688198944fa7cf19c8a3ed.png`
- v2 generated source copy: `/Users/alexanderbeck/.codex/generated_images/019ef4cd-64a3-7b00-867e-658139c8abf0/ig_077d031571844bd5016a3b99ad111c8191bc50ef04eb8e674e.png`
- v4 generated source copy: `/Users/alexanderbeck/.codex/generated_images/019ef4cd-64a3-7b00-867e-658139c8abf0/ig_0892fd6c260a2fda016a3b9da30c9081919072f96f61f85879.png`
- v5 source: local recolour of v4 from purple support strokes to warm grey.

## Notes
- This is a bitmap candidate, not a vector source file.
- This does not replace the accepted `Medical Soft Spatial - Colour Block` direction.
- Use this sheet to evaluate a flatter utility-forward line language for compact UI contexts.
- Treat `v5-warm-grey` as the current review pick when exploring the chunkier, no-background line direction with a second colour.

## Review Read
- Strengths: clear flat line language, restrained red signals, good subject coverage, simple enough for dense UI.
- Watchouts: some details are still image-model artifacts rather than production-drawn icon logic, especially hand construction and subtle antialiasing softness.
- v2 moves closer to the supplied example through heavier red strokes, simpler geometry, pale blush circular fields, and less charcoal detail.
- v3 removes the pale blush circular fields from v2 while preserving the chunky red bitmap linework.
- v4 combines v3's chunky no-background structure with a red-plus-purple hierarchy so secondary icon parts can work without adding extra detail.
- v5 replaces the purple support colour from v4 with warm grey, which feels calmer and sits better with the red linework.
