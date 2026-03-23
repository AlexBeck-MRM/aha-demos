# AHA Research

Working repo for AHA visual research, slide-system work, and brand-capture evidence.

## Folder map

- `slides/` current slide-system source files and specs. `v1.6` is the latest set.
- `scripts/` automation for capture, slide token generation, Figma/PPT extraction, and QA.
- `evidence/` retained research evidence and recordings.
- `data/` source CSV inputs for capture/catalogue work.
- `assets/` shared brand assets.
- `css.html`, `shader.html`, `index.html`, `js/`, `styles.css` interactive visual experiment entry points.

Generated folders are intentionally not committed:

- `build/`
- `dist/`
- `output/`
- `reports/`
- `node_modules/`

## Common commands

Install dependencies:

```bash
npm install
```

Clean generated output:

```bash
rm -rf build dist output reports .aha-server.pid
```

Run the local visual preview launcher:

```bash
npm run play
```

Stop the managed preview server:

```bash
npm run stop
```

Preview the latest slide system directly:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
open "http://127.0.0.1:4173/slides/deck-v1.6-all-layouts.html"
```

## Slide workflow

Rebuild token CSS:

```bash
node scripts/build-slide-token-css.mjs slides/tokens-v1.6.json slides/deck-v1.6-tokens.css
```

Run slide QA:

```bash
node scripts/qa-slides-v1.5.mjs http://127.0.0.1:4173/slides/deck-v1.6-all-layouts.html
```

## PPT pilot workflow

```bash
npm run ppt:pilot
```

This writes generated artifacts into ignored folders under `build/`, `dist/`, and `reports/`.
