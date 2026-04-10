# Recommendation Review

## 2026-04-10

### REC-001
Status: kept in adapted form

Recommendation: make `knowledge/sources/` a real source layer instead of a set of thin stubs.

Decision:
- Kept the core point.
- Added source indexes, canonical-source notes, and current-site observation files.
- Discarded the suggestion to add empty `raw/` scaffolding right now because empty containers without ingested material create noise and false completeness.

### REC-002
Status: kept

Recommendation: create the UI style inventory immediately.

Decision:
- Kept.
- Added the full first-pass inventory across the listed UI categories.

### REC-003
Status: kept in adapted form

Recommendation: repair evidence retrieval and expand reference indexing.

Decision:
- Kept the evidence-contract fix.
- Added `evidence/screenshots/.gitkeep`, updated `evidence/README.md`, and created `evidence/reference-index.yaml`.
- Discarded a broad expansion of `design/references/manifest.yaml` to every capture for now because that would require invented metadata rather than grounded notes.

### REC-004
Status: kept

Recommendation: make distilled knowledge traceable.

Decision:
- Kept.
- Added front matter with status, ownership, source refs, and decision refs to the main distilled, language, and design documents.

### REC-005
Status: kept

Recommendation: deepen the logs so they preserve working memory.

Decision:
- Kept.
- Added IDs and statuses to key logs and created dated session notes.

### REC-006
Status: kept

Recommendation: strengthen prompt grounding.

Decision:
- Kept.
- Updated prompt contracts to require sources reviewed, decision IDs, ambiguities, and file updates.
- Added source-ingest, evidence-synthesis, and inventory-update prompts.

### REC-007
Status: kept

Recommendation: add real verification.

Decision:
- Kept.
- Added `scripts/docs/verify-design-brain.mjs` and wired `npm test` and `npm run lint` to it.

### REC-008
Status: kept in adapted form

Recommendation: reposition the root experience around the brain and add specialized guidance close to the work.

Decision:
- Kept the README rewrite, nested guidance files, and brain-oriented framing.
- Kept `.codex/config.toml` intentionally minimal because `AGENTS.md` is the primary control surface and extra config would not materially improve grounding right now.

### REC-009
Status: kept

Recommendation: deepen the language layer so copy guidance becomes retrievable.

Decision:
- Kept.
- Added audience, CTA, page-pattern, and route-voice guidance files.

### REC-010
Status: kept

Recommendation: add a local brain-audit skill.

Decision:
- Kept.
- Added `skills/design-brain-auditor/SKILL.md`.
