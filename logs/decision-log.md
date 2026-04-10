# Decision Log

## 2026-04-10
### ID
`DEC-001`

### Status
Accepted

### Confidence
High

### Decision
Restructure the repo into a retrieval-first design brain with explicit layers for knowledge, language, design, prompts, logs, and templates.

### Why
The existing repo already contains useful evidence, workflow drafts, and system artifacts, but Codex needs a clearer source hierarchy to behave like a grounded design partner.

### Files impacted
- `AGENTS.md`
- `knowledge/`
- `language/`
- `design/`
- `prompts/`
- `logs/`
- `templates/`
- `README.md`
- `scripts/docs/verify-design-brain.mjs`

### Follow-up
Ingest official brand-guideline source material and discovery playback artifacts into `knowledge/sources/`.

## 2026-04-10
### ID
`DEC-002`

### Status
Accepted

### Confidence
High

### Decision
Adopt the subagent audit recommendations selectively and integrate the accepted ones into the brain's operating memory.

### Why
The audit identified real grounding, traceability, and verification gaps, but not every structural suggestion deserved more scaffolding. The accepted recommendations improve source fidelity and collaboration quality without creating empty ceremony.

### Files impacted
- `knowledge/sources/index.yaml`
- `evidence/reference-index.yaml`
- `logs/recommendation-review.md`
- `scripts/docs/verify-design-brain.mjs`
- `logs/decision-log.md`

### Follow-up
When new evidence or brand source files arrive, update the source indexes before expanding distilled guidance.
