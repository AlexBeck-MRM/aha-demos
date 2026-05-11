# Decision Log

## 2026-04-10
### ID
`DEC-001`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Repo restructured.
- Layers explicit.
- Retrieval first.

### Why
- Existing repo already had useful evidence and workflow drafts.
- Source hierarchy too loose for grounded retrieval.
- Clear layers cut drift.

### Files
- `AGENTS.md`
- `knowledge/`
- `language/`
- `design/`
- `prompts/`
- `logs/`
- `templates/`
- `README.md`
- `scripts/docs/verify-design-brain.mjs`

### Next
- Ingest official brand-guideline source material.
- Ingest discovery playback artifacts into `knowledge/sources/`.

## 2026-04-10
### ID
`DEC-002`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Audit recommendations accepted selectively.
- Accepted parts moved into operating memory.

### Why
- Audit found grounding, traceability, verification gaps.
- Not every structural suggestion deserved more scaffolding.
- Accepted parts improve source fidelity without empty ceremony.

### Files
- `knowledge/sources/index.yaml`
- `reference/evidence/reference-index.yaml`
- `logs/decision-log.md`
- `scripts/docs/verify-design-brain.mjs`

### Next
- Update source indexes before expanding distilled guidance.
- Keep new evidence tied to source layer first.

## 2026-04-11
### ID
`DEC-003`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Brain tightened around compact canonical brief.
- Playback ingest deeper.
- Route deltas explicit.
- Contradiction tracking added.

### Why
- Brain already had strong scaffolding.
- Repeated prose still too heavy.
- Smaller fast path cuts tokens without killing creativity.

### Files
- `AGENTS.md`
- `knowledge/distilled/canonical-brief.md`
- `knowledge/sources/discovery-playback/master-playback-notes.md`
- `knowledge/sources/discovery-playback/technology-playback-notes.md`
- `knowledge/sources/brand-guidelines/ingest-status.md`
- `design/routes/route-deltas.md`
- `logs/decision-log.md`

### Next
- Retry brand-guideline ingest when source file becomes readable.
- Update canonical brief and brand source notes after ingest.

## 2026-04-13
### ID
`DEC-004`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Direct workbench bridge added.
- Each board section maps to one brain file.
- Each board section maps to one node path.
- Header update path fixed.

### Why
- Board became structurally important.
- Brain still relied on loose name matching.
- Direct node mapping cuts ambiguity and speeds retrieval.
- Bridge prepares code-driven header updates.

### Files
- `knowledge/sources/figma-design-workbench/`
- `design/figma/workbench-section-map.yaml`
- `design/ui-style-inventory/README.md`
- `design/AGENTS.md`
- `AGENTS.md`

### Next
- Populate strategically sparse board sections.
- Start with `Accessibility`, `Forms`, `Page templates`, `Content`.

## 2026-04-16
### ID
`DEC-005`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Live repo trimmed.
- Keep active source-of-truth material.
- Keep curated generated assets.
- Keep selected primary evidence.
- Remove excess derivative prompt and archive weight.

### Why
- Repo stored too many derivative files.
- Many files already lived in stronger sources, git history, or easy recapture paths.
- Excess weight slowed navigation and weakened retrieval signal.

### Files
- `README.md`
- `.gitignore`
- `package.json`
- `prompts/image-generation/`
- `reference/evidence/`
- `reference/slides/`
- `scripts/docs/verify-design-brain.mjs`

### Next
- Keep regeneration input for new archives or capture sets.
- Promote only files cited by `knowledge/`, `design/`, or live Figma workbench.

## 2026-04-16
### ID
`DEC-006`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Deterministic routing layer added.
- Project-state registry added.
- Active project now explicit.
- Read path fixed by intent.
- New project state stored in one canonical place.

### Why
- Repo already had strong source hierarchy.
- Model path still depended too much on prompt interpretation.
- Router, retrieval indexes, project folders, stronger verification make retrieval and writing more predictable.
- Design work stays flexible.

### Files
- `brain/`
- `projects/`
- `scripts/docs/verify-design-brain.mjs`
- `scripts/docs/init-project.mjs`
- `AGENTS.md`
- `README.md`
- `templates/`

### Next
- Retrofit project binding across derived docs.
- Make verifier require `project_id` explicitly.

## 2026-04-16
### ID
`DEC-007`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Caveman ops layer added.
- Operational markdown now uses fixed headings plus bullets.
- Controlled verb set defined.
- Drift words blocked in validator.

### Why
- Operational files do not need expressive language range.
- Smaller language space lowers output variance.
- Fixed schema makes retrieval, writing, review cheaper.
- Design voice stays separate.

