# 2026-04-13 Figma Workbench Bridge

## Task
Map each Figma workbench section back to its canonical brain file, record direct editable header text paths, and audit the board structure for missing or redundant areas.

## Sources reviewed
- `knowledge/sources/figma-design-workbench/index.md`
- `design/figma/workbench-section-map.yaml`
- `design/ui-style-inventory/`
- live Figma desktop MCP reads for canvas `2138:29519` and header symbol `2126:23`

## What changed in project understanding
- The board is now explicit as a source layer instead of an implicit working surface.
- The board contains two sections that previously had no canonical brain file: `AI` and `Image types`.
- Several strategically important sections exist only as placeholders and need real content before they can guide decisions reliably.

## Decisions made
- Add a direct operational bridge from brain files to Figma section nodes and editable header text paths.
- Treat `Image types` as a taxonomy layer rather than a duplicate of photography or illustration treatment.
- Keep `AI` as a provisional inventory category until stronger evidence arrives.

## Open questions
- Which empty board sections should be populated first: `Accessibility`, `Forms`, `Page templates`, or `Content`?
- Should `AI` stay a top-level inventory section or move under search and guidance once the pattern is clearer?
