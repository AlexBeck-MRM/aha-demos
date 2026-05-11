# UI Style Inventory

Each file in this folder records:
- the current direction
- the reasoning behind it
- any route-specific emphasis
- open questions that still need evidence

Use this folder when the conversation moves from broad art direction into concrete interface decisions.
Use `design/figma/workbench-section-map.yaml` when you need the direct Figma section node, editable header text paths, or the current board-content status for a given inventory topic.

## Local reference notes
- `wireframe-style.md` records the current low-fidelity wireframe language from the homepage mock-up reference. It is local-only until a matching Figma workbench section exists.

## Freshness fields
Board-linked files in this folder must declare:
- `project_id`
- `source_of_truth`
- `figma_section`
- `figma_node_id`
- `sync_status`
- `last_synced_from_figma`
- `content_version`

If `sync_status` is not current, read Figma first and refresh the file before relying on it.