### Files
- `brain/ops-language.md`
- `logs/decision-log.md`
- `logs/route-evolution.md`
- `projects/`
- `templates/`
- `scripts/docs/verify-design-brain.mjs`

### Next
- Keep operational files in schema.
- Keep design files out of caveman ops layer.

## 2026-04-17
### ID
`DEC-008`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Style-inventory copy should stay short, source-backed, and board-synced.
- Thin sections should be tightened.
- Bloated supporting notes should be compressed.
- Missing live-board sections should be marked explicitly instead of pretending they are current.

### Why
- The live workbench now carries stronger annotation detail in several sections than the repo copy reflected.
- Some inventory files were still too generic, while others had started to accumulate more prose than decision signal.
- Two mapped sections still do not resolve on the live board, so treating them as current would weaken trust in the inventory.

### Files
- `design/ui-style-inventory/nav-elements.md`
- `design/ui-style-inventory/buttons.md`
- `design/ui-style-inventory/cards.md`
- `design/ui-style-inventory/depth.md`
- `design/ui-style-inventory/responsiveness.md`
- `design/ui-style-inventory/trust-cues.md`
- `design/ui-style-inventory/search.md`
- `design/ui-style-inventory/motion-reveals.md`
- `design/ui-style-inventory/image-types.md`
- `design/ui-style-inventory/content.md`
- `design/ui-style-inventory/page-templates.md`
- `design/figma/workbench-section-map.yaml`
- `projects/aha-website-refresh/session-log.md`

### Next
- Remap or retire the missing live-board sections before relying on them again.
- Keep future inventory edits paired with live Figma header updates.

## 2026-04-23
### ID
`DEC-009`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Tighten `Illustration Style` around scene-first reduction.
- Make palette, shading, outline, and detail limits explicit.
- Treat recent failed portrait-like generations as negative examples for future prompt writing.

### Why
- Existing illustration copy was directionally right but still too permissive.
- Recent generated images drifted into the wrong mode:
  - too much colour
  - wrong palette balance
  - too much detail
  - too much shading
  - wrong outline behaviour
- The live strip works because it is flatter, quieter, and more reduced than those outputs.

### Files
- `design/ui-style-inventory/illustration-style.md`
- `prompts/image-generation/master-styleframe-prompt.md`
- `prompts/image-generation/styleframe-01.md`
- `prompts/image-generation/styleframe-02.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Keep future illustration prompts tied to the live strip, not just prose description.
- Use scene-first framing before likeness when source material starts from photography.

## 2026-04-24
### ID
`DEC-010`

### Project ID
`aha-website-refresh`

### Status
`Exploring`

### Confidence
`Medium`

### Decision
- Add evolved current-site illustration as Route B.
- Keep current Figma-synced illustration direction intact.
- Use Route B as a utility-led illustration test, not a full replacement yet.
- Define Route B as no-outline flat vector illustration.

### Why
- User provided current-site illustration screenshots as status-quo evidence.
- Route B aligns with the broader route definition:
  - cleaner
  - more precise
  - more system-led
- The canonical brief still requires warmth, trust, clarity, and useful guidance.
- Route B may help dense tools, menus, tiles, and education surfaces stay light and legible.
- Route B carries a clear risk of generic stock-like illustration if palette, metaphor, and scene specificity are not tightened.
- Route B should differ from the current direction by removing the warm contour behavior and using fill, overlap, white space, and direct metaphor for clarity.

### Files
- `design/ui-style-inventory/illustration-style.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Test Route B with four AHA-specific scenes.
- Compare it against the current illustration direction by use case and zone.
- Decide whether Route B is a support-surface dialect or a route-wide illustration system.

## 2026-05-07
### ID
`DEC-011`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`Medium`

### Decision
- Promote Route 2 illustration into the primary AHA illustration system.
- Use the supplied `illustration-style-route2.png` board as the style anchor.
- Refine the instruction set around no-outline flat-fill construction, restrained AHA palette, adult simplified figures, and one red action signal.
- Allow richer editorial scenes when they still scale down into the same icon and card-spot grammar.
- For Healthy Living topic grids, start from the icon subjects used in the wireframes rather than forcing people into each illustration.
- If real image generation is blocked, provide a prompt instead of creating SVG, PIL, or code-drawn fallback art.

### Why
- The reference board gives the project a clearer, more scalable illustration language than the earlier contour-led exploration.
- It supports the route need for clarity, usefulness, and system discipline while keeping enough warmth for Healthy Living and condition-guide content.
- The style can work across the full UX range: icons, cards, guide modules, navigation support, education steps, and larger editorial moments.
- The risk remains generic wellness illustration, so future scenes need AHA-specific actions, disciplined palette, and purposeful red cues.
- The rejected local fallback showed that code-drawn substitutes do not meet the bar for illustration references.

