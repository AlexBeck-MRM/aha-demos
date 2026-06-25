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

## 2026-06-17
### ID
`DEC-015`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Set `Medical Soft Spatial - Colour Block` as the base style for AHA topic, action, education, and support icons.
- Use the v4 12-icon sheet as the accepted visual reference.
- Keep the style neutral-first, spatial, matte, and white-surface friendly.
- Use AHA red only as a separated information signal.
- Allow extra large structural detail when it makes the subject clearer, especially CPR/AED and mental wellbeing.
- Keep all generated icon shapes accountable: subject, attached part, information signal, or contact shadow.
- Leave Figma out of this local style-guide pass.

### Why
- The accepted sheet gives the icon system a clear base style that is warmer than line glyphs but calmer than realistic 3D illustration.
- Broad neutral masses and shallow depth keep the icons useful inside dense UI.
- Purposeful red supports AHA brand recognition without turning the set into a red decorative system.
- The refinement showed that over-simplifying can hurt meaning. CPR needs the compression action, and mental wellbeing needs an internal emotional cue.
- The same refinement also showed that arbitrary bases, backplates, blobs, and support shapes quickly weaken the system.

### Files
- `design/ui-style-inventory/icons.md`
- `design/generated/icons/medical-soft-spatial-colour-block/manifest.md`
- `design/generated/icons/medical-soft-spatial-colour-block/aha-medical-soft-spatial-colour-block-12-sheet-v4.png`
- `prompts/image-generation/medical-soft-spatial-colour-block-full-sheet.md`
- `prompts/image-generation/board-to-prompt-map.yaml`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Use `design/ui-style-inventory/icons.md` and the v4 sheet as the first references for any new AHA icon prompt.
- Decide later whether the local icon guide should be synced back to the live Icons board.

## 2026-06-18
### ID
`DEC-016`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Add live Figma icon-size variables for the design-system library.
- Put component icon-size tokens inside the existing `Components` collection.
- Use component-first grouping: `Components / icons/size/*`.
- Use lowercase size names aligned with existing component variants: `xs`, `sm`, `md`, `lg`, `xl`.
- Add hidden primitive `Primitives / space/350 = 56` so 56px icon sizes can alias to the primitive scale.
- Remove the mistaken `Component Sizing` collection from the live Figma library.

### Why
- Component tokens should stay under the component collection. A top-level `Component Sizing` collection split the component API in a way that was harder to scan and did not match the intended library structure.
- The existing `Components` collection already uses `Light mode` and `Dark mode`, so icon-size variables currently resolve to the same value in both modes.
- Responsive icon behavior should be handled through a deliberate component-mode or breakpoint-alias strategy later, not by adding a stray visible collection.
- Existing button and utility component variants already use lowercase size names.
- Aliasing icon sizes to `space/*` primitives keeps the component tokens tied to the numeric base scale.

### Files
- `Figma: AHA - Design System [WIP]`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Bind icon component width and height fields to `Components / icons/size/*` when component cleanup continues.
- Decide the responsive implementation separately before changing the `Components` collection mode strategy.

## 2026-06-18
### ID
`DEC-017`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Adopt `S / M / L / XL` as the responsive spacing mode language for the AHA Design System variable library.
- Treat `S` as mobile, `M` as tablet/small desktop, `L` as desktop, and `XL` as wide desktop.
- Keep semantic spacing token names stable.
- Change only per-mode primitive aliases for `Layout / spacing/gap/*` and `Layout / spacing/inset/*`.
- Ensure the cascade has these primitive spacing steps: `space/175`, `space/350`, `space/450`, `space/550`, `space/700`, and `space/900`.
- Apply the live Figma mutation through the native Figma MCP connector as `alexander.beck@mrm.com`.

### Why
- The existing modes already describe responsive behavior, but the current spacing aliases do not create different mobile-to-wide-desktop behavior.
- Smaller breakpoints need tighter jumps; larger breakpoints need more expressive spacing without changing token names or breaking component bindings.
- Keeping the work to alias remapping gives designers a responsive system without renaming the public API.
- The 2026-06-22 live pass verified `alexander.beck@mrm.com`, created five missing primitive steps, reused existing `space/350`, and remapped all planned `spacing/gap/*` and `spacing/inset/*` mode aliases.
- Final live validation passed with 858 local variables, no duplicate variable names, no unresolved aliases, all six new primitive steps present exactly once, and all 100 planned spacing cells resolving to the intended values.

