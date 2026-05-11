# Figma Workbench Bridge

Use `design/figma/workbench-section-map.yaml` as the direct bridge between the brain and the live Figma workbench.

## What it contains
- one entry per board section
- the canonical brain file for that section
- the Figma section node id
- the reusable header instance node id
- direct text update paths for the section title, `Direction`, and `Reasoning`
- a compact summary of current example and annotation content

## Header text paths
The workbench uses the reusable `header` symbol `2126:23`.

Within any section header instance:
- `2126:6` is the section title
- `2126:17` is the direction body text
- `2126:15` is the reasoning body text

Given a section header instance id, the editable paths are:
- `<header-instance-id>/2126:6`
- `<header-instance-id>/2126:17`
- `<header-instance-id>/2126:15`

## Retrieval rule
If a user references a board section by name, open the matching entry in `design/figma/workbench-section-map.yaml` before reading broader board metadata.

## Sync rule
For any board-linked inventory topic:
1. read the live Figma section first
2. compare the result to the Markdown file metadata
3. update the Markdown file if `sync_status` is not current
4. only then use the Markdown file as a compact cached summary

Markdown is a synced cache for these topics, not the source of truth.

## Connector rule
Use the native remote Figma MCP connector as the canonical path for workbench reads and writes.
In this repo, the expected account is `alexander.beck@mrm.com`.
Account switching should happen through the work browser profile plus direct `codex mcp logout figma` / `codex mcp login figma` commands, not through wrapper scripts or local bridge tooling.
Treat any other bound account as not ready for live workbench edits.
