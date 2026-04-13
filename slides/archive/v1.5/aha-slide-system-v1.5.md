# AHA Slide System v1.5

## Scope
- Full 24 base layouts + 7 extension layouts delivered (31 total).
- Structure-first delivery for Figma <-> PPT parity.
- v1.5 focus: tokenization, red-only accents, stronger typographic rhythm, and media-backed placeholders.

## Global shell contract
- Slide: `1920x1080`.
- Content frame: `x=40, y=112, w=1840, h=872`.
- Footer: `x=0, y=1016, w=1920, h=64`.
- Header: left title only, no divider, no right meta/pill.
- `OP-01` hides header.

## Tokenization contract
- Source tokens: `slides/tokens-v1.5.json`.
- Generated CSS variables: `slides/deck-v1.5-tokens.css`.
- All global color/type/spacing shell rules read from tokens.
- HTML has no inline style attributes.

## Typography + color contract
- Font family target: `MW Sans`.
- Primary headings: `#000000` (`#FFFFFF` on red cover/divider).
- Secondary/supporting text: `#444444`.
- Accent usage: red-only (`#D3031F`).
- Icons: black.
- Numbers/stat emphasis: red.
- No split-word color treatment in headlines.

## Adaptive type rhythm
- Display heading to following body: larger spacing in v1.5 (`132/116/102` tokenized steps).
- Section heading to following body: larger spacing in v1.5 (`54/42` tokenized steps).
- Low-copy slides can switch to larger body scale (`body-lg` / `body-xl`) without changing the base text styles.

## List + table/canvas rules
- Lists remain single text blocks with native bullets/numbering.
- No custom bullet icon glyphs for list construction.
- Borders minimized on non-tabular surfaces.
- Table/canvas geometry remains fixed and overflow-safe.
- No merged cells.

## Placeholder media rule
- Visual placeholders are now real image assets (`slides/media/*.svg`) so Figma imports include clear media context:
  - diagram
  - photo
  - annotated visual
  - chart
  - flow
  - large-image placeholders

## New layout in v1.5
- `LI-01` — Five-Column Icon Pillars (large icon anchors + bigger pillar titles).

## Delivered layouts (31)
- Openers & Navigation: `OP-01`, `OP-02`, `OP-03`
- Text & Narrative: `TN-01`, `TN-02`, `TN-03`, `TN-04`
- Data: `DA-01`, `DA-02`
- Tabular: `TB-01`, `TB-02`, `TB-03`
- Findings: `FI-01`, `FI-02`, `FI-03`, `FI-04`
- Principles: `PR-01`, `PR-02`
- Visual Explanation: `VX-01`, `VX-02`, `LI-01`
- People: `PE-01`
- Canvas: `CA-01`
- Closing: `CL-01`, `CL-02`
- Typographic: `TY-01`, `TY-02`, `TY-03`, `TY-04`
- Image-led: `IM-01`, `IM-02`

## Figma variable workflow
- MCP currently supports reading Figma variables but does not expose variable creation/write in this environment.
- Use Tokens Studio import (`tokens-studio-v1.5.json`) and push to native Figma Variables.

## Font normalization safeguard
1. Capture/import v1.5 deck.
2. If text maps to `Arimo`, bulk replace with `MW Sans` in the imported node scope.
3. Re-check heading weights and secondary text color.
