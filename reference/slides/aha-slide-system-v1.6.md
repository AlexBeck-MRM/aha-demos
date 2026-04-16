# AHA Slide System v1.6

## Scope
- 34 layouts delivered (24 base + 10 extensions).
- Final pass focused on: tokenization completeness, realistic content mapping from source board, PPTX-ready formatting, and red-background expansion.

## Source content strategy
- Source section: `Untitled / Types of Slides` (`node-id=0:1846`).
- Content was mapped by archetype using recurring source themes:
  - What we deliver
  - GenAI value signal (`463Bn`)
  - Technology canvas and dependencies
  - MRM next-step language
- If exact source copy caused layout collision, content was shortened while preserving intent.

## Tokenization
- Token source: `slides/tokens-v1.6.json`.
- Generated CSS vars: `slides/deck-v1.6-tokens.css`.
- Styling file: `slides/deck-v1.6-all-layouts.css`.
- Constraint achieved in v1.6: no hardcoded `px` or hex values in CSS.

## Color + icon policy
- Primary text: black.
- Secondary/supporting text: `#444444`.
- Accent: red-only (`#D3031F`).
- Icons: black.
- Split-color section headlines removed.
- Colored emphasis reserved for quote/display contexts and key numbers.

## Typography policy
- Body/supporting text remains regular weight (400).
- Low-copy pages can switch to larger body classes (`body-lg`, `body-xl`) for better screen fill.
- Heading-to-body spacing increased and tokenized.

## Placeholder media policy
- Placeholder visuals are real image assets and importable:
  - `slides/media-jpeg/diagram-placeholder.jpg`
  - `slides/media-jpeg/photo-placeholder.jpg`
  - `slides/media-jpeg/annotated-placeholder.jpg`
  - `slides/media-jpeg/chart-placeholder.jpg`
  - `slides/media-jpeg/flow-placeholder.jpg`
  - `slides/media-jpeg/hero-placeholder-a.jpg`
  - `slides/media-jpeg/hero-placeholder-b.jpg`

## New red-background layouts in v1.6
- `RD-01` Red Section Divider
- `RD-02` Red Typographic Quote
- `RD-03` Red Metric Hero

## Final delivered layout list (34)
- Openers: `OP-01`, `OP-02`, `OP-03`
- Text/Narrative: `TN-01`, `TN-02`, `TN-03`, `TN-04`
- Data: `DA-01`, `DA-02`
- Tabular: `TB-01`, `TB-02`, `TB-03`
- Findings: `FI-01`, `FI-02`, `FI-03`, `FI-04`
- Principles: `PR-01`, `PR-02`
- Visual: `VX-01`, `VX-02`, `LI-01`
- People: `PE-01`
- Canvas: `CA-01`
- Closing: `CL-01`, `CL-02`
- Typographic: `TY-01`, `TY-02`, `TY-03`, `TY-04`
- Image-led: `IM-01`, `IM-02`
- Red background: `RD-01`, `RD-02`, `RD-03`

## Known workflow limits
- Figma MCP currently supports variable reading but not variable creation/write in this environment.
- Result: one manual Tokens Studio import remains required to materialize variables in Figma.
