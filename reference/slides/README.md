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

## Archived versions
- `archive/v1.1/` - early spec-only snapshot.
- `archive/v1.3/` - v1.3 deck and spec.
- `archive/v1.4/` - v1.4 deck and spec.
- `archive/v1.5/` - v1.5 deck, tokens, and spec.

## Local preview
```bash
python3 -m http.server 4173 --bind 127.0.0.1
open "http://127.0.0.1:4173/slides/deck-v1.6-all-layouts.html"
```

## Token build command
```bash
node scripts/slides/build-slide-token-css.mjs slides/tokens-v1.6.json slides/deck-v1.6-tokens.css
```

## JPEG placeholder generation
```bash
python3 scripts/slides/generate-placeholder-jpegs.py
```

## QA command
```bash
node scripts/slides/qa-slides.mjs http://127.0.0.1:4173/slides/deck-v1.6-all-layouts.html
```

## Capture/import runbook (Figma)
- Target file key: `Mn0vZrL7nud32WjHcSVear`
- Source URL: `http://127.0.0.1:4173/slides/deck-v1.6-all-layouts.html`
- Use HTML-to-design capture with `outputMode: existingFile`.
- Import side-by-side; do not overwrite prior nodes.

## Figma variable import runbook (minimal manual)
Current Figma MCP in this environment does not expose variable write/create. Use one plugin import:
1. Open `Tokens Studio`.
2. Import `slides/tokens-studio-v1.6.json`.
3. Sync tokens to native Figma Variables (`Create/Update Variables from Tokens`).

## Font normalization runbook
Capture may still remap text to `Arimo`:
1. Scope-select imported v1.6 node.
2. Replace `Arimo` -> `MW Sans`.
3. Verify heading/body weights and secondary text color.
