# Scripts

Scripts are grouped by purpose so it is easier to find the right entry point.

## Folders
- `dev/` local preview helpers such as `play.js` and `stop.js`.
- `slides/` slide-system utilities such as token CSS build, placeholder generation, and QA.
- `ppt/` Figma-to-PPT extraction, generation, patching, preview export, and parity QA.
- `brand/` brand capture, catalogue, logo prep, and video helpers.

## Common entry points
- `npm run play`
- `npm run stop`
- `npm run ppt:pilot`
- `node scripts/slides/build-slide-token-css.mjs slides/tokens-v1.6.json slides/deck-v1.6-tokens.css`
- `node scripts/slides/qa-slides.mjs http://127.0.0.1:4173/slides/deck-v1.6-all-layouts.html`
