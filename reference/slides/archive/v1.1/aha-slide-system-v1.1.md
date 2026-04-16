# AHA Slide Template System v1.1

## Scope
- Build a structure-first template system with shared shell constraints.
- Keep all layouts at `1920x1080` with `40px` side margins.
- Use shared footer on all layouts and minimal header on non-opener layouts.
- Treat non-red/white archetypes as structure references only.

## Shared Shell
- `Shell/Header-Minimal`
- `Shell/Footer-Global`
- `Shell/Content-SafeArea`

### Footer geometry
- Frame: `x=0, y=1016, w=1920, h=64`
- Logo anchor: `x=40`
- Deck name anchor: `right=140`
- Page number anchor: `right=40`

## Placeholder contract
- `ph_header_title`
- `ph_slide_title`
- `ph_slide_subtitle`
- `ph_body_main`
- `ph_body_secondary`
- `ph_visual_1`
- `ph_data_1`
- `ph_table_1`
- `ph_footer_deckname`
- `ph_footer_pagenum`

## Base layout taxonomy (24)
### Openers & Navigation
- `OP-01 Cover / Section Divider`
- `OP-02 Agenda`
- `OP-03 Timeline`

### Text & Narrative
- `TN-01 Big Title Statement`
- `TN-02 Single Narrative`
- `TN-03 Split Narrative`
- `TN-04 Narrative + Visual`

### Data
- `DA-01 Big Number + Context`
- `DA-02 Chart + Commentary`

### Tabular
- `TB-01 Comparison Table`
- `TB-02 Matrix / Workplan Grid`
- `TB-03 Scorecard / Heatmap Grid`

### Findings
- `FI-01 Evidence Stack`
- `FI-02 Synthesis (Evidence -> So What)`
- `FI-03 Mixed Media Findings`
- `FI-04 Diagnostic Board`

### Principles
- `PR-01 Principles Grid`
- `PR-02 Principles with Rationale Cards`

### Visual Explanation
- `VX-01 Annotated Visual`
- `VX-02 Flow / Journey`

### People
- `PE-01 People / Roles Grid`

### Canvas
- `CA-01 Strategic Canvas`

### Closing
- `CL-01 Closer`
- `CL-02 Next Steps`

## Tabular system (PPT-safe faux tables)
- Components:
  - `TableShell`
  - `TableHeaderRow`
  - `TableBodyRow`
  - `TableCell`
  - `TableDivider`
- Rules:
  - One text layer per cell.
  - No merged cells in v1.
  - Fixed line weight (`1px`) and fixed cell padding.
  - Explicit `colSpec` per layout.

### Tabular component API
- `tableType: comparison | matrix | scorecard`
- `colSpec: string[]` (fixed px or `%`)
- `rowCount: number`
- `headerEnabled: boolean`
- `denseMode: boolean`

## Pilot slides implemented
- `TN-03 Split Narrative`
- `OP-01 Cover / Section Divider`
- `FI-02 Synthesis (Evidence -> So What)`
- `PR-01 Principles Grid`
- `CA-01 Strategic Canvas`

## Pilot QA checklist
- Footer is pixel-identical on all 5 slides.
- Header appears on non-opener slides only.
- Content stays inside `40px` side margins.
- Long title/body/bullet copy does not collide with footer.
- Canvas matrix and sidebar remain legible under dense copy.

## v1.2 hardening rules
- Content frame hard lock: `x=40, y=112, w=1840, h=872`.
- Typography hard lock: `MW Sans` for all content text.
- Heading/body hierarchy:
  - headings use `#000000` (or white on red covers)
  - supporting/subline text uses `#444444`
- Adaptive spacing:
  - Display heading (`80px`) -> body gap by line count:
    - 1 line: `128px`
    - 2 lines: `112px`
    - 3+ lines: `96px`
  - Section heading (`42px`) -> body gap by line count:
    - 1-2 lines: `48px`
    - 3+ lines: `36px`
- Lists must be a single text block with native bullets (no icon layers, no one-line-per-container construction).
- Tabular/canvas cells keep fixed row heights with wrap+clip to prevent overflow.