### Files
- `design/ui-style-inventory/illustration-style.md`
- `prompts/image-generation/master-styleframe-prompt.md`
- `prompts/image-generation/styleframe-01.md`
- `prompts/image-generation/styleframe-02.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Use prompt-only handoff for the next Healthy Living grid generation until the Image API is available.
- Keep people optional for Healthy Living topic art.

## 2026-05-07
### ID
`DEC-012`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Accept the High Blood Pressure condition guide prototype as the current condition-page model.
- Use five parent sections:
  - Overview
  - Signs
  - Causes
  - Care
  - Support
- Keep the parent guide as a long authority page.
- Keep detail pages as article-style nested pages with one clear back-to-guide path.
- Use grouped detail links inside section narratives.
- Remove generic "More detail" wrappers.
- Use fewer boxed chunks and more plain editorial text on the page background.
- Keep tools, tables, urgent callouts, questions, media, and grouped links as modules.
- Use compact medical verification metadata in the hero.
- Use floating global navigation plus in-page section navigation.
- Clean the prototype folder so only final files remain.

### Why
- The model helps AHA become the number-one guide for heart health by joining condition education, tools, healthy-living links, and support in one canonical page.
- The five-section structure matches patient and caregiver questions without adding diagnosis or tests as weak standalone sections.
- The long page gives orientation and fast scanning while grouped links keep deeper subtopics available.
- The article detail model avoids sidebar duplication and keeps nested content simpler.
- The reduced visual system supports trust, scanability, and less cognitive load.
- The pattern aligns with the canonical brief:
  - build trust
  - operate intelligently
  - be human
  - use less
  - keep floating navigation

### Files
- `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/`
- `knowledge/sources/current-site-audit/high-blood-pressure-condition-guide-final-2026-05-07.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/cleanup-candidates.md`
- `logs/decision-log.md`
- `logs/route-evolution.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Use this cleaned prototype as the source for future Figma transfer.
- Replace placeholder links with final IA targets before production.
- Send medical copy through AHA clinical review before publication.

## 2026-05-08
### ID
`DEC-013`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Lock Route 2 as the single primary illustration route.
- Update the illustration colour system away from warm brown and beige dominance.
- Use the attached palette reference as the new anchor:
  - white
  - off-white
  - cool bone
  - light stone grey
  - taupe-grey
  - charcoal
  - AHA red
  - deep red
- Keep AHA red as the primary action, emotion, and brand signal.
- Allow light secondary pastels only for subject-specific cues:
  - water or air
  - nature
  - soft red support
  - food or seasonal warmth
- Sync the live Figma `Illustration Style` and `Colour Scheme` header copy to the updated direction.

### Why
- The selected illustration route is strong, but the previous palette let warm stone, taupe, and brown become too dominant.
- The canonical brief still needs a white-first, trustworthy, human ecosystem.
- A cooler pale-neutral base keeps the work cleaner beside dense UI and guide content.
- Subject-specific pastels help Healthy Living and education scenes without turning the system into a broad colourful wellness palette.
- The main risk is still generic health illustration, so the system needs strict red-signal behavior and AHA-specific subjects.

### Files
- `design/ui-style-inventory/color-scheme.md`
- `design/ui-style-inventory/illustration-style.md`
- `prompts/image-generation/master-styleframe-prompt.md`
- `prompts/image-generation/styleframe-01.md`
- `prompts/image-generation/styleframe-02.md`
- `prompts/image-generation/healthy-living-topic-grid-route2.md`
- `prompts/image-generation/healthy-living-topic-grid-route2.prompt.txt`
- `logs/decision-log.md`
- `logs/route-evolution.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Generate the next illustration board with the cooler palette.
- Check whether the secondary pastels stay situational and do not compete with AHA red.

## 2026-05-08
### ID
`DEC-014`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`Medium`

### Decision
- Keep the colour palette as the only Figma-created artifact for this adjustment.
- Create the illustration guideline as an image artifact, not as an editable Figma board.
- Add the compact editable palette swatch frame to the live `Colour Scheme` section.
- Remove local references to the mistakenly-created Figma guideline board.

### Why
- The user wants Figma used for colours only.
- The illustration guideline should behave like the attached visual reference: a generated image board that can be reviewed as style direction.
- Keeping the guideline out of Figma avoids turning a visual reference into a premature editable system artifact.

### Files
- `design/figma/workbench-section-map.yaml`
- `design/ui-style-inventory/illustration-style.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Generate the illustration guideline image with the cooler palette.
- Use the Figma palette frame as the colour reference.
