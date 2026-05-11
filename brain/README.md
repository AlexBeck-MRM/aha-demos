# Brain Router

## Job
- Hold deterministic routing contract for design brain.
- Fix read path before substantive work starts.
- Fix write path before derived files change.

## Use
- Read `router.yaml` first for intent routing.
- Read `ops-language.md` for operational file language.
- Treat repo hierarchy as source map, not as free-form browse space.

## Flow
1. Resolve active project through `projects/current-project.yaml`.
2. Read `projects/<project>/retrieval-index.yaml`.
3. Match task to intent in `brain/router.yaml`.
4. Read required files for that intent.
5. Write only to allowed targets.

## Rule
- Router narrows path.
- Router does not replace source-of-truth order.
