# Ops Language

## Job
- Cut language drift in operational files.
- Keep retrieval cheap.
- Keep writes predictable.

## Scope
- Use for `brain/*.md`.
- Use for `projects/*.md`.
- Use for `logs/*.md`.
- Use for operational templates.
- Do not use for design direction, route expression, or Figma `Direction` and `Reasoning`.

## Rules
- Use fixed headings.
- Use bullets or numbered steps only.
- Keep one point per line.
- Keep nouns stable.
- Put meaning in fields before prose.
- Prefer fragments over polished paragraphs.

## Canonical verbs
- `add`
- `update`
- `remove`
- `keep`
- `use`
- `read`
- `write`
- `log`
- `sync`
- `test`
- `verify`
- `defer`

## Banned drift
- `introduce`
- `revise`
- `preserve`
- `evaluate`
- `leverage`
- `utilize`
- `optimize`
- `frictionless`
- `seamless`

## File schemas
### Decision log
- Use entry order: `ID`, `Project ID`, `Status`, `Confidence`, `Decision`, `Why`, `Files`, `Next`.

### Route log
- Use entry order: `ID`, `Project ID`, `Status`, `Shared base`, `Route A`, `Route B`, `Next`.

### Project brief
- Use section order: `State`, `Scope`, `Canonical refs`, `Storage rule`.

### Project session log
- Use entry order: `Task`, `Change`, `Files`, `Next`.

### Open questions
- Use section order: `Retrieval`, `Board`, `Ops`.
