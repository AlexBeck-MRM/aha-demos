# Figma Design Workbench

## Purpose
Capture the live AHA design workbench board as an inspectable source layer, not just a visual scratchpad.

## Working use
- Use this folder when the question depends on the current Figma board structure, section contents, or board-level annotations.
- Use `design/figma/workbench-section-map.yaml` as the operational bridge from brain files to Figma node ids.
- Treat the live Figma board as the source of truth for board-linked inventory topics. Markdown should only be treated as a synced cache.

## Access note
This source should be accessed through the native remote Figma MCP connector.
For this repo, use the work browser profile signed into `alexander.beck@mrm.com`, then re-authenticate the native connector with direct `codex mcp logout figma` / `codex mcp login figma` commands.
Treat any other bound account as not ready for authoritative workbench reads or writes.
