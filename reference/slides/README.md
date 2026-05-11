# AHA Slide System Deliverables

## Current files
- `deck-v1.6-all-layouts.html` - full 34-layout source deck (v1.6).
- `deck-v1.6-all-layouts.css` - token-consumer layout/styles file.
- `tokens-v1.6.json` - single source of truth for all core values.
- `deck-v1.6-tokens.css` - generated CSS variables from token JSON.
- `tokens-studio-v1.6.json` - Tokens Studio import payload for Figma variables.
- `layouts.manifest.json` - machine-readable contract (v1.6).
- `aha-slide-system-v1.6.md` - v1.6 spec.
- `media-jpeg/*.jpg` - refined indicative placeholder image pack.

## Archival rule
Older slide-system versions now live in git history instead of a live archive folder.
Keep only the current deliverable set in this directory unless an older file is still actively cited.

## Local preview
```bash
python3 -m http.server 4173 --bind 127.0.0.1
open "http://127.0.0.1:4173/reference/slides/deck-v1.6-all-layouts.html"
```

## Token build command
```bash
node scripts/slides/build-slide-token-css.mjs reference/slides/tokens-v1.6.json reference/slides/deck-v1.6-tokens.css
```

## JPEG placeholder generation
```bash
python3 scripts/slides/generate-placeholder-jpegs.py
```

## QA command
```bash
node scripts/slides/qa-slides.mjs http://127.0.0.1:4173/reference/slides/deck-v1.6-all-layouts.html
```

## Figma variable import runbook (minimal manual)
Current Figma MCP in this environment does not expose variable write/create. Use one plugin import:
1. Open `Tokens Studio`.
2. Import `reference/slides/tokens-studio-v1.6.json`.
3. Sync tokens to native Figma Variables (`Create/Update Variables from Tokens`).

## Font normalization runbook
Capture may still remap text to `Arimo`:
1. Scope-select imported v1.6 node.
2. Replace `Arimo` -> `MW Sans`.
3. Verify heading/body weights and secondary text color.
