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

## 2026-04-11
### ID
`DEC-003`

### Status
Accepted

### Confidence
High

### Decision
Optimize the brain around a compact canonical brief, deeper playback ingestion, explicit route deltas, and contradiction tracking so it can answer with fewer tokens and higher precision.

### Why
The brain had strong scaffolding but still relied on too much repeated prose. A smaller fast path improves retrieval efficiency without weakening creativity.

### Files impacted
- `AGENTS.md`
- `knowledge/distilled/canonical-brief.md`
- `knowledge/sources/discovery-playback/master-playback-notes.md`
- `knowledge/sources/discovery-playback/technology-playback-notes.md`
- `knowledge/sources/brand-guidelines/ingest-status.md`
- `design/routes/route-deltas.md`
- `logs/contradictions.md`
- `prompts/codex/fast-brief.md`

### Follow-up
Retry brand-guideline ingestion once the source file is locally readable, then revise the canonical brief and brand source notes.

## 2026-04-13
### ID
`DEC-004`

### Status
Accepted

### Confidence
High

### Decision
Add a direct workbench bridge between the brain and the live Figma board so every section resolves to one canonical brain file, one section node, and deterministic header text update paths.

### Why
The board had become structurally important, but the brain still relied on loose name matching. Direct node mapping improves retrieval speed, removes ambiguity, and prepares the system for code-driven updates to `Direction` and `Reasoning`.

### Files impacted
- `knowledge/sources/figma-design-workbench/`
- `design/figma/workbench-section-map.yaml`
- `design/ui-style-inventory/ai.md`
- `design/ui-style-inventory/image-types.md`
- `design/ui-style-inventory/README.md`
- `design/AGENTS.md`
- `AGENTS.md`

### Follow-up
Populate the empty or strategically sparse board sections, starting with `Accessibility`, `Forms`, `Page templates`, and `Content`.
