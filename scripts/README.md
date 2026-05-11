# Scripts

## Job
- Group scripts by purpose.
- Keep entry path obvious.
- Keep common commands easy to find.

## Folders
- `dev/` local preview helpers such as `play.js` and `stop.js`.
- `slides/` slide-system utilities such as token CSS build, placeholder generation, and QA.
- `ppt/` Figma-to-PPT extraction, generation, patching, preview export, and parity QA.
- `brand/` brand capture, catalogue, logo prep, and video helpers.

## Entry points
- `npm run play`
- `npm run stop`
- `npm run project:init -- --title "Project Title" --id project-slug --set-current`
- `npm run figma:check -- --url "https://www.figma.com/design/...?...node-id=..."`
- `npm run ppt:pilot`
- `node scripts/slides/build-slide-token-css.mjs reference/slides/tokens-v1.6.json reference/slides/deck-v1.6-tokens.css`
- `node scripts/slides/qa-slides.mjs http://127.0.0.1:4173/reference/slides/deck-v1.6-all-layouts.html`

## Figma checks
- `npm run figma:check`
- `npm run figma:check -- --url "https://www.figma.com/design/3qEMU5hYtAJ3S7vWGijJhQ/AHA---Design-Workbench?node-id=2138-29678"`
- whether the native remote Figma MCP server is configured in Codex
- whether the native connector is currently logged in
- the work account this repo expects
- the direct native commands to use for account switching
- the next in-app checks for `whoami`, read access, and write access

## Native Figma flow
- `codex mcp logout figma`
- `codex mcp login figma`
- `codex mcp list`

## Figma verify
1. Use the browser profile signed into `alexander.beck@mrm.com`.
2. Run `codex mcp logout figma` before any intentional rebind.
3. Run `codex mcp login figma` directly, with no wrapper script.
4. Complete OAuth in the already-open work browser profile.
5. Confirm `whoami` returns `alexander.beck@mrm.com` before real work.
- Inside Codex, run `whoami`.
- Then run `get_metadata` or `get_design_context`.
- Then run one reversible `use_figma` write test.
- Treat `alxbeck@me.com` as unsupported for this repo.
- Do not use private windows, desktop write bridges, or wrapper auth scripts.
