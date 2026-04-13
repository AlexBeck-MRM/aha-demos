# AHA Slide System v1.3

## Scope
- Full 24 base layouts implemented from taxonomy.
- Structure-first delivery for Figma <-> PPT round-trip reliability.
- Side-by-side rollout: pilot files retained, v1.3 added as new source set.

## Global shell contract
- Slide: `1920x1080`.
- Content frame: `x=40, y=112, w=1840, h=872`.
- Footer: `x=0, y=1016, w=1920, h=64`.
- Header: left title only, no top divider line, no right meta/pill.
- `OP-01` hides header.

## Typography and color contract
- Font family target: `MW Sans`.
- Primary headings: `#000000` (`#FFFFFF` on red divider).
- Secondary/supporting text: `#444444`.
- Type tokens:
  - Display: `80/0.98/600`
  - Section: `42/1.16/600`
  - Card: `28/1.06/600`
  - Body: `22/1.16/400`
  - Footer: `16/1.2/400`

## Adaptive spacing
- Display heading to next body block:
  - 1 line: `128px`
  - 2 lines: `112px`
  - 3+ lines: `96px`
- Section heading to next body block:
  - 1-2 lines: `48px`
  - 3+ lines: `36px`

## List and table/canvas rules
- Lists are single text objects with native bullets/numbering.
- No custom bullet icons and no one-line-per-container list construction.
- Element borders are minimized globally; linework is reserved for structurally necessary grids (tables/matrix).
- Tabular layout uses fixed row/column geometry.
- Cell text wraps and clips in-cell.
- No merged cells in v1.3.

## Placeholder semantics
- Visual placeholders are neutral and diagrammatic, with content-type cues:
  - photo-like placeholder blocks
  - chart-like placeholder blocks
  - flow/diagram placeholders
- Placeholders remain generic (non-branded) for reusable template behavior.

## Placeholder contract (unchanged)
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

## Delivered base layouts (24)
- Openers & Navigation: `OP-01`, `OP-02`, `OP-03`
- Text & Narrative: `TN-01`, `TN-02`, `TN-03`, `TN-04`
- Data: `DA-01`, `DA-02`
- Tabular: `TB-01`, `TB-02`, `TB-03`
- Findings: `FI-01`, `FI-02`, `FI-03`, `FI-04`
- Principles: `PR-01`, `PR-02`
- Visual Explanation: `VX-01`, `VX-02`
- People: `PE-01`
- Canvas: `CA-01`
- Closing: `CL-01`, `CL-02`

## Font normalization workflow (capture remap safeguard)
1. Capture/import full deck into Figma.
2. If imported text maps to `Arimo`, run file-scoped font replace:
   - Find: `Arimo`
   - Replace: `MW Sans`
3. Verify heading weights map to intended `600` style.
4. Re-check secondary text color (`#444444`) and red-divider white text.