### Files
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `reference/design-system/docs/aha-design-system-final-variable-library-guide.md`
- `reference/design-system/docs/aha-design-system-current-token-table.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Spot-check bound components/pages in Figma by switching `S / M / L / XL` modes and checking that spacing compresses and expands without layout breakage.
- Keep typography unchanged for this pass; use the typography audit as the input for a separate type-ramp proposal if needed.

## 2026-06-22
### ID
`DEC-018`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Publish the responsive spacing primitives instead of keeping them hidden.
- Add WEB code syntax to all `Layout / spacing/inset/*` tokens.
- Add descriptions to all `Components / icons/size/*` tokens.
- Keep exact component color values by adding published `Primitives / color/component/*` primitives and aliasing the component color tokens to them.
- Remove the eight `Typography / _deprecated/static-font/*` compatibility shims.
- Leave picker-scope cleanup untouched until the authoring policy is clearer.

### Why
- Primitives should be visible as part of the design-system library rather than treated as hidden implementation details.
- Inset tokens need the same export readiness as gap tokens.
- Component icon-size tokens were technically valid, but lacked in-file guidance for designers.
- The app-store badge border and avatar neutral background had no exact primitive match. Adding exact-value primitives keeps visual output stable while removing raw values from the component layer.
- Preflight found no variable-alias or local-style references to the deprecated static-font shims, so removing them simplifies the Typography collection without changing the intended type model.
- Scope cleanup changes where tokens appear in Figma pickers. That is useful, but it should be a deliberate authoring-policy decision, not bundled into this metadata cleanup.

### Files
- `Figma: AHA Design System WIP`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `reference/design-system/docs/aha-design-system-final-variable-library-guide.md`
- `reference/design-system/docs/aha-design-system-current-token-table.md`
- `reference/design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Spot-check bound components that may have used old static-font variables directly on nodes.
- Decide scope policy separately for paragraph width and toggle border tokens before changing picker visibility.

## 2026-06-22
### ID
`DEC-019`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Add a responsive display typography ramp while keeping semantic typography token names stable.
- Add published primitives for `typography/size/56`, `typography/size/64`, `typography/size/80`, `typography/line-height/48`, `typography/line-height/64`, `typography/line-height/76`, and `typography/line-height/96`.
- Publish all numeric typography size and line-height primitives.
- Keep body typography stable across `S / M / L / XL`.
- Scope `Layout / layout/width/paragraph-max` to `WIDTH_HEIGHT`.
- Scope the three `Components / toggles/color/*border*` variables to `STROKE_COLOR`.

### Why
- The previous display ramp already changed between mobile and desktop, but `XL` and `L` were mostly the same.
- Wide desktop needs a stronger display step without changing the public semantic token names.
- Body copy should stay predictable and readable; primary body remains 16/24 across all modes.
- Numeric typography primitives should be visible in the published primitive layer, matching the current primitive publishing rule.
- Paragraph width should appear in size/width authoring surfaces, not every picker.
- Toggle border colors should appear in stroke color pickers, not fill, text, or unrelated property pickers.

### Files
- `Figma: AHA Design System WIP`
- `reference/design-system/docs/aha-design-system-final-variable-library-guide.md`
- `reference/design-system/docs/aha-design-system-current-token-table.md`
- `reference/design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Check whether text styles should be renamed or regrouped to make display/body roles clearer.
- Check whether the unused toggle border component tokens should stay as future-state tokens or move into a cleanup queue.

## 2026-06-22
### ID
`DEC-020`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Add intermediate typography primitives for granular display scaling.
- Add published size primitives `typography/size/26`, `typography/size/34`, `typography/size/44`, `typography/size/52`, and `typography/size/68`.
- Add published line-height primitives `typography/line-height/34`, `typography/line-height/42`, `typography/line-height/68`, and `typography/line-height/80`.
- Remap display typography aliases to use the granular ramp across `S / M / L / XL`.
- Keep body typography stable.

### Why
- The first display ramp made breakpoints responsive, but some jumps were still too coarse.
- Intermediate primitives give the display ramp better step control without changing semantic token names.
- Body text needs predictability more than expression; primary body stays 16/24.
- Published primitives make the base scale visible for designers and export consumers.

### Files
- `Figma: AHA Design System WIP`
- `reference/design-system/docs/aha-design-system-final-variable-library-guide.md`
- `reference/design-system/docs/aha-design-system-current-token-table.md`
- `reference/design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Check text-style naming and grouping against the granular display ramp.
- Check real page compositions for any display token that still jumps too much between `M` and `L`.

## 2026-06-22
### ID
`DEC-021`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Complete the final token-system cleanup pass in the live AHA Design System WIP file.
- Publish the approved `space/*` scale through `space/1600`.
- Add `Primitives / size/layout/320` and alias `Layout / layout/width/xxs` to it.
- Add exact alpha, border, and shadow color primitives so `Color`, `Layout`, `Typography`, and `Components` no longer hold raw values.
- Keep broad utility palettes visible, with descriptions that mark them as support/data/illustration tokens.
- Move duplicate `*/Regular` text styles under `_compat/text/*` because live nodes still use them and the MCP runtime cannot load Lub Dub for safe rebinding.
- Remove paragraph-spacing variable bindings from all text styles.
- Remove 81 zero-consumer legacy paint styles after preflight.

### Why
- Public semantic tokens should alias primitives rather than carry raw values.
- Spacing primitive publishing should be consistent with the visible responsive scale.
- `layout/width/xxs` is a layout-size decision, not a spacing decision.
- Lub Dub Medium is the normal/default weight for this system, but deleting Regular styles would break existing bound nodes without a font-available rebind path.
- Figma Plugin API cannot bind blur radius, so backdrop blur styles stay documented presets.

### Files
- `Figma: AHA Design System WIP`
- `reference/design-system/docs/aha-design-system-final-variable-library-guide.md`
- `reference/design-system/docs/aha-design-system-current-token-table.md`
- `reference/design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- In Figma desktop with Lub Dub available, set all text-style numeric paragraph spacing values to 0 and rebind `_compat/text/*` consumers to matching Medium styles if deletion is still wanted.
- Use the retained paint-style descriptions as the cleanup line for future style-library pruning.

## 2026-06-22
### ID
`DEC-022`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Replace the earlier granular display-only type ramp with the approved responsive display and text type matrix.
- Order visible scale variables largest-to-smallest where Figma ordering affects authoring: primitive spacing, primitive typography, layout widths, radii, shadow levels, component icon sizes, and `Typography`.
- Add exact button padding primitives and public `Components / buttons/*` spacing aliases.
- Rebind button component root padding and gap fields to the component spacing API.
- Remove unused intermediate typography primitives after a scoped zero-consumer audit.

### Why
- Designers were seeing an incorrect type ramp and confusing variable order in the live variable table.
- Button padding and gap values were real component decisions, but they were still represented as deprecated layout spacing aliases or raw values.
- Exact 10/14/18 button padding values should be documented component decisions, not rounded into the core 4px spacing scale.
- Keeping canonical token names stable while recreating variables kept the public API unchanged and fixed the authoring order.

### Files
- `Figma: AHA Design System WIP`
- `reference/design-system/docs/aha-design-system-final-variable-library-guide.md`
- `reference/design-system/docs/aha-design-system-current-token-table.md`
- `reference/design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Keep any future button anatomy changes bound to `Components / buttons/*`, not `Layout / _deprecated/spacing/*`.
- If text styles are later renamed or regrouped, keep the `Typography` variable matrix unchanged unless a new type decision replaces it.

## 2026-06-22
### ID
`DEC-023`

### Project ID
`aha-website-refresh`

### Status
`Superseded by DEC-024`

### Confidence
`High`

### Decision
- Keep public button spacing aliases in `Components / buttons/*`.
- Route every public button padding alias through exact `Primitives / space/component/button/*` primitives.
- Add `space/component/button/8`, `space/component/button/12`, and `space/component/button/16` so the padding API no longer mixes exact component primitives with generic spacing primitives.
- Leave button gap aliases on the generic `Primitives / space/*` scale under the current guide.

### Why
- The screenshot exposed a real authoring problem: one button padding group mixed component-specific and generic primitive targets.
- Padding is button anatomy, so the alias chain should be internally consistent even when a value overlaps the generic 4px spacing scale.
- Gaps are still governed by the general spacing guidance: use `spacing/gap/*` or core `space/*` values for auto-layout gap decisions unless a component-gap rule is explicitly added.
- A full live audit found no duplicate variable names, unresolved aliases, or missing mode values, so this should stay a narrow boundary repair rather than a broader token rewrite.

### Files
- `Figma: AHA Design System WIP`
- `reference/design-system/docs/aha-design-system-final-variable-library-guide.md`
- `reference/design-system/docs/aha-design-system-current-token-table.md`
- `reference/design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Superseded.
- Follow `DEC-024` for the current button spacing rule.

## 2026-06-22
### ID
`DEC-024`

### Project ID
`aha-website-refresh`

### Status
`Superseded by DEC-025`

### Confidence
`High`

### Decision
- Use the normal `Primitives / space/*` scale for button spacing whenever the value exists there.
- Keep public button spacing aliases in `Components / buttons/*`.
- Use `Primitives / space/component/button/*` only for intentional off-scale button anatomy values that do not exist in the normal spacing scale.
- Rebind `8`, `12`, and `16` button padding aliases to `space/50`, `space/75`, and `space/100`.
- Remove `space/component/button/8`, `space/component/button/12`, and `space/component/button/16`.
- This entry's off-scale exception rule is superseded; the current rule removes all component-specific button spacing primitives.

### Why
- `8`, `12`, and `16` are already part of the approved spacing scale, so duplicating them inside a button-specific primitive group creates a parallel mini scale.
- `Components / buttons/*` is the public button API; it does not require a unique primitive for every value it exposes.
- Button-specific primitives are useful only when the button anatomy needs exact values outside the core scale.
- The corrected structure is easier for designers to understand and keeps component APIs aligned with the system spacing model.

### Files
- `Figma: AHA Design System WIP`
- `reference/design-system/docs/aha-design-system-final-variable-library-guide.md`
- `reference/design-system/docs/aha-design-system-current-token-table.md`
- `reference/design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `reference/design-system/site/aha-token-system-guide/index.html`
- `scripts/dev/figma-variables.mjs`
- `scripts/README.md`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Superseded.
- Follow `DEC-025` for the current button padding rule.

## 2026-06-22
### ID
`DEC-025`

### Project ID
`aha-website-refresh`

### Status
`Superseded by DEC-026`

### Confidence
`High`

### Decision
- Keep public button spacing aliases in `Components / buttons/*`.
- Route every public button padding alias through exact `Primitives / space/component/button/*` primitives.
- Add `space/component/button/8`, `space/component/button/12`, and `space/component/button/16` so button padding groups no longer mix generic spacing primitives with button anatomy primitives.
- Rebind both Light mode and Dark mode values for `buttons/padding-y/lg`, `buttons/padding-y/sm`, `buttons/padding-x/lg`, `buttons/padding-x/sm`, `buttons/icon-only/padding/lg`, `buttons/icon-only/padding/sm`, and `buttons/social/padding-x/with-text`.
- Keep button gap aliases on normal `Primitives / space/*` until a separate component-gap primitive rule is approved.

### Why
- Mixed primitive targets inside one button padding group made the variable table read as inconsistent, even when the resolved pixel values were correct.
- Padding is button anatomy, so the alias chain should make that ownership visible.
- `Components / buttons/*` stays the public API, while `Primitives / space/component/button/*` records exact button padding decisions.
- Gaps can stay generic for now because gap behavior is a layout relationship, not button padding anatomy.

### Files
- `Figma: AHA Design System WIP`
- `reference/design-system/docs/aha-design-system-final-variable-library-guide.md`
- `reference/design-system/docs/aha-design-system-current-token-table.md`
- `reference/design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `reference/design-system/site/aha-token-system-guide/index.html`
- `scripts/dev/figma-variables.mjs`
- `scripts/README.md`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Superseded.
- Follow `DEC-026` for the current button spacing rule.

## 2026-06-22
### ID
`DEC-026`

### Project ID
`aha-website-refresh`

### Status
`Accepted`

### Confidence
`High`

### Decision
- Use the standard `Primitives / space/*` scale for all button spacing.
- Keep public button spacing aliases in `Components / buttons/*`.
- Rebind previous `10`, `14`, and `18` button padding aliases to standard spacers: `space/75`, `space/100`, and `space/125`.
- Remove all `space/component/button/*` primitives.
- Do not create component-specific button spacing primitives.

### Why
- A component-specific primitive layer duplicates the standard spacing scale and makes the system harder to maintain.
- `Components / buttons/*` is the public component API; its aliases can point to standard primitives without losing button ownership at the authoring layer.
- Values that are not on the standard scale should be rounded onto the approved spacing scale instead of creating new primitive branches.

### Files
- `Figma: AHA Design System WIP`
- `reference/design-system/docs/aha-design-system-final-variable-library-guide.md`
- `reference/design-system/docs/aha-design-system-current-token-table.md`
- `reference/design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `reference/design-system/site/aha-token-system-guide/index.html`
- `scripts/dev/figma-variables.mjs`
- `scripts/README.md`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Keep button padding and gap aliases on standard `Primitives / space/*`.
- Do not add `Primitives / space/component/button/*`.
