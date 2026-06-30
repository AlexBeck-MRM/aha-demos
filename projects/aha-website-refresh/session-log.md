---
project_id: aha-website-refresh
status: active
owner: design-brain
last_updated: 2026-04-20
source_refs:
  - logs/decision-log.md
  - knowledge/sources/aha-brand-history/index.md
  - knowledge/sources/experience-insights-mergers/index.md
  - knowledge/sources/figma-design-workbench/board-audit.md
  - design/figma/workbench-section-map.yaml
decision_refs:
  - DEC-005
  - DEC-006
  - DEC-007
  - DEC-008
  - DEC-009
---

# Session Log

## 2026-04-16
### Task
- Add deterministic routing layer.
- Add explicit project-state layer.
- Add caveman ops language layer.
- Log durable source ingest and project binding rollout.

### Change
- Add `brain/router.yaml` as fixed intent map.
- Add `projects/` as canonical project-state layer.
- Add project retrieval index for current work.
- Add `brain/ops-language.md` for controlled operational writing.
- Extend repo verification so routing, project drift, ops drift fail validation.
- Add `aha-brand-history` source cluster with official, archive, and visual timeline notes.
- Add `experience-insights-mergers` source cluster with confidence-tagged hypothesis and conclusion notes.
- Add distilled fast paths for brand history and merged experience research.
- Update source indexes and verifier paths for `reference/` moves and required `project_id` binding.

### Files
- `brain/`
- `projects/`
- `scripts/docs/verify-design-brain.mjs`
- `scripts/docs/init-project.mjs`
- `logs/decision-log.md`
- `README.md`
- `AGENTS.md`
- `knowledge/sources/index.yaml`
- `knowledge/sources/aha-brand-history/`
- `knowledge/sources/experience-insights-mergers/`
- `knowledge/distilled/aha-brand-history.md`
- `knowledge/distilled/experience-research-hypotheses.md`
- `knowledge/distilled/index.md`

### Next
- Keep retrieval index aligned with real work.
- Keep ops files in caveman schema.
- Keep 2018 masterbrand authorship provisional until a stronger official source lands.
- Refresh the merged experience note if a cleaner export appears.

## 2026-04-17
### Task
- Review recent board and repo changes after the 2026-04-16 project-state rollout.
- Keep only durable project-state updates.

### Change
- Keep board-linked inventory files on explicit freshness metadata.
- Add synced inventory coverage for `Responsiveness` and `Article intros`.
- Fold `Text formatting` guidance into `Text hierarchy`.
- Keep board audit priority on `Accessibility`, `Forms`, `Page templates`, and `Content`.

### Files
- `design/ui-style-inventory/README.md`
- `design/ui-style-inventory/article-intros.md`
- `design/ui-style-inventory/responsiveness.md`
- `design/ui-style-inventory/text-hierarchy.md`
- `design/ui-style-inventory/text-formatting.md`
- `design/figma/workbench-section-map.yaml`
- `knowledge/sources/figma-design-workbench/board-audit.md`

### Next
- Read live Figma before relying on any inventory file still marked `mapped_not_verified`.
- Keep section-map status aligned with real board population.

## 2026-04-17
### Task
- Review the full UI style inventory against the live Figma workbench.
- Tighten weak or bloated sections without over-expanding the repo copy.

### Change
- Read the live workbench with the bound `alexander.beck@mrm.com` Figma account and reconcile header copy, annotations, and screenshots for the existing style-inventory sections.
- Tighten synced inventory guidance for `Nav Elements`, `Buttons`, `Cards`, `Depth`, `Search`, `Trust cues`, and `Responsiveness`.
- Trim overly expanded repo-only notes in `Image types` and `Motion Reveals` while keeping the decision logic intact.
- Mark `Content` and `Page templates` as live-board-missing placeholders and update the workbench section map to reflect unresolved node drift.

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
- `logs/decision-log.md`

### Next
- Remap or retire the missing `Content` and `Page templates` board sections.
- Keep Markdown and Figma header text in sync when inventory copy changes again.

## 2026-04-17
### Task
- Add a working AHA-space competitor set for homepage research.
- Capture current US competitor homepages with banners dismissed before screenshot.

### Change
- Add a top-10 competitor target list for AHA-space review.
- Add a focused Playwright capture script for 1200px-wide homepage screenshots.
- Add a source note logging scope, working set, and evidence paths.
- Capture current homepage screenshots and write a manifest.

### Files
- `reference/data/aha_space_competitors_top10_us.csv`
- `scripts/brand/capture_competitor_homepages.mjs`
- `knowledge/sources/current-site-audit/comparative-notes/aha-space-top-competitors-us-2026-04.md`
- `reference/evidence/screenshots/aha-space-competitors-us-2026-04/`

### Next
- Check any failed or weak captures and retry with tighter modal handling if needed.
- Add borrow and avoid notes if these screenshots get cited in route or inventory work.

## 2026-04-17
### Task
- Turn the competitor captures into a slide-ready brand appeal matrix.
- Add filterable slide variants and editable logo placements.

### Change
- Add a working score file for `Human warmth` and `Clinical utility`.
- Add a note defining the matrix axes and filter groups.
- Add a logo-capture script for the competitor set.
- Add a PowerPoint generator for a linked filter-variant matrix slide.

### Files
- `reference/data/aha_space_competitor_brand_appeal_scores.csv`
- `knowledge/sources/current-site-audit/comparative-notes/aha-space-brand-appeal-matrix-2026-04.md`
- `scripts/brand/capture_competitor_logos.mjs`
- `scripts/ppt/build_aha_competitor_brand_appeal_matrix.mjs`
- `reference/slides/aha-competitor-brand-appeal-matrix/`

### Next
- Capture logos and build the deck.
- Render the slide preview and check logo legibility.

## 2026-04-17
### Task
- Expand the matrix set with 10 international heart-charity brands.
- Rebuild the logo pipeline so the marks are cleaner and more visually equal before matrix placement.

### Change
- Add a 20-brand comparator target list with 10 US and 10 international brands.
- Add a new global matrix score file with `Guide utility` and `Human invitation`.
- Add a first-pass override file for logos that need manual crop control.
- Add a new global matrix source note that supersedes the smaller US-only pass.

### Files
- `reference/data/aha_space_competitors_global20.csv`
- `reference/data/aha_space_brand_matrix_scores_global20.csv`
- `reference/data/aha_space_logo_overrides.csv`
- `knowledge/sources/current-site-audit/comparative-notes/aha-space-brand-appeal-matrix-global-2026-04.md`

### Next
- Capture the 20 homepage screenshots.
- Capture raw logos, review them, then build normalized final logos before deck generation.

## 2026-04-17
### Task
- Clean up the expanded 20-brand matrix work.
- Review Forbes `Top Charities` as a US-side scale check.
- Fix weak logo captures, normalize the marks, and rebuild the PowerPoint deck.

### Change
- Improve the homepage and logo capture scripts so international cookie and consent states are handled more reliably.
- Rebuild the raw and final logo set with tighter overrides where the automated pulls were weak.
- Use the Forbes list as a US benchmark input, then keep the international heart-charity additions as a separate category screen.
- Replace the old US-only matrix deck with a rebuilt 20-brand deck that starts with a logo-normalization slide and then links to matrix filter states.

### Files
- `scripts/brand/capture_competitor_homepages.mjs`
- `scripts/brand/capture_competitor_logos.mjs`
- `scripts/brand/build_competitor_logos.py`
- `reference/data/aha_space_brand_matrix_scores_global20.csv`
- `reference/data/aha_space_logo_overrides.csv`
- `knowledge/sources/current-site-audit/comparative-notes/aha-space-brand-appeal-matrix-global-2026-04.md`
- `scripts/ppt/build_aha_competitor_brand_appeal_matrix.mjs`
- `reference/evidence/logos/aha-space-competitors-global-2026-04/`
- `reference/evidence/screenshots/aha-space-competitors-global-2026-04/`
- `reference/slides/aha-competitor-brand-appeal-matrix/`

### Next
- If the team wants one more polish pass, swap a few dark-background logo variants for light-background brand assets where available.
- Decide whether the global matrix should stay as one mixed deck or split into a tighter heart-charity-only board and a broader donation-attention board.

## 2026-04-20
### Task
- capture one-hop high blood pressure topic pages from the live AHA article
- log evidence and link inventory for consolidation work

### Change
- capture 41 full-page screenshots at `1280px` width from the page sidebar and inline article links
- write a local manifest and link inventory under `reference/evidence/screenshots/aha-high-blood-pressure-topic-network-2026-04-20/`
- add a source note for the high blood pressure topic network pass
- add a compact route map and visit-count summary for the one-hop topic network
- add an authority-page proposal note, a full-height svg wireframe, a preview render, and a generated concept image for a lower-jump page model
- review the live `Illustration Style` board section and refine the authority-page concept toward an illustration-led, denser, less predictable page rhythm
- add v2 wireframe and v2 generated concept assets based on the live illustration review

## 2026-05-05
### Task
- add a second homepage route
- shift Route B from fixed sections to adaptive tapestry behavior
- create a new wireframe brief from the smart topic finder reference

### Change
- add a dedicated Route B wireframe spec for the adaptive tapestry homepage
- update the route comparison wireframe doc so Route B now centers on a curated but configurable tile field
- log the route split between curated stack and adaptive tapestry

### Files
- `design/routes/homepage-route-b-adaptive-tapestry-wireframe.md`
- `design/routes/homepage-route-wireframes.md`
- `logs/route-evolution.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- generate the Route B homepage wireframe image
- test default tile mix and customization-bar prominence
- decide how far the adaptive logic should continue below the first viewport

## 2026-05-06
### Task
- review Route 2 weaknesses
- simplify Route B around mission, place, and one interest
- rebuild the wireframe brief for a sparser adaptive homepage

### Change
- update Route B around a hero tile pair instead of a full-width hero
- remove the large in-page finder bar and replace it with one small persistent selector
- add geolocation as a signal for nearby events and community relevance
- define a configured volunteering scenario for the personalized state
- tighten the layout toward a sparse two-column hanging rhythm

### Files
- `design/routes/homepage-route-b-adaptive-tapestry-wireframe.md`
- `logs/route-evolution.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- regenerate the two-state Route B wireframe
- test whether the hero tile pair still reads clearly when internal detail stays minimal
- confirm how much local event specificity helps without making the page busier

## 2026-05-07
### Task
- adapt the adaptive tapestry model for Healthy Living hub pages
- keep Conditions fixed
- create a three-variant Healthy Living wireframe comparison

### Change
- add a dedicated Healthy Living adaptive Super Hub route spec
- define the six-guide framework as the stable layer across all variants
- define three structural variants for default and configured states
- keep `Eat better` as the configured comparison case
- keep location secondary in this pass

### Files
- `design/routes/healthy-living-adaptive-super-hub-wireframes.md`
- `logs/route-evolution.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- generate the default-state Healthy Living comparison board
- generate the configured-state Healthy Living comparison board
- compare which variant best balances framework clarity and adaptive exploration

## 2026-05-07
### Task
- promote Healthy Living adaptive hub ideation into durable repo memory
- register the generated boards for retrieval

### Change
- copy the generated default-state and configured-state Healthy Living boards into `reference/evidence/mockups/aha-healthy-living-adaptive-super-hub-2026-05-07/`
- add a source note capturing the ideation logic, the three variants, and the configured `Eat better` comparison
- register the artifact in the project artifact index and human lookup map

### Files
- `knowledge/sources/current-site-audit/healthy-living-adaptive-super-hub-2026-05-07.md`
- `reference/evidence/mockups/aha-healthy-living-adaptive-super-hub-2026-05-07/`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- use the new source note when comparing Healthy Living hub variants
- decide which of the three variants should be pushed further

## 2026-05-08
### Task
- update the Healthy Living adaptive hub around a visible six-theme chooser
- remove the bottom picker
- create a new two-state board from the narrowed direction

### Change
- narrow the route from three variants to one preferred structural direction
- replace the bottom selector with six featured theme tiles as the interaction model
- define selected-state behavior so the clicked theme becomes the lead guide area
- update route memory to reflect the updated Healthy Living interaction pattern

### Files
- `design/routes/healthy-living-adaptive-super-hub-wireframes.md`
- `knowledge/sources/current-site-audit/healthy-living-adaptive-super-hub-2026-05-07.md`
- `logs/route-evolution.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- generate the updated two-state Healthy Living board
- compare whether the six-theme chooser is simpler and stronger than the bottom picker

### Files
- `reference/evidence/screenshots/aha-high-blood-pressure-topic-network-2026-04-20/`
- `knowledge/sources/current-site-audit/high-blood-pressure-topic-network-2026-04-20.md`
- `knowledge/sources/current-site-audit/high-blood-pressure-authority-page-proposal-2026-04-20.md`
- `reference/evidence/mockups/aha-high-blood-pressure-authority-page-2026-04/`
- `projects/aha-website-refresh/session-log.md`

### Next
- use the capture set to group the topic tree into one-page hub sections
- run a second-pass crawl only if the team wants deeper coverage beyond the first hop

## 2026-04-20
### Task
- extend the high blood pressure crawl to a second hop
- render a FigJam-friendly map of the expanded route network

### Change
- crawl the first-hop high blood pressure pages one level deeper and find `155` additional HTML pages
- save a FigJam-friendly Mermaid source plus rendered `SVG` and `PNG` under `reference/evidence/mockups/aha-high-blood-pressure-topic-network-2026-04-20/`
- add JSON and CSV summaries for the second-hop network so the expansion pattern is easy to inspect without re-running the crawl
- update the source note with two-hop totals, dominant destination families, and what the expanded route network implies for consolidation

### Files
- `reference/evidence/mockups/aha-high-blood-pressure-topic-network-2026-04-20/`
- `knowledge/sources/current-site-audit/high-blood-pressure-topic-network-2026-04-20.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- split the two-hop crawl into smaller condition-family maps if the team wants cleaner FigJam boards for workshop use
- use the two-hop counts to define which related-content branches should stay inline on the future authority page and which should remain optional detours

## 2026-04-20
### Task
- audit live health-topic labels across multiple condition pages
- define the structural problems that a shared condition taxonomy needs to solve

### Change
- review six live condition-topic areas on `heart.org`:
  - high blood pressure
  - cholesterol
  - heart failure
  - atrial fibrillation
  - heart attack
  - peripheral artery disease
- create a temporary markdown audit at `tmp/health-topic-taxonomy-audit.md`
- capture current structure, branch labels, sub-levels, and cross-topic label-to-user-job mapping
- document the recurring IA issues:
  - verbose labels
  - repeated condition naming
  - mixed page patterns
  - mixed content types at one level
  - professional/public blending
  - weak `tools and resources` buckets

### Files
- `tmp/health-topic-taxonomy-audit.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- use the audit to compare shared category systems for condition pages
- test the preferred system against high blood pressure first, then transfer-check it against the other sampled topics

## 2026-04-23
### Task
- tighten the live `Illustration Style` definition after failed portrait-like image generations
- sync stricter illustration guardrails into prompt-source files

### Change
- update the live Figma `Illustration Style` header copy so the source-of-truth now calls out the actual drift:
  - too much colour
  - wrong palette balance
  - too much detail
  - too much shading
  - wrong outline behaviour
- sync `design/ui-style-inventory/illustration-style.md` to the new live header text
- tighten locked properties and add failure-mode bullets in the inventory file
- add matching prompt guardrails to the shared master illustration guidance and both styleframe prompt files

### Files
- `design/ui-style-inventory/illustration-style.md`
- `prompts/image-generation/master-styleframe-prompt.md`
- `prompts/image-generation/styleframe-01.md`
- `prompts/image-generation/styleframe-02.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- use the updated illustration definition as the first prompt block whenever a generated illustration is requested
- reject portrait-like outputs early if they drift back into colour, shading, detail, or outline excess

## 2026-04-24
### Task
- describe the current-site illustration screenshots as an art-direction system
- document an evolved status-quo path as Route B for illustration

### Change
- read the live Figma `Illustration Style` section using the bound work account
- keep the existing Figma-synced Direction and Reasoning intact
- add a local Route B section to `illustration-style.md` that defines:
  - style description
  - differences from the current illustration direction
  - use cases to test
  - example moments
  - open questions
- log Route B as an exploring decision

### Files
- `design/ui-style-inventory/illustration-style.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- generate a four-scene Route B example board using the locked AHA colour scheme
- compare Route B against the current direction by content zone before adopting it broadly

## 2026-04-24
### Task
- correct Route B illustration definition after outline drift

### Change
- tighten Route B to be explicitly no-outline
- define separation through flat fills, overlaps, gaps, value contrast, and silhouette
- limit interior marks to functional details only
- clarify that warm contour behavior belongs to the current illustration direction, not Route B

### Files
- `design/ui-style-inventory/illustration-style.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- regenerate Route B examples with no stroked silhouettes, props, furniture, backplates, or ground planes

## 2026-04-27
### Task
- turn the high blood pressure consolidation plan into local image boards
- define a fixed six-chapter structure for reusable health-condition pages

### Change
- create a new source note for the health condition authority-page structure
- define the fixed chapter labels:
  - `Overview`
  - `Symptoms`
  - `Causes`
  - `Diagnosis`
  - `Treatment`
  - `Living with it`
- card-sort the high blood pressure page network into the six chapters
- create a reusable sitemap pattern and a high blood pressure sitemap example
- generate three local PNG boards:
  - IA, card sort, and sitemap
  - desktop authority-page states
  - mobile authority-page states
- keep tools, resources, complications, and specific situations out of the top-level nav and place them contextually inside chapters or subpage links

### Files
- `knowledge/sources/current-site-audit/health-condition-authority-structure-2026-04-27.md`
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/board.html`
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/render.mjs`
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/condition-authority-ia-sitemap.png`
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/condition-authority-desktop-states.png`
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/condition-authority-mobile-states.png`
- `projects/aha-website-refresh/session-log.md`

### Next
- use these image boards as the discussion artifact before deciding whether the six-chapter model should be promoted into route or inventory documentation

## 2026-04-27
### Task
- refine the condition authority-page boards with a specific subpage navigation pattern

### Change
- add a fourth local PNG board for specialist subpage navigation
- define the recommended sidebar behavior:
  - keep the six fixed chapters as the stable parent guide nav
  - avoid nesting all subpages directly under those chapters
  - show specialist subpages as a separated `Deeper in [chapter]` module on the parent guide when relevant
  - switch specialist pages to local page navigation with a parent-guide return and parent-chapter context
  - keep mobile `Sections` limited to the six fixed chapters
- update the source note with the subpage navigation rule

### Files
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/board.html`
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/render.mjs`
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/condition-authority-subpage-navigation.png`
- `knowledge/sources/current-site-audit/health-condition-authority-structure-2026-04-27.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- test this pattern against at least one dense non-HBP branch, especially heart attack diagnostics or AFib resources

## 2026-04-27
### Task
- write deeper right-side content for the high blood pressure authority page

### Change
- add a working Markdown content draft for the full parent page
- keep the six fixed sidebar chapters
- expand each right-side chapter with:
  - chapter intro
  - plain-language explanation
  - user actions
  - contextual content cards
  - deeper links and tools where relevant
- add source basis and medical-review note

### Files
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/high-blood-pressure-page-content.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- use the draft to tune content density inside the desktop and mobile page comps

## 2026-04-27
### Task
- add Route B illustration guidance for the high blood pressure guide

### Change
- add an illustration plan to the content draft
- define one hero illustration and six small chapter vignettes
- keep the illustration direction Route B only:
  - no outlines
  - flat raster/vector-like bitmap output
  - broad fills
  - white space
  - restrained AHA palette
  - one red action signal per illustration
- remove the local SVG board approach after direction changed to raster-only

### Files
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/high-blood-pressure-page-content.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- generate a single Route B raster board for the hero and chapter vignettes

## 2026-04-27
### Task
- reduce high blood pressure page content density and create a page mockup

### Change
- rewrite the page content draft to a mid-density version
- keep immediate-value guidance:
  - emergency cue near the top
  - quick action links
  - concise chapter intros
  - practical lists and tools
  - contextual subpage links
- create a desktop JPG mockup from local HTML/CSS
- keep the visual treatment aligned with:
  - six-chapter sidebar
  - white-first AHA page system
  - Route B no-outline illustration behavior

### Files
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/high-blood-pressure-page-content.md`
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/high-blood-pressure-page-mid-density-mockup.html`
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/render-mid-density-mockup.mjs`
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/high-blood-pressure-page-mid-density-mockup.jpg`
- `projects/aha-website-refresh/session-log.md`

### Next
- test the same density model on a second condition page before treating it as a universal template

## 2026-04-27
### Task
- make detail links visible in the high blood pressure page content and mockup

### Change
- rename section-level contextual link blocks to `See more detail`
- add short intent descriptions to deeper links in the Markdown content
- update the JPG mockup so each visible section includes contextual links
- add the missing `Causes` section to the rendered mockup sequence
- keep subpage links out of the sidebar and place them inside the relevant chapter

### Files
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/high-blood-pressure-page-content.md`
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/high-blood-pressure-page-mid-density-mockup.html`
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/render-mid-density-mockup.mjs`
- `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/high-blood-pressure-page-mid-density-mockup.jpg`
- `projects/aha-website-refresh/session-log.md`

### Next
- decide whether `See more detail` should be the universal label or whether some chapters should use `Tools and support`

## 2026-04-28
### Task
- replace Healthy Living wireframes with high-fidelity guide-system overview

### Change
- remove earlier Healthy Living wireframe notes and mockup folders
- remove the separate pillar hub layer from the Healthy Living model
- define the new model:
  - directional Super Hub
  - evergreen Guide
  - linked Article, Resource, Recipe, Tool, Video, or Infographic
- create a high-fidelity visual overview using `Healthy Eating` as the worked example
- show the Super Hub finder as the primary directional mechanism
- show the Guide as a course-like structure with chapters
- show supporting article/resource content as linked from a guide chapter, not as a sub-hub

### Files
- `knowledge/sources/current-site-audit/healthy-living-guide-system-high-fidelity-2026-04-28.md`
- `knowledge/sources/current-site-audit/index.md`
- `knowledge/sources/index.yaml`
- `reference/evidence/mockups/aha-healthy-living-guide-system-high-fidelity-2026-04-28/board.html`
- `reference/evidence/mockups/aha-healthy-living-guide-system-high-fidelity-2026-04-28/render.mjs`
- `reference/evidence/mockups/aha-healthy-living-guide-system-high-fidelity-2026-04-28/healthy-living-guide-system-high-fidelity.png`
- `projects/aha-website-refresh/session-log.md`

### Next
- test the same guide structure on `Exercise and Fitness`, `Sleep`, and `Quit Smoking and Vaping`

## 2026-04-29
### Task
- capture the current Healthy Eating page network for status quo review

### Change
- capture the live Healthy Eating branch from `https://www.heart.org/en/healthy-living/healthy-eating`
- save `221` full-page screenshots at `1280px` width
- cap recipe capture at `3` representative pages
- create a status quo sitemap image for review
- log the capture summary as a source note

### Files
- `knowledge/sources/current-site-audit/healthy-eating-topic-network-2026-04-29.md`
- `knowledge/sources/current-site-audit/index.md`
- `knowledge/sources/index.yaml`
- `reference/evidence/screenshots/aha-healthy-eating-topic-network-2026-04-29/`
- `reference/evidence/mockups/aha-healthy-eating-topic-network-2026-04-29/`
- `projects/aha-website-refresh/session-log.md`

### Next
- review the Healthy Eating status quo against the proposed guide model
- decide which branches become evergreen guide chapters and which become supporting article, recipe, tool, or infographic content

## 2026-04-30
### Task
- test Healthy Living guide categories against Sleep, Healthy Eating, and Quit Smoking / Vaping / Tobacco

### Change
- check current live Sleep and Quit Smoking / Vaping / Tobacco branch topics
- map Sleep, Healthy Eating, and Quit Smoking / Vaping / Tobacco into a universal Healthy Living guide sequence
- create a 3x2 board of six navigation approaches
- show each approach as a guide page plus a supporting subpage

### Files
- `knowledge/sources/current-site-audit/healthy-living-navigation-approaches-2026-04-30.md`
- `knowledge/sources/current-site-audit/index.md`
- `knowledge/sources/index.yaml`
- `reference/evidence/mockups/aha-healthy-living-navigation-approaches-2026-04-30/board.html`
- `reference/evidence/mockups/aha-healthy-living-navigation-approaches-2026-04-30/render.mjs`
- `reference/evidence/mockups/aha-healthy-living-navigation-approaches-2026-04-30/healthy-living-navigation-approaches.png`
- `projects/aha-website-refresh/session-log.md`

### Next
- choose one guide navigation pattern to develop at higher fidelity
- test the chosen pattern against the largest Healthy Eating branches and smaller Sleep / Smoking branches

## 2026-04-30
### Task
- add detail to the Healthy Living guide page structure

### Change
- define how guide overview pages, chapter sections, supporting articles, resource libraries, quick find routes, and cross-guide links should appear
- create a detailed wireframe board using Healthy Eating, Sleep, and Quit Tobacco examples
- clarify that supporting pages should be findable through chapters, filters, search, and contextual links rather than primary navigation

### Files
- `knowledge/sources/current-site-audit/healthy-living-detailed-page-structure-2026-04-30.md`
- `knowledge/sources/current-site-audit/index.md`
- `knowledge/sources/index.yaml`
- `reference/evidence/mockups/aha-healthy-living-detailed-page-structure-2026-04-30/board.html`
- `reference/evidence/mockups/aha-healthy-living-detailed-page-structure-2026-04-30/render.mjs`
- `reference/evidence/mockups/aha-healthy-living-detailed-page-structure-2026-04-30/healthy-living-detailed-page-structure.png`
- `projects/aha-website-refresh/session-log.md`

### Next
- choose whether the first high-fidelity prototype should show `Healthy Eating` or `Quit Tobacco`

## 2026-04-29
### Task
- inspect the live AHA Figma slide template before creating a reusable skill
- document existing slide layouts, construction rules, and missing standard layouts
- capture the pasted test narrative constraints without assembling slides yet

### Change
- read the live Figma section `AHA MRM Slides` at node `98:6876`
- identify `61` full-size `1920 x 1080` slide frames
- document shared header/footer usage, auto-layout patterns, type scale, colors, and layout purposes
- add proposed missing standard layouts for decision, source note, before/after, storyboard, and appendix use cases
- add new-slide build rules, auto-layout maintenance rules, density rules, and intent-to-layout mapping
- capture the Healthy Eating guide-system summary as the future six-slide test source
- exclude the `Top 18 Areas of Focus` rearrangement topic from the test narrative
- defer skill creation and slide assembly until the layout system study is accepted

### Files
- `reference/slides/aha-figma-slide-template-study.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- assemble a six-slide test narrative in the Figma template
- only create the skill after the six-slide test works

## 2026-04-29
### Task
- create the project-specific design file for the future AHA Figma slide skill
- separate the Healthy Eating narrative rationale from the skill design

### Change
- add `skills/aha-figma-slides/design.md` as the skill design draft
- keep the future skill focused on layout selection, Figma template use, auto-layout preservation, and validation
- add `reference/slides/aha-healthy-eating-guide-narrative-rationale.md` as the separate test-narrative source
- keep the `Top 18 Areas of Focus` rearrangement topic out of the test narrative

### Files
- `skills/aha-figma-slides/design.md`
- `reference/slides/aha-healthy-eating-guide-narrative-rationale.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- create the `[AI dropzone]` page in Figma
- add missing slide templates
- add the six-slide Healthy Eating guide-system narrative

## 2026-04-29
### Task
- create the Figma `[AI dropzone]` page
- add missing slide templates and the six-slide Healthy Eating guide-system narrative

### Change
- create or reuse Figma page `[AI dropzone]`, node `132:2`
- add five missing template slides:
  - `Decision Recommendation`
  - `Source / Evidence Note`
  - `Before / After UX Change`
  - `Storyboard Sequence`
  - `Appendix Detail`
- add six narrative slides from the separate Healthy Eating rationale document
- place narrative slides in one horizontal row with `100px` between slides
- validate Figma structure:
  - `5` missing template frames
  - `6` narrative frames
  - narrative gaps all `100px`
  - no text-node overflow beyond slide bounds
- note runtime limitation:
  - `MW Sans` could not be loaded by the plugin runtime
  - edited text nodes use `AR One Sans` fallback in this test

### Files
- `skills/aha-figma-slides/design.md`
- `reference/slides/aha-healthy-eating-guide-narrative-rationale.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- visually review the Figma page
- decide whether the fallback font is acceptable for testing or whether `MW Sans` needs to be made available before skill creation
- tighten the skill design before creating `SKILL.md`

## 2026-04-29
### Task
- create a stronger ten-slide narrative that starts with the topic-system overview
- use Healthy Eating as the worked example instead of the whole story

### Change
- add a third Figma row on `[AI dropzone]` at `y=4200`
- create `10` narrative slides with `100px` horizontal gaps
- lead with the broader priority-topic system:
  - AHA does not need disconnected mini-sites
  - topics need clear jobs
  - Healthy Eating is the proof case
- validate the row:
  - `10` slides
  - all gaps `100px`
  - no text-node overflow
- update the narrative rationale and slide-skill design files with v3 Figma node IDs

### Files
- `reference/slides/aha-healthy-eating-guide-narrative-rationale.md`
- `skills/aha-figma-slides/design.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- review v3 visually in Figma
- decide whether v3 replaces the earlier six-slide test as the preferred skill validation example

## 2026-04-29
### Task
- reset the narrative so it starts with the real project topic
- create a v4 slide row focused on making AHA information more graspable and canonical

### Change
- add a fourth Figma row on `[AI dropzone]` at `y=5600`
- create `10` narrative slides with `100px` horizontal gaps
- shift the story away from starting with Healthy Eating
- start with the repo-backed problem:
  - AHA health information needs to become easier to grasp
  - trusted information can still feel hard to use
  - the documented shift is from passive repository to trusted companion
  - campaign-like or volatile structures weaken the feeling of canonical guidance
- use Healthy Eating as the first worked example after the mental model is established
- validate the row:
  - `10` slides
  - all gaps `100px`
  - no text-node overflow

### Files
- `reference/slides/aha-healthy-eating-guide-narrative-rationale.md`
- `skills/aha-figma-slides/design.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- review v4 visually in Figma
- use v4 as the preferred narrative row unless another critique changes the story structure

## 2026-04-29
### Task
- add the Healthy Eating page-volume/noise hypothesis to the slide rationale
- create a stronger client-facing row with centered white statement slides
- keep the SEO argument careful and source-backed

### Change
- add screenshot evidence assets under `reference/slides/healthy-eating-narrative-assets/`
- verify current Google Search Central guidance:
  - helpful, reliable, people-first content
  - unique value and page experience
  - canonical handling for duplicate or similar URLs
- update the narrative rationale with the consolidation hypothesis:
  - page count is not the problem by itself
  - thin, duplicate, or competing pages can create noise and cognitive load
  - granular pages should be kept when they answer distinct user intent
  - the target is fewer dead ends, not arbitrary page reduction
- add a v5 Figma row on `[AI dropzone]` at `y=7000`
- create `12` narrative slides with `100px` horizontal gaps
- include centered white statement slides for:
  - `More pages do not automatically create more clarity.`
  - `The goal is not fewer pages. The goal is fewer dead ends.`
  - `Collection of related pages -> Guide`
- create editable reconstructed page-wall visuals because the Figma runtime could not import local screenshot files
- validate the row:
  - `12` slides
  - all gaps `100px`
  - no text-node overflow
  - visual review caught and fixed the slide 04 hypothesis callout

### Files
- `reference/slides/aha-healthy-eating-guide-narrative-rationale.md`
- `skills/aha-figma-slides/design.md`
- `reference/slides/healthy-eating-narrative-assets/`
- `projects/aha-website-refresh/session-log.md`

### Next
- review v5 visually in Figma
- decide whether to use v5 as the preferred narrative row before creating the final skill

## 2026-04-29
### Task
- adjust the narrative so it starts with the wider AHA information system
- position Conditions and Healthy Living as guide families
- use Healthy Eating as the worked example after the general idea is established
- remove contrastive phrasing from generated slide copy

### Change
- add a v6 Figma row on `[AI dropzone]` at `y=8400`
- create `13` narrative slides with `100px` horizontal gaps
- structure the row around:
  - AHA health information as a clearer guidance system
  - Conditions and Healthy Living as the two main guide families
  - AHA priority areas as durable guide homes
  - repeatable guide architecture
  - Healthy Eating as the first proof case
  - a question-path test across Conditions and Healthy Living
- update the narrative rationale with the wider v6 arc
- update the slide-skill design with a contrastive-phrasing guardrail
- validate the row:
  - `13` slides
  - all gaps `100px`
  - no text-node overflow
  - no generated slide text matched `not`, `but`, `rather than`, or `instead`
  - visual review caught and fixed slide 08 card body spacing

### Files
- `reference/slides/aha-healthy-eating-guide-narrative-rationale.md`
- `skills/aha-figma-slides/design.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- review v6 visually in Figma
- use v6 as the preferred narrative row for the eventual skill test if the sequence feels right

## 2026-04-29
### Task
- remove pale red card fills from highlighted items
- strengthen the opener around the actual problem
- add SEO and modern content-practice support for the page-count claim

### Change
- update v5 and v6 Figma rows so selected cards use:
  - red outline
  - white fill
  - red text where needed
- update v6 opener:
  - define the problem as trusted AHA information spread across too many competing paths
  - describe users arriving with questions, concerns, and decisions
  - frame the guide system as canonical homes for AHA priorities
- replace v6 slide 06 with evidence from SEO and web content practice:
  - people-first content
  - unique value
  - page experience
  - canonical clarity
- update the rationale and slide-skill design with:
  - SEO/content evidence
  - no-fill highlight rule
- validate the row:
  - `13` slides
  - all gaps `100px`
  - no text-node overflow
  - no contrastive phrase hits
  - no pale-red highlighted card fills

### Files
- `reference/slides/aha-healthy-eating-guide-narrative-rationale.md`
- `skills/aha-figma-slides/design.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- visually review the updated v6 opener and evidence slide in Figma

## 2026-04-29
### Task
- create a softer storytelling-led health-information chapter
- connect the chapter to both Health Conditions and Healthy Living
- ground Health Conditions in the existing authority-page rationale
- use `American Heart` in slide copy

### Change
- read the existing condition rationale:
  - `knowledge/sources/current-site-audit/health-condition-authority-structure-2026-04-27.md`
  - `knowledge/sources/current-site-audit/high-blood-pressure-authority-page-proposal-2026-04-20.md`
- add a v7 Figma row on `[AI dropzone]` at `y=9800`
- create `14` narrative slides with `100px` horizontal gaps
- start the row with a red chapter slide:
  - `03`
  - `Health Information`
  - `on American Heart`
- structure the chapter around:
  - the real health-information problem
  - the human moment users arrive in
  - two guide families: Health Conditions and Healthy Living
  - the six-part condition authority model
  - the Healthy Living guide rhythm
  - evidence across high blood pressure and Healthy Eating
  - a step-by-step implementation approach
  - a paired proof test
- validate the row:
  - `14` slides
  - all gaps `100px`
  - no text-node overflow
  - no `AHA` acronym hits in generated slide text
  - no contrastive phrase hits
  - no pale-red highlighted card fills

### Files
- `reference/slides/aha-healthy-eating-guide-narrative-rationale.md`
- `skills/aha-figma-slides/design.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- review v7 visually in Figma as the likely current preferred row

## 2026-04-29
### Task
- rebuild the preferred health-information narrative from actual slide component instances
- use the user-created components on `Slides Template MASTER / AHA MRM Slides`
- remove the generated v8 components and line-heavy custom treatment

### Change
- removed generated Figma artifacts from `[AI dropzone]`:
  - `AI Slide Component v8/*`
  - `Narrative v8 *`
- added a new v9 Figma row on `[AI dropzone]` at `y=11200`
- created `14` top-level slide instances with `100px` horizontal gaps
- used full-slide components including:
  - `Covers-red-section-divider-slide`
  - `Text-narrative-single-narrative-slide`
  - `Text-narrative-big-title-statement-slide`
  - `Text-narrative-split-narrative-slide`
  - `Tabular-comparison-table-slide`
  - `Findings-b-diagnostic-board-slide`
  - `Lists-five-column-icon-pillars-slide`
  - `Text-narrative-three-line-manifesto-slide`
  - `Findings-a-evidence-stack-slide`
  - `Data-big-number-context-slide`
  - `Text-narrative-narrative-visual-slide`
  - `Timeline-slide`
- kept text overrides in `AR One Sans` because `MW Sans` is still unavailable to the Figma plugin runtime
- validated the row:
  - `14` slides
  - all top-level nodes are instances
  - all gaps `100px`
  - no leftover source-copy hits
  - no `AHA` acronym hits in generated slide text
  - no contrastive phrase hits
  - no generated v8 artifacts remain

### Files
- `reference/slides/aha-healthy-eating-guide-narrative-rationale.md`
- `skills/aha-figma-slides/design.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- visually review v9 in Figma and adjust only text overrides or component choices

## 2026-04-29
### Task
- expand the Figma slide component bank so the narrative can use ideal slide structures
- keep the better chunking from the earlier version while making it reusable as components
- include center-aligned statements, dark scope/problem slides, photo-led reasoning, and wireframe/mock-up layouts

### Change
- added `20` new full-slide components on `Slides Template MASTER` inside `AHA MRM Slides`
- placed the new component bank to the right of the existing components
- created layouts for:
  - chapter/opening slide
  - centered statement slides
  - dark page-wall scope slides
  - Conditions and Healthy Living guide models
  - current-path and guide-path diagrams
  - evidence and content-practice slides
  - photo-led reasoning slides
  - guide and condition wireframe mock-ups
  - before/after wireframe comparison
  - recommendation and proof-test slides
- used `AR One Sans` consistently because `MW Sans` is still not available in the Figma plugin runtime
- validated the component bank:
  - `20` components
  - all `1920 x 1080`
  - all include the template footer instance
  - grid spacing is consistent
  - no text outside slide bounds found

### Files
- `skills/aha-figma-slides/design.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- assemble the next narrative row from the new `AI Layout/*` components and tune component choices visually

## 2026-04-29
### Task
- rebuild the health-information narrative using the new `AI Layout/*` slide components
- take screenshot thumbnails of the final narrative row
- check for auto-layout/text issues such as awkward breaks, overlap, or clipped text
- do a follow-up pass on the master components

### Change
- added a new v10 Figma row on `[AI dropzone]` at `y=14000`
- created `16` top-level slide instances with `100px` horizontal gaps
- used the new `AI Layout/*` components for:
  - chapter opener
  - centered statements
  - dark page-wall problem slides
  - guide-family model
  - condition and Healthy Living structures
  - current-path and guide-path diagrams
  - evidence and content-practice slides
  - photo-led reasoning
  - guide wireframe mock-up
  - recommendation and paired proof test
- created screenshot contact sheet:
  - `Narrative v10 Screenshots / contact sheet`: `203:1498`
  - `16` exported thumbnails
- corrected master component spacing after QA:
  - `AI Layout/02 Statement / White Centered`
  - `AI Layout/04 Scope / Dark Page Wall`
  - `AI Layout/05 Scope / Dark Wall With Focus`
- reran narrative QA:
  - `16` slides
  - all top-level nodes are instances
  - all gaps `100px`
  - no text outside slide bounds
  - no text overlaps
  - no likely awkward word-break risks
  - no leftover source-copy hits
  - no `AHA` acronym hits in generated slide text
  - no contrastive phrase hits
- ran final master QA across all `20` `AI Layout/*` components:
  - all full-slide components
  - all include footer instances
  - no text outside slide bounds
  - no text overlaps
  - no likely awkward word-break risks

### Files
- `reference/slides/aha-healthy-eating-guide-narrative-rationale.md`
- `skills/aha-figma-slides/design.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- visually review the v10 screenshot contact sheet and tune slide-by-slide copy or component choices

## 2026-04-29
### Task
- create a final v11 narrative pass
- start on the problem, then move more quickly into the solution
- show page structure, topic organisation, user guidance, visual examples, and the source-of-truth model

### Change
- added a new v11 Figma row on `[AI dropzone]` at `y=17200`
- created `13` top-level slide instances with `100px` horizontal gaps
- tightened the arc:
  - problem statement
  - human need
  - brief challenge deconstruction
  - scope wall
  - canonical guides as the solution
  - topic organisation across Conditions and Healthy Living
  - page structures
  - guided user path
  - guide-page visual example
  - source-of-truth model
  - why it works
- created screenshot contact sheet:
  - `Narrative v11 Screenshots / contact sheet`: `209:2231`
  - `13` exported thumbnails
- corrected master component spacing after QA:
  - `AI Layout/15 Wireframe / Guide Page`
- reran narrative QA:
  - `13` slides
  - all top-level nodes are instances
  - all gaps `100px`
  - no text outside slide bounds
  - no text overlaps
  - no likely awkward word-break risks
  - no leftover source-copy hits
  - no `AHA` acronym hits in generated slide text
  - no contrastive phrase hits

### Files
- `reference/slides/aha-healthy-eating-guide-narrative-rationale.md`
- `skills/aha-figma-slides/design.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- visually review the v11 contact sheet as the current preferred final narrative

## 2026-04-29
### Task
- adjust the v11 problem-deconstruction slide based on visual feedback
- revisit the underlying base component

### Change
- rebuilt `AI Layout/11 Evidence / Four Cards` as:
  - `AI Layout/11 Diagnostic / Volume Repetition Structure`
- changed the slide logic from four mismatched evidence cards into three diagnostic factors:
  - `Volume`
  - `Repetition`
  - `Structure`
- updated `Narrative v11 04 - Problem Deconstructed` with clearer descriptions for each factor
- tightened copy on the guide-example slide to avoid overlap in the current template
- regenerated the v11 screenshot contact sheet:
  - `Narrative v11 Screenshots / contact sheet`: `225:2995`
- reran v11 QA:
  - `13` slides
  - all top-level nodes are instances
  - all gaps `100px`
  - no text outside slide bounds
  - no text overlaps
  - no likely awkward word-break risks
  - no leftover source-copy hits
  - no `AHA` acronym hits in generated slide text
  - no contrastive phrase hits

### Files
- `reference/slides/aha-healthy-eating-guide-narrative-rationale.md`
- `skills/aha-figma-slides/design.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- review the updated v11 contact sheet, especially slide 04

## 2026-04-29
### Task
- fix mis-populated v11 slide fields
- make component slot mapping more reliable for repeated cards

### Change
- renamed repeated master text fields into semantic slots on:
  - `AI Layout/06 System / Two Guide Families`
  - `AI Layout/08 Structure / Healthy Living Sequence`
  - `AI Layout/10 Journey / Guide Path`
  - `AI Layout/18 Content / Consolidation Canvas`
  - `AI Layout/20 Proof / Paired Journey Test`
- repopulated v11 slides by semantic slot and parent container name
- fixed `Narrative v11 07 - Topic Organisation` so Conditions and Healthy Living descriptions sit in the correct cards
- fixed remaining v11 field mixups on:
  - `Narrative v11 09 - Healthy Living Structure`
  - `Narrative v11 10 - Guided User Path`
  - `Narrative v11 12 - Source Of Truth Model`
  - `Narrative v11 13 - Why It Works`
- tightened three lines that caused text overlap or text outside slide bounds
- regenerated the v11 screenshot contact sheet:
  - `Narrative v11 Screenshots / contact sheet`: `239:2991`
- reran v11 QA:
  - `13` slides
  - all top-level nodes are instances
  - all gaps `100px`
  - no placeholder copy
  - no text outside slide bounds
  - no text overlaps
  - no `AHA` acronym hits in generated slide text
  - no contrastive phrase hits

### Files
- `reference/slides/aha-healthy-eating-guide-narrative-rationale.md`
- `skills/aha-figma-slides/design.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- use semantic slot names for all future repeated-card slide population

## 2026-04-30
### Task
- focus the Healthy Living navigation exploration on options A and B
- make the guide chapters read as a more vertical planning structure

### Change
- added a focused A/B board for:
  - `A. Persistent Chapter Rail`
  - `B. Vertical Chapter Browser`
- showed each approach as both:
  - a Healthy Eating topic guide page
  - a supporting subpage that inherits chapter context
- made supporting articles sit inside chapter context rather than appear as a full archive tree
- logged the focused pass as a current-site audit source note

### Files
- `reference/evidence/mockups/aha-healthy-living-nav-a-b-vertical-2026-04-30/`
- `knowledge/sources/current-site-audit/healthy-living-nav-a-b-vertical-2026-04-30.md`
- `knowledge/sources/current-site-audit/index.md`
- `knowledge/sources/index.yaml`
- `projects/aha-website-refresh/session-log.md`

### Next
- decide whether the final model combines the two: chapter browser on the guide landing view, compact persistent rail once users start reading

## 2026-05-01
### Task
- define a working homepage structure from the current wireframe style and source-backed homepage needs
- convert the homepage mock-up reference into a reusable wireframe style
- consolidate user homepage wishes into an annotated viewport-based wireframe

### Change
- add a homepage route artifact with first-screen structure, full-page module sequence, route A and route B emphasis, and an image-generation brief
- add a local-only wireframe style inventory note for the white-first, grayscale, tactile mock-up language
- link the homepage structure back to the wireframe style note so content wishes and style rules can be updated separately
- update the homepage structure around one job, one main CTA, and three information units max per viewport
- add donation, quick links, personalized filters, an expanded drawer, scroll storytelling, an open footer, and a red heartbeat close
- add an annotated wireframe V2 artifact with callouts, motion notes, and an image-generation prompt
- log the homepage direction as an exploring route update

### Files
- `design/routes/homepage-structure.md`
- `design/routes/homepage-annotated-wireframe-v2.md`
- `design/ui-style-inventory/wireframe-style.md`
- `design/ui-style-inventory/README.md`
- `logs/route-evolution.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- confirm approved mission and vision wording
- confirm donation option labels
- confirm real stats for the mission proof section
- confirm default personalized drawer content
- generate the annotated wireframe image after the sequence is accepted

## 2026-05-01
### Task
- recreate homepage wireframes as two route-specific experiences

### Change
- add route-specific homepage and main-navigation wireframe specs
- define Route A as `Reassuring Guide`
- define Route B as `Living Authority`
- keep both routes on the same homepage spine and viewport contract
- add separate image-generation prompts for both route wireframes
- log the route split as a homepage/navigation-only exploration

### Files
- `design/routes/homepage-route-wireframes.md`
- `logs/route-evolution.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- generate Route A and Route B wireframe images
- compare navigation labels and personalized drawer behavior
- decide if either route needs a third label variant before visual design

## 2026-05-01
### Task
- create the three homepage wireframes in Figma to the right of the existing browser frame

### Change
- verify Figma account binding as `alexander.beck@mrm.com`
- create a horizontal Figma container to the right of node `2736:10128`
- add three editable homepage wireframe frames:
  - `AHA Homepage Wireframe / Baseline Guided Overview`
  - `AHA Homepage Wireframe / Route A - Reassuring Guide`
  - `AHA Homepage Wireframe / Route B - Living Authority`
- build each wireframe as a vertical auto-layout section stack with 10 homepage sections
- add text labels for headings and important UI elements
- keep documentation callouts out of the Figma wireframes

### Files
- `projects/aha-website-refresh/session-log.md`

### Figma
- File: `AHA - Design Workbench`
- Container node: `2759:7948`
- Baseline node: `2760:7948`
- Route A node: `2760:8182`
- Route B node: `2760:8416`

### Next
- review the three Figma wireframes in context
- adjust spacing or section emphasis after manual annotation

## 2026-05-07
### Task
- make current artifacts easier for future agents to find
- tag old, generated, or misplaced files for cleanup review

### Change
- add a machine-readable artifact index for active prototypes, evidence, source notes, route docs, Figma links, and cleanup tags
- add a human quick map for where current work lives
- add a cleanup candidate register with `keep`, `relocate`, `archive`, `remove`, and `defer` statuses
- update the project retrieval index so artifact lookup reads the new maps before broad searching
- add project metadata pointers for the artifact index, quick map, and cleanup register

### Files
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/cleanup-candidates.md`
- `projects/aha-website-refresh/retrieval-index.yaml`
- `projects/aha-website-refresh/project.yaml`
- `projects/README.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- decide whether the current HBP prototype should move out of `outputs/`
- decide whether local scratch folders can be cleaned after cited files are promoted or removed

## 2026-05-07
### Task
- relocate and remove tagged cleanup items

### Change
- move the current HBP condition guide prototype out of the UUID `outputs/` folder
- move the companion condition guide navigation boards into `reference/evidence/mockups/`
- move the condition guide narrative presentation into `reference/slides/`
- remove explicit scratch targets:
  - `.playwright-cli/`
  - `.playwright-mcp/`
  - `.tmp/`
  - `output/`
  - empty `outputs/` shell
- update project indexes and cleanup tags to point at the new locations

### Files
- `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/`
- `reference/evidence/mockups/aha-condition-guide-navigation-boards-2026-05-07/`
- `reference/slides/condition-guide-six-section-narrative/`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/cleanup-candidates.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- review deferred cleanup items before deleting:
  - `.artifacts/`
  - `tmp/`
  - large screenshot packs
  - raw logo evidence
  - visualiser experiment

## 2026-05-07
### Task
- refine Route 2 illustration into the primary AHA illustration style
- generate Healthy Living mini-illustration references from the supplied style board

### Change
- update `illustration-style.md` so Route 2 is no longer framed as a secondary branch
- update image-generation prompt source files so future styleframe prompts use the new no-outline Route 2 language instead of the older contour-led language
- define the primary illustration system around:
  - no-outline flat-fill construction
  - adult simplified figures
  - restrained off-white, bone, stone, taupe, charcoal, AHA red, and deep red palette
  - one red action or emotional signal per scene
  - scaling from icons to cards to editorial guide scenes
- log the decision as accepted
- attempt Image API generation with the supplied style reference; the request failed because the account billing hard limit has been reached
- create a local vector fallback 3x2 board of Healthy Living guide topic illustrations; this was later rejected and deleted

### Files
- `design/ui-style-inventory/illustration-style.md`
- `prompts/image-generation/master-styleframe-prompt.md`
- `prompts/image-generation/styleframe-01.md`
- `prompts/image-generation/styleframe-02.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- do not promote the generated board
- use prompt-only handoff for the next Healthy Living grid generation
- rerun through real image generation only when the Image API is available

## 2026-05-07
### Task
- correct Healthy Living mini-illustration direction after rejected local fallback

### Change
- delete the generated local fallback PNG
- remove temporary fallback-generation files
- update illustration guidance so Healthy Living topic illustrations start from the wireframe icon subjects instead of defaulting to people
- record that when the request is for image output, blocked image generation should result in a prompt-only handoff, not a local SVG, PIL, or code-drawn substitute

### Files
- `design/ui-style-inventory/illustration-style.md`
- `prompts/image-generation/master-styleframe-prompt.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- use the prompt-only grid direction for the next image-generation attempt
- keep people optional for Healthy Living topic art

## 2026-05-07
### Task
- save the self-contained Healthy Living Route 2 topic-grid prompt
- clean up rejected generated-image artifacts

### Change
- add a reusable standalone image prompt for the six Healthy Living guide topics
- register the prompt in the image-generation prompt map
- remove the now-empty rejected `output/imagegen` artifact path
- leave older unrelated `tmp/imagegen` scratch files in place

### Files
- `prompts/image-generation/healthy-living-topic-grid-route2.md`
- `prompts/image-generation/board-to-prompt-map.yaml`
- `projects/aha-website-refresh/session-log.md`

### Next
- use `prompts/image-generation/healthy-living-topic-grid-route2.md` as the starting prompt for the next real raster image generation

## 2026-05-07
### Task
- document and tidy the final High Blood Pressure condition guide prototype

### Change
- add a final decision source note for the condition-guide model
- keep the cleaned prototype as the current page artifact
- remove intermediate prototype files:
  - preview screenshots
  - Figma capture exports
  - Figma push exports
  - redirect stub page
  - unused icon placeholder assets
- update indexes and cleanup register to point at the final files only
- log the accepted condition-guide pattern as a decision
- log route impact: condition pages stay fixed and authority-led; adaptive behavior stays with Healthy Living exploration

### Files
- `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/`
- `knowledge/sources/current-site-audit/high-blood-pressure-condition-guide-final-2026-05-07.md`
- `knowledge/sources/current-site-audit/index.md`
- `knowledge/sources/index.yaml`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/cleanup-candidates.md`
- `logs/decision-log.md`
- `logs/route-evolution.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- use the cleaned prototype folder for Figma transfer
- replace placeholder links before production
- run AHA clinical review before publication

## 2026-05-07
### Task
- simplify the Healthy Living Route 2 topic-grid prompt

### Change
- reduce each topic illustration to one main icon-like subject plus one soft support shape
- use the Sleep pillow/moon example as the simplicity benchmark
- keep people excluded
- keep the prompt self-contained and raster-only

### Files
- `prompts/image-generation/healthy-living-topic-grid-route2.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- use the simplified prompt for the next raster image generation attempt

## 2026-05-07
### Task
- save plain-text copy of the simplified Healthy Living Route 2 prompt

### Change
- add prompt-only `.txt` file for direct copy/paste or imagegen CLI use
- link the prompt-only file from the image-generation prompt map

### Files
- `prompts/image-generation/healthy-living-topic-grid-route2.prompt.txt`
- `prompts/image-generation/board-to-prompt-map.yaml`
- `projects/aha-website-refresh/session-log.md`

### Next
- use the `.prompt.txt` file when running the next raster image generation

## 2026-05-07
### Task
- update Healthy Living topic-grid prompt to avoid object cropping

### Change
- add explicit no-cropping rule for all topic objects
- add interest through layering, diagonal placement, varied scale, and object relationships
- keep the simplified icon-like direction intact

### Files
- `prompts/image-generation/healthy-living-topic-grid-route2.md`
- `prompts/image-generation/healthy-living-topic-grid-route2.prompt.txt`
- `projects/aha-website-refresh/session-log.md`

### Next
- use the updated no-crop prompt for the next raster image generation attempt

## 2026-05-07
### Task
- tune Healthy Living topic-grid prompt after near-final generated result

### Change
- require pure white board and cell backgrounds
- soften the quit smoking and vaping tile so it does not feel like an aggressive warning sign
- add more softness and layered bedding depth to the sleep tile
- keep the simple icon-like direction and no-crop rule

### Files
- `prompts/image-generation/healthy-living-topic-grid-route2.md`
- `prompts/image-generation/healthy-living-topic-grid-route2.prompt.txt`
- `projects/aha-website-refresh/session-log.md`

### Next
- rerun the prompt and compare whether the vape and sleep tiles now feel closer to the intended system

## 2026-05-08
### Task
- lock the primary illustration route and update its palette

### Change
- accept Route 2 as the single primary illustration route
- reduce warm brown and beige dominance in the palette
- define a cleaner core palette from the attached references
- add situational pastel tints for nature, water, soft support, food, and sleep
- update live Figma header copy for `Illustration Style` and `Colour Scheme`
- update prompt handoffs so future image generation uses the cooler palette

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
- generate the next illustration board with the cooler palette
- check whether pastels stay secondary and red remains the main AHA signal

## 2026-05-08
### Task
- correct illustration guideline artifact split

### Change
- keep Figma output limited to the colour palette
- add compact editable palette frame `AHA illustration palette - cooler core v2` to the live `Colour Scheme` section
- remove local references to the mistakenly-created Figma guideline board
- create the illustration guideline as an image instead

### Files
- `design/figma/workbench-section-map.yaml`
- `design/ui-style-inventory/illustration-style.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- generate the illustration guideline image

## 2026-05-11
### Task
- run morning memory-maintenance pass
- fix source-layer retrieval gaps
- normalize duplicate route-log IDs

### Change
- add the missing `current-site-audit` note files to the source indexes
- correct the Healthy Living adaptive hub source note so it points to stored evidence and the route spec, not a missing board image
- renumber duplicate accepted route IDs so route retrieval stays unambiguous

### Files
- `knowledge/sources/index.yaml`
- `knowledge/sources/current-site-audit/index.md`
- `knowledge/sources/current-site-audit/healthy-living-adaptive-super-hub-2026-05-07.md`
- `logs/route-evolution.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- decide whether to generate and store the updated two-state Healthy Living board image
- refresh the short route comparison summaries if the May route split needs a faster retrieval layer

## 2026-06-17
### Task
- run AHA brain library-maintenance pass
- restore missing local maintenance state files
- register current icon prompt assets

### Change
- verify the repo before edits
- confirm no Finder metadata files are present
- add current-state memory for this maintenance loop
- add automation inbox for blocked owner decisions and no-Figma follow-ups
- add compact hourly maintenance history
- register the icon prompt files in the prompt map
- add the icon prompt set to artifact lookup and human lookup
- keep Figma out of scope

### Files
- `brain/hourly-maintenance-loop.md`
- `projects/aha-website-refresh/now.md`
- `projects/aha-website-refresh/automation-inbox.md`
- `prompts/image-generation/board-to-prompt-map.yaml`
- `prompts/image-generation/icon-style-evolution-sheet.md`
- `prompts/image-generation/restrained-solid-icon-preview.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- use the registered icon prompts for the next raster icon generation pass
- keep proof-icon regeneration outside this no-Figma maintenance loop
- decide whether `npm run clean` should keep `output/icons/`

## 2026-06-17
### Task
- analyse daily maintenance chats
- merge Daily Brain Sync and library maintenance into one stronger loop
- give maintenance enough router authority to act on routine organization

### Change
- add read-only `artifact-lookup` routing
- add `brain-maintenance` routing for project lookup, cleanup, inbox, now, and session state
- add the active project `brain-maintenance` retrieval path
- define generated asset destinations in `design/generated/README.md`
- copy current icon review sheets from ignored `output/imagegen/` to `design/generated/review/2026-06-17-icon-style-exploration/`
- add a review manifest for the generated icon sheets
- add the icon review sheets to artifact lookup and human lookup
- close the `npm run clean` policy question by keeping `output/` disposable after promotion
- keep Figma sync and proof-icon generation as explicit non-default tasks

### Files
- `brain/router.yaml`
- `brain/hourly-maintenance-loop.md`
- `projects/aha-website-refresh/retrieval-index.yaml`
- `projects/aha-website-refresh/now.md`
- `projects/aha-website-refresh/automation-inbox.md`
- `projects/aha-website-refresh/cleanup-candidates.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`
- `design/generated/README.md`
- `design/generated/review/2026-06-17-icon-style-exploration/manifest.md`
- `design/generated/review/2026-06-17-icon-style-exploration/*.png`

### Next
- replace the app automation prompt with the AHA Brain Daily Librarian loop
- use the AHA Brain Daily Librarian loop on the next scheduled run
- keep accepted icon direction separate from review storage

## 2026-06-17
### Task
- set the accepted spatial icon sheet as the local icon style guide
- make the icon base style reusable for future AHA icon work

### Change
- replace the old line/duo icon direction with `Medical Soft Spatial - Colour Block`
- define the canonical shape, colour, depth, detail, and subject rules
- add the v4 icon sheet to the accepted generated icon folder
- register the accepted icon style in artifact lookup and human lookup
- add the accepted prompt to the prompt map
- record DEC-015
- leave Figma out of this pass

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
- use `design/ui-style-inventory/icons.md` as the first local style source for future icon prompts
- decide later whether to sync the local icon guide back to the live Icons board

## 2026-06-17
### Task
- create a 12-icon stress-test sheet for the accepted spatial icon style

### Change
- add a reusable stress-test prompt for 12 new AHA icon subjects
- generate two stress-test sheets
- keep `v1` as evidence of implementation drift
- keep `v2` as the cleaner review candidate
- copy both sheets from ignored output into durable review storage
- register the stress-test prompt and review folder in lookup files

### Files
- `prompts/image-generation/medical-soft-spatial-colour-block-stress-test.md`
- `design/generated/review/2026-06-17-medical-soft-spatial-stress-test/manifest.md`
- `design/generated/review/2026-06-17-medical-soft-spatial-stress-test/aha-medical-soft-spatial-colour-block-stress-test-v1.png`
- `design/generated/review/2026-06-17-medical-soft-spatial-stress-test/aha-medical-soft-spatial-colour-block-stress-test-v2.png`
- `prompts/image-generation/board-to-prompt-map.yaml`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- review whether the cleaner `v2` stress-test sheet exposes any remaining weak subject patterns
- decide whether any stress-test subjects should graduate into the accepted icon pattern list

## 2026-06-17
### Task
- organize generated icon sheets before pausing ideation

### Change
- copy remaining icon-generation sheets out of ignored `output/imagegen/`
- separate broad exploration, Medical Soft Spatial iteration, accepted base, and stress-test review folders
- update review manifests so each folder explains its role
- add missing icon prompts to the prompt map
- register the Medical Soft Spatial iteration folder in artifact lookup and human lookup
- keep `output/` disposable

### Files
- `design/generated/review/2026-06-17-icon-style-exploration/manifest.md`
- `design/generated/review/2026-06-17-icon-style-exploration/*.png`
- `design/generated/review/2026-06-17-medical-soft-spatial-iteration/manifest.md`
- `design/generated/review/2026-06-17-medical-soft-spatial-iteration/*.png`
- `prompts/image-generation/board-to-prompt-map.yaml`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- resume tomorrow from `design/ui-style-inventory/icons.md`
- use the accepted v4 sheet as the base and the stress-test folder as review evidence

## 2026-06-18
### Task
- run AHA Brain Daily Librarian baseline pass
- verify lookup, generated-asset, and cleanup state after the 2026-06-17 icon maintenance work
- keep this pass no-Figma and non-destructive

### Change
- verify `brain-maintenance` router and retrieval paths
- confirm `npm run verify:brain` passes
- confirm no Finder metadata files are present
- confirm generated icon review assets already have durable copies in `design/generated/`
- confirm `artifact-index.yaml`, `WHERE-THINGS-LIVE.md`, `cleanup-candidates.md`, and `automation-inbox.md` already cover the current local icon maintenance state
- keep lookup, cleanup, and inbox files unchanged because no new durable delta crossed the bar
- update current-state memory for this pass

### Files
- `projects/aha-website-refresh/now.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- keep proof-icon raster generation outside this no-Figma maintenance loop
- run any board-header sync only in an explicit Figma-enabled pass
- add new lookup entries only when new durable assets or accepted decisions appear

## 2026-06-18
### Task
- finish AHA Design System Step 2 variable consolidation
- keep live Figma cleanup non-rebinding and non-deleting

### Change
- verify Figma account as `alexander.beck@mrm.com`
- verify live counts before mutation
- rename variable collections in place to clean visible names
- complete deferred component color token renames under `component/color/*`
- rename generic `space/semantic/*` aliases to `spacing/gap/*`
- rename 2px and 6px spacing exceptions to `space/deferred/2px` and `space/deferred/6px`
- add compatibility-shim descriptions to old spacing, width, and container variables
- re-export final live variables to JSON and CSV
- update Step 2 matrix, preview, cleanup report, and delete-candidate report
- verify brain structure and final export counts

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-structure-preview.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-2-delete-candidates.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-2-final-cleanup-report.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-full-variable-export-step-2-final.raw.json`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-full-variable-export-step-2-final.json`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-full-variable-export-step-2-final.csv`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-migration-matrix-step-1.5.csv`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-2-batch-plan.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-2-execution-log.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-2-readiness-checklist.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- keep deletion blocked until live binding usage is audited
- keep live rebinding blocked until a separate rebind plan is approved
- map `spacing/stack/*`, `spacing/inline/*`, and `spacing/inset/*` before adding more relationship aliases

## 2026-06-18
### Task
- run Step 3 read-only usage audit for AHA Design System variables
- prepare live rebind plan before mutation

### Change
- verify Figma account as `alexander.beck@mrm.com`
- verify current live baseline as 7 collections, 838 variables, 699 color, 129 float, and 10 string
- confirm no unresolved aliases and no duplicate variable names
- discover MCP limitation: `loadAllPagesAsync` is unsupported in this runtime
- scan variable aliases, local styles, style consumers, and 13 key component/foundation pages
- identify live usage blocking deletion for old spacing, layout container, layout width, and typography regular shims
- create Step 3 usage audit and rebind plan
- update delete-candidate report with Step 3 findings
- keep Figma mutation blocked until fresh Step 3 checkpoint is confirmed

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-3-usage-audit.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-3-rebind-plan.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-2-delete-candidates.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- confirm fresh Figma checkpoint before any live mutation
- run collection name correction after checkpoint
- run one rebind canary per batch before broader rebinding

## 2026-06-18
### Task
- run Step 3 live variable rebinding and cleanup after owner checkpoint
- keep visual output stable and avoid deletion without zero-use proof

### Change
- verify Figma account as `alexander.beck@mrm.com`
- use checkpoint `Pre Step 3 live rebinding checkpoint - 2026-06-18`
- rename `Primitives` to `_Primitives`
- rename `Radius` to `Effects`
- update `spacing/gap/*` variables so they carry direct responsive values instead of aliasing old `spacing-*` tokens
- rebind verified gap-like spacing consumers on `Typography`, `Spacing, radius & grids`, and `Buttons`
- create 15 canonical `layout/*` variables in `Spacing & Layout`
- rebind verified layout consumers on `Spacing, radius & grids`
- rebind 11 local text styles and 2 direct Typography-page text nodes from `Font weight/regular` to `font/weight/500`
- keep all variables that still have live or uncertain consumers
- re-export final Step 3 variables to JSON and CSV

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-structure-preview.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-full-variable-export-step-3-final.raw.json`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-full-variable-export-step-3-final.json`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-full-variable-export-step-3-final.csv`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-2-delete-candidates.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-3-final-report.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-3-rebind-plan.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-3-usage-audit.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- do not delete `Layout Widths` or `Layout Containers` until a complete zero-use proof exists
- map remaining padding/inset usage before creating or rebinding to `spacing/inset/*`
- rebind layout consumers at source components where instance descendants are immutable
- keep `Font weight/regular` as deprecated compatibility until a full all-page zero-use audit is available

## 2026-06-18
### Task
- finish Step 4 live variable organization cleanup
- collapse visible Figma collections to the approved five-collection model

### Change
- verify Figma account as `alexander.beck@mrm.com`
- rename `_Primitives / Colors/*` raw ramps to `_Primitives / color/palette/*`
- rename `_Primitives / viewport-width/*` to `_Primitives / size/layout/*`
- reorganize `Color` into `semantic/*`, `component/*`, and `utility/*`
- rebind 39 effect-style color bindings from deprecated effect-source variables to `semantic/effect/*`
- create verified `spacing/inset/*` variables and rebind 158 Typography-page padding fields
- resolve alias issues caused by owner-side deletion of deferred 2px and 6px primitives
- delete 23 deprecated effect-source variables after checks passed
- export the final Step 4 variable library

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-structure-preview.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-full-variable-export-step-4-final.raw.json`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-full-variable-export-step-4-final.json`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-full-variable-export-step-4-final.csv`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-2-delete-candidates.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-4-final-report.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-4-organization-audit.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-step-4-organization-matrix.csv`
- `projects/aha-website-refresh/session-log.md`

### Next
- decide whether direct 2px and 6px spacing values should return as explicit exception primitives
- expand `spacing/inset/*` only when additional padding usage requires it
- add semantic text-role aliases in a separate typography pass

## 2026-06-18
### Task
- adjust the live variable library structure for James handoff
- add responsive typography structure and a Components collection

### Change
- rename `_Primitives` to `Primitives`
- rename `Spacing & Layout` to `Layout`
- create 28 numeric typography primitive variables in `Primitives`
- convert `Typography` from one `Value` mode to `XL / L / M / S`
- alias `Typography / font/size/*` and `font/line-height/*` to numeric primitives by responsive mode
- create `Components` collection with `Light mode / Dark mode`
- seed `Components` with 25 component color alias variables
- validate no unresolved aliases and no duplicate names

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-structure-preview.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- decide whether component consumers should be rebound from `Color / component/*` to `Components / color/*`
- add semantic text-role typography aliases after James review

## 2026-06-18
### Task
- correct live icon-size variable placement in the AHA Design System library
- keep component size tokens inside the existing `Components` collection

### Change
- verify Figma account as `alexander.beck@mrm.com`
- move the accepted icon-size token set into `Components / icons/size/*`
- remove the mistaken `Component Sizing` collection from the live file
- remove duplicate `Components / icons/sizing/*` variables created during correction
- scope all corrected icon-size variables to `WIDTH_HEIGHT`
- add WEB code syntax using `--aha-component-icons-size-*`
- keep hidden primitive `Primitives / space/350 = 56`
- alias all corrected icon-size variables to `Primitives / space/*`
- verify the live library is back to six collections and `Components` contains 34 variables

### Files
- `Figma: AHA - Design System [WIP]`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- bind live icon components to `Components / icons/size/*` when icon component cleanup continues
- decide the responsive implementation separately before changing the `Components` collection mode strategy

## 2026-06-18
### Task
- extract Critical Mass website design language for token guide reference

### Change
- read `criticalmass.com` homepage, capabilities, news, jobs, contact, London office, and Chicago office
- capture desktop, tablet, and mobile evidence with Playwright
- document color, type, spacing, grid, section scale, media use, scroll behavior, hover behavior, navigation, and responsive behavior
- add token-guide translation notes and open-source photo guidance

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/design.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- use `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/design.md` before restyling the token guide
- verify image licenses before adding any open-source photography to the token guide

## 2026-06-18
### Task
- apply Critical Mass web direction to the AHA token system guide
- keep token guidance and section anchors stable

### Change
- replace the fixed docs sidebar with an oversized masthead and four-square guide menu
- add full-screen menu search and section navigation
- add a large hard-edged media band after the intro
- use warm eggshell, AHA red, system blue, pale blue, strict grid bands, and row-based documentation styling
- add Wikimedia Commons image attribution and license note
- update menu JavaScript for open, close, Escape, focus loop, search, and active section state
- update README asset names and media source metadata

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/index.html`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/styles.css`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/script.js`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/README.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/assets/design-thinking-workshop-wmde-2.jpg`
- `projects/aha-website-refresh/session-log.md`

### Next
- verify rendered desktop and mobile layouts
- verify menu, search, anchor navigation, and accessibility focus behavior

## 2026-06-18
### Task
- implement responsive spacing token plan for the AHA Design System variable library
- remember the live WIP Figma file location for future token work

### Change
- verified the live Figma URL resolves by metadata read
- recorded the design-system file in `WHERE-THINGS-LIVE.md` and `artifact-index.yaml`
- documented the responsive spacing target matrix for `spacing/gap/*` and `spacing/inset/*`
- documented the required missing primitive steps: `space/175`, `space/350`, `space/450`, `space/550`, `space/700`, and `space/900`
- attempted the live Plugin API remap, but Figma rejected it because edit access is unavailable
- ran `npm run figma:check -- --url "https://www.figma.com/design/DYhenSpnamlWoqLmszNKE3/AHA---Design-System--WIP-?node-id=1-1183&t=xIdbppZWlLAihoHF-1&view=variables" --json`
- confirmed the native remote Figma connector is configured but not logged in
- opened the Figma OAuth URL for native connector login, but the browser callback did not complete before the login process was stopped

### Files
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-current-token-table.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- log into the native Figma connector as `alexander.beck@mrm.com`
- confirm the account has editor access to `DYhenSpnamlWoqLmszNKE3`
- rerun the responsive spacing remap and variable export validation

## 2026-06-18
### Task
- rewrite the AHA token guide for design-team reading
- strengthen the active guide-menu state

### Change
- remove account-specific source language from the guide
- remove the top status line above the masthead
- rewrite the guide around a clearer editorial path: overview, structure, layers, usage, export, and cleanup
- add rationale for the collection model, mode behavior, semantic layers, component APIs, and export naming
- keep practical token rules in tables so readers get detail as they move through the story
- make the active menu item a hard-edged blue block with a red marker and white text
- make Escape clear menu search and close the guide menu
- make README publish notes account-neutral

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/index.html`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/styles.css`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/script.js`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/README.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- verify rendered desktop and mobile guide copy
- verify active menu state, search, section navigation, and focus behavior

## 2026-06-18
### Task
- remove the top-right guide menu from the token guide
- move search below the sidebar section links

### Change
- replace the full-screen guide menu and four-square trigger with a persistent sidebar
- keep the same section anchors and active-section styling
- move guide search below the sidebar navigation links
- simplify menu JavaScript by removing overlay, close, Escape-close, and focus-trap behavior
- keep search indexing, result links, section scrolling, and active-state updates

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/index.html`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/styles.css`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/script.js`
- `projects/aha-website-refresh/session-log.md`

### Next
- verify desktop and mobile rendered layout
- verify sidebar search, section navigation, active state, skip link, and console health

## 2026-06-18
### Task
- improve token-guide section spacing with persistent sidebar orientation
- apply Critical Mass typography from the live website

### Change
- download the Critical Mass webfont files declared by `criticalmass.com/fonts.css`
- add `Compacta Std` and `PP Object Sans` font-face rules to the guide
- apply `Compacta Std` to display headings and `PP Object Sans` to body and UI text
- reduce chapter heading scale by roughly 70 percent
- move chapter headings farther from the right-side documentation content
- keep colored chapter bands and the persistent left sidebar
- document the new font assets in the README

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/styles.css`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/README.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/assets/fonts/CompactaStd.woff2`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/assets/fonts/PPObjectSans-Regular.woff2`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/assets/fonts/PPObjectSans-Bold.woff2`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/assets/fonts/PPObjectSans-Slanted.woff2`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/assets/fonts/PPObjectSans-BoldSlanted.woff2`
- `projects/aha-website-refresh/session-log.md`

### Next
- review the rendered guide with the design team at `http://127.0.0.1:4173/`

## 2026-06-19
### Task
- run AHA Brain Daily Librarian baseline pass
- verify lookup and cleanup state after the 2026-06-18 design-system and token-guide work
- keep this pass no-Figma and non-destructive

### Change
- verify `brain-maintenance` router and retrieval paths
- confirm `npm run verify:brain` passes
- confirm no Finder metadata files are present
- refresh current-state memory for this pass
- log `output/playwright/criticalmass/` as a cleanup defer because `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/design.md` cites scratch capture artifacts
- add one stable owner decision for durable evidence placement of the Critical Mass captures
- keep lookup files unchanged because no new accepted or promoted artifact crossed the bar under the current router authority

### Files
- `projects/aha-website-refresh/now.md`
- `projects/aha-website-refresh/automation-inbox.md`
- `projects/aha-website-refresh/cleanup-candidates.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- decide whether to promote `output/playwright/criticalmass/` into `reference/evidence/` or rewrite `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/design.md` to avoid scratch evidence
- keep proof-icon raster generation outside this no-Figma maintenance loop
- run any board-header sync only in an explicit Figma-enabled pass

## 2026-06-23
### Task
- create a flat, line-based icon style as a bitmap reference sheet

### Change
- generated a 12-icon `Flat Clinical Line` bitmap candidate
- copied the selected PNG from `.codex/generated_images` into durable generated review assets
- added the prompt source and manifest for reuse
- updated generated-asset lookup surfaces
- kept `Medical Soft Spatial - Colour Block` as the accepted icon direction

### Files
- `design/generated/review/2026-06-23-flat-clinical-line/aha-flat-clinical-line-12-sheet-v1.png`
- `design/generated/review/2026-06-23-flat-clinical-line/manifest.md`
- `prompts/image-generation/flat-clinical-line-icon-sheet.md`
- `prompts/image-generation/board-to-prompt-map.yaml`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- visually reviewed generated bitmap sheet
- confirmed copied asset is a `1254 x 1254` PNG

### Next
- decide whether the flat line candidate should stay a utility-only companion style or become the main icon direction

## 2026-06-20
### Task
- run AHA Brain Daily Librarian pass
- index the current token-guide site in lookup files
- keep this pass no-Figma and non-destructive

### Change
- verify `brain-maintenance` router and retrieval paths
- confirm `npm run verify:brain` passes
- confirm no Finder metadata files are present
- add `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/` to machine and human lookup files
- refresh current-state memory for the 2026-06-20 pass
- keep the Critical Mass capture placement question stable in cleanup and inbox

### Files
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/now.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- decide whether to promote `output/playwright/criticalmass/` into `reference/evidence/` or rewrite `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/design.md` to avoid scratch evidence
- keep proof-icon raster generation outside this no-Figma maintenance loop
- run any board-header sync only in an explicit Figma-enabled pass

## 2026-06-21
### Task
- run AHA Brain Daily Librarian pass
- verify whether any new scratch or lookup state crossed the maintenance bar
- keep this pass no-Figma and non-destructive

### Change
- verify `brain-maintenance` router and retrieval paths
- confirm `npm run verify:brain` passes
- confirm no Finder metadata files are present
- confirm lookup, cleanup, and inbox files already cover the durable June 17-20 icon and token-guide work
- keep uncited `output/playwright/token-guide-component-policy-*.png` in scratch because no durable note cites them
- add a compact maintenance rule so future runs do not reopen uncited Playwright QA captures as cleanup or lookup work
- refresh current-state memory for the 2026-06-21 pass

### Files
- `brain/hourly-maintenance-loop.md`
- `projects/aha-website-refresh/now.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- decide whether to promote `output/playwright/criticalmass/` into `reference/evidence/` or rewrite `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/design.md` to avoid scratch evidence
- keep proof-icon raster generation outside this no-Figma maintenance loop
- run any board-header sync only in an explicit Figma-enabled pass

## 2026-06-22
### Task
- run AHA Brain Daily Librarian pass
- verify whether any new repo-backed maintenance action crossed the bar
- keep this pass no-Figma and non-destructive

### Change
- verify `brain-maintenance` router and retrieval paths
- confirm `npm run verify:brain` passes
- confirm no Finder metadata files are present
- confirm the token-guide site, generated review manifests, and known scratch captures still resolve from current lookup files
- keep `output/playwright/token-guide-component-policy-*.png` in scratch because no durable note cites them
- keep lookup, cleanup, and inbox files unchanged because no new durable artifact or resolved owner decision appeared
- refresh current-state memory for the 2026-06-22 pass

### Files
- `projects/aha-website-refresh/now.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- decide whether to promote `output/playwright/criticalmass/` into `reference/evidence/` or rewrite `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/design.md` to avoid scratch evidence
- keep proof-icon raster generation outside this no-Figma maintenance loop
- run any board-header sync only in an explicit Figma-enabled pass

## 2026-06-22
### Task
- apply the responsive spacing token plan in the live AHA Design System WIP Figma file
- keep typography audit-only for this pass
- sync repo lookup docs and token guides to the live change

### Change
- verified native Figma identity as `alexander.beck@mrm.com`
- confirmed live structure is `Primitives`, `Layout`, and `Typography`
- created missing hidden primitives `space/175`, `space/450`, `space/550`, `space/700`, and `space/900`
- verified existing `space/350` and normalized its hidden/code-syntax state
- remapped `Layout / spacing/gap/*` aliases across `S / M / L / XL`
- remapped `Layout / spacing/inset/*` aliases across `S / M / L / XL`
- audited `Typography / font/size/*` and `Typography / font/line-height/*` without changing typography tokens
- final live validation passed with 858 local variables, no duplicate variable names, no unresolved aliases, six responsive spacing primitives present once, and all 100 planned spacing mode cells resolving correctly

### Files
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-current-token-table.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- spot-check bound components/pages in Figma by switching `S / M / L / XL` modes
- prepare a separate typography proposal only if the audited static type tokens need further responsive tuning

## 2026-06-22
### Task
- apply the approved follow-up cleanup from the full Figma variables library review
- keep primitive publishing included
- remove deprecated static-font shims after preflight

### Change
- verified native Figma identity as `alexander.beck@mrm.com`
- attempted a named Figma version checkpoint, but the MCP connector reported `figma.saveVersionHistoryAsync is not yet supported`
- captured a pre-change target snapshot through the Figma connector before mutation
- exposed `space/175`, `space/350`, `space/450`, `space/550`, `space/700`, and `space/900` for publishing while keeping their existing spacing-primitive scopes
- added WEB code syntax to all `Layout / spacing/inset/*` tokens
- added descriptions to all `Components / icons/size/*` tokens
- added published exact-value primitives for the app store badge border and avatar neutral background
- re-aliased the app store badge border and avatar neutral component color tokens so they no longer hold raw color mode values
- removed eight `Typography / _deprecated/static-font/*` shims
- left paragraph-width and toggle-border scope cleanup untouched until the authoring policy is clearer

### Validation
- final live validation reported 852 local variables
- collection counts: Primitives 449, Color 276, Layout 40, Effects 31, Typography 22, Components 34
- no duplicate variable names
- no unresolved aliases
- no missing mode values
- no deprecated static-font variables remaining
- no missing inset code syntax
- no missing icon-size descriptions
- no raw mode values remaining on the two target component color tokens

### Files
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-current-token-table.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- spot-check components that may have direct node bindings to the removed static-font variables
- decide picker-scope policy separately for paragraph width and toggle border tokens

## 2026-06-22
### Task
- apply responsive typography and scope cleanup improvements in the live AHA Design System WIP Figma file
- keep body typography stable
- sync repo docs and logs to the live change

### Change
- verified native Figma identity as `alexander.beck@mrm.com`
- inspected live typography aliases, primitive coverage, and scope candidates
- added published primitives `typography/size/56`, `typography/size/64`, and `typography/size/80`
- added published primitives `typography/line-height/48`, `typography/line-height/64`, `typography/line-height/76`, and `typography/line-height/96`
- published all numeric typography size and line-height primitives
- remapped display typography aliases so `XL` grows beyond `L`
- kept body typography stable at `md = 16 / 24`, `lg = 18 / 28`, and `xl = 20 / 30`
- scoped `Layout / layout/width/paragraph-max` to `WIDTH_HEIGHT`
- scoped `Components / toggles/color/toggle-border`, `toggle-slim-border-pressed`, and `toggle-slim-border-pressed-hover` to `STROKE_COLOR`
- confirmed the MCP connector does not support `saveVersionHistoryAsync` or `commitUndo`

### Validation
- final live validation reported 859 local variables
- collection counts: Primitives 456, Color 276, Layout 40, Effects 31, Typography 22, Components 34
- no duplicate variable names
- no unresolved aliases
- no missing mode values
- no hidden numeric typography size or line-height primitives
- body scale remains 16/24 or larger across all modes
- Typography page spot-check found 1,288 Typography/Layout bindings
- Buttons page spot-check found 1,389 Layout/Typography/Components bindings
- Toggles page spot-check confirmed the three target border tokens use `STROKE_COLOR`

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-current-token-table.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- check text style naming and grouping against the display/body token roles
- decide whether unused toggle border tokens should stay or move to cleanup review

## 2026-06-22
### Task
- add intermediate typography primitives for granular responsive display scaling
- keep semantic typography token names stable
- sync repo docs and logs

### Change
- verified native Figma identity as `alexander.beck@mrm.com`
- inspected live display aliases and primitive gaps
- added published primitives `typography/size/26`, `typography/size/34`, `typography/size/44`, `typography/size/52`, and `typography/size/68`
- added published primitives `typography/line-height/34`, `typography/line-height/42`, `typography/line-height/68`, and `typography/line-height/80`
- remapped display typography aliases to the granular `S / M / L / XL` matrix
- kept body typography stable at `md = 16 / 24`, `lg = 18 / 28`, and `xl = 20 / 30`
- final live validation reported 868 variables
- collection counts: Primitives 465, Color 276, Layout 40, Effects 31, Typography 22, Components 34
- no duplicate variable names
- no unresolved aliases
- no missing mode values
- Typography page spot-check found 1,288 Typography/Layout bindings

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-current-token-table.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- check text-style naming and grouping against the granular display ramp
- check real page compositions for any display token that still jumps too much between `M` and `L`

## 2026-06-22
### Task
- apply the final token-system cleanup in the live AHA Design System WIP Figma file
- keep semantic token names and responsive spacing/type behavior stable
- sync repo docs and logs to the live change

### Change
- verified native Figma identity as `alexander.beck@mrm.com`
- published the approved `space/*` scale through `space/1600`
- added `Primitives / size/layout/320 = 320`
- re-aliased `Layout / layout/width/xxs` to `Primitives / size/layout/320`
- kept `space/2000` hidden as legacy spacing overflow
- added exact alpha, border, and shadow color primitives
- removed raw values from `Color`, `Layout`, `Typography`, and `Components`
- added descriptions to utility palettes, text styles, unbound-but-used paint styles, effect presets, and grid presets
- fixed `Text md/Semibold` so `fontStyle` binds to `Primitives / typography/weight/600`
- moved duplicate `*/Regular` text styles under `_compat/text/*` because live consumers still exist and the MCP runtime cannot load Lub Dub for safe rebinding
- removed paragraph-spacing variable bindings from all 44 text styles
- removed 81 zero-consumer legacy paint styles after usage preflight
- final live validation reported 908 variables
- collection counts: Primitives 505, Color 276, Layout 40, Effects 31, Typography 22, Components 34
- no duplicate variable names
- no unresolved aliases
- no missing mode values
- no missing WEB code syntax
- no raw values in `Color`, `Layout`, `Typography`, or `Components`

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-current-token-table.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- in Figma desktop with Lub Dub available, set all text-style numeric paragraph spacing values to 0
- if deletion is still wanted, rebind `_compat/text/*` consumers to matching Medium styles before removing those compatibility styles
- use retained paint-style descriptions as the cleanup line for future style-library pruning

## 2026-06-22
### Task
- fix the live AHA Design System WIP type scale
- add missing component spacing tokens for buttons
- keep writing-guide work out of scope
- sync repo docs and logs to the live change

### Change
- verified native Figma identity as `alexander.beck@mrm.com`
- snapshot-audited the live variable collections, text styles, and button component roots before editing
- recreated affected scale variables in visible largest-to-smallest order while keeping canonical public names and WEB syntax unchanged
- applied the approved responsive typography matrix for display and text size/line-height aliases
- added `Primitives / typography/size/22`
- added `Primitives / space/component/button/18`, `space/component/button/14`, and `space/component/button/10`
- removed unused intermediate typography primitives after a scoped zero-reference audit
- added public `Components / buttons/*` spacing aliases for vertical padding, horizontal padding, icon-only padding, button gaps, and social button spacing
- rebound Buttons page component root padding and gap fields from deprecated layout spacing or raw non-zero values to `Components / buttons/*`
- updated local effect and grid style bindings created by the variable replacement so hidden backup variables could be removed cleanly

### Validation
- final live validation reported 916 variables
- collection counts: Primitives 495, Color 276, Layout 40, Effects 31, Typography 22, Components 52
- no duplicate variable names
- no unresolved aliases
- no missing mode values
- no temporary replacement variables
- all checked alias layers use aliases rather than raw values
- typography matrix resolves to the approved `XL / L / M / S` values
- scale groups validate largest-to-smallest: primitive spacing, primitive typography size, primitive typography line-height, layout widths, radii, shadow levels, component icon sizes, button spacing tokens, and `Typography`
- Buttons page component roots have 0 raw non-zero padding/gap values and 0 deprecated spacing bindings
- Typography and Buttons page screenshots rendered after the change for visual spot-check

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-current-token-table.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- keep future button padding and gap changes inside `Components / buttons/*`
- avoid adding back display-only type scale edits without checking the text scale matrix too

## 2026-06-22
### Task
- inspect reported Components button spacing variable mix in AHA Design System WIP
- scan for similar component-spacing alias drift
- repair live Figma variables if editor access is available

### Change
- confirmed native Figma account as `alexander.beck@mrm.com`
- confirmed Figma MCP is configured and logged in for file `DYhenSpnamlWoqLmszNKE3`
- identified the visible issue: `Components / buttons / padding-y` mixes `Primitives / space/component/button/*` aliases with generic `Primitives / space/*` aliases
- confirmed the intended structure from repo docs: public button spacing API stays in `Components / buttons/*`; exact component button values stay in `Primitives / space/component/button/*`
- read representative Buttons page nodes and confirmed public aliases resolve for main button padding, icon-only padding, social padding, and social gap
- found related node-level evidence that button instances still expose deprecated spacing tokens such as `_deprecated/spacing/xxs`
- attempted full local variable graph scan through Figma Plugin API
- deferred live scan and repair because Figma returned: `Looks like you don't have edit access to this file. The file owner can share it with you and make you an editor.`
- attempted REST variable fallback and deferred because Figma REST returned `403 Invalid token`

### Files
- `projects/aha-website-refresh/session-log.md`

### Next
- restore editor access for `alexander.beck@mrm.com` on AHA Design System WIP
- run local variable graph audit with Figma Plugin API
- add missing exact button primitives for all button API values that currently fall through to generic spacing, likely `space/component/button/8`, `space/component/button/12`, `space/component/button/16`, and `space/component/button/24`
- rebind `Components / buttons/*` spacing aliases to `Primitives / space/component/button/*`
- verify no `Components / buttons/*` spacing alias points directly to generic `Primitives / space/*`
- verify button component roots have no raw non-zero padding or gap values and no deprecated spacing bindings

## 2026-06-22
### Task
- expand the button-spacing alias-boundary review beyond the screenshot
- use repo exports and live node reads while full live variable API access is blocked

### Change
- scanned current token docs for button API values against documented `space/component/button/*` primitives
- found documented button-specific primitives only for `10`, `14`, and `18`
- found button padding API values also require `8`, `12`, and `16`
- found definite affected padding aliases:
  - `buttons/padding-y/lg = 12`
  - `buttons/padding-y/sm = 8`
  - `buttons/padding-x/lg = 16`
  - `buttons/padding-x/sm = 12`
  - `buttons/icon-only/padding/lg = 12`
  - `buttons/icon-only/padding/sm = 8`
  - `buttons/social/padding-x/with-text = 16`
- flagged conditional gap aliases for design-system decision:
  - `buttons/gap/md = 8`
  - `buttons/gap/sm = 4`
  - `buttons/social/gap = 24`
- scanned latest full raw export available in repo, `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-full-variable-export-step-4-final.raw.json`
- found the export predates the final `Components / buttons/*` pass, so it cannot fully prove current live state
- found `Layout / _deprecated/spacing/sm` in the old raw export, but it is marked `deletedButReferenced`, so it should not be treated as a current local variable issue
- checked representative live button nodes through read-only `get_variable_defs`
- confirmed affected public aliases are actively used on live button nodes, including `var(--aha-buttons-padding-y-lg) = 12`, `var(--aha-buttons-padding-y-sm) = 8`, `var(--aha-buttons-padding-x-lg) = 16`, `var(--aha-buttons-icon-only-padding-lg) = 12`, and social spacing aliases
- did not find enough live API access to complete an exhaustive current variable-table scan

### Files
- `projects/aha-website-refresh/session-log.md`

### Next
- restore editor access for the Figma Plugin API
- run a full current live variable-table audit, not just node-level variable reads
- create or confirm `Primitives / space/component/button/8`, `12`, and `16`
- rebind all definite affected button padding aliases to those component-specific primitives
- decide whether button gap aliases should use generic spacing or a separate exact button-gap primitive layer
- keep deleted-but-referenced variables out of current repair plans unless a live binding audit shows they still affect active components

## 2026-06-22
### Task
- create a repeatable full Figma variable read and repair workflow
- stop relying on selection-bound or node-level variable reads for token cleanup

### Change
- added `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/scripts/figma-variables.mjs`
- added `npm run figma:variables`
- added `fetch` command for full Figma REST `variables/local` export
- added `audit` command for full local variable graph checks
- added `plan-button-spacing` command to build a reviewable button spacing repair payload
- added `apply-button-spacing` command that writes only with `--yes`, a token, and Figma edit access
- documented the workflow in `scripts/README.md`
- confirmed local audit works against `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-full-variable-export-step-4-final.raw.json`
- confirmed live fetch is blocked in this shell because `FIGMA_TOKEN` or `FIGMA_ACCESS_TOKEN` is not set

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/scripts/figma-variables.mjs`
- `package.json`
- `scripts/README.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- set `FIGMA_TOKEN` or `FIGMA_ACCESS_TOKEN` with `file_variables:read`
- run `npm run figma:variables -- fetch --out /Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/figma-variable-audits/latest.raw.json`
- run `npm run figma:variables -- audit --input /Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/figma-variable-audits/latest.raw.json`
- run `npm run figma:variables -- plan-button-spacing --input /Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/figma-variable-audits/latest.raw.json`
- review the plan before running `apply-button-spacing --yes`
- use a token with `file_variables:write` and edit access for live mutation

## 2026-06-22
### Task
- retry live access to AHA Design System WIP after user confirmed the work Figma account
- complete the full live variable audit and repair the button spacing alias boundary

### Change
- confirmed Figma MCP `whoami` is `alexander.beck@mrm.com`
- confirmed the account has a full/expert seat on `Figma - Agency Design Platform`
- confirmed the Figma Plugin API can read the live file directly through `use_figma`
- audited all 916 local variables across six collections before mutation
- verified pre-repair integrity: no duplicate variable names, no unresolved aliases, and no missing mode values
- found 14 bad button padding mode cells where `Components / buttons/*` aliases pointed to generic `Primitives / space/*`
- created the missing exact button primitives:
  - `Primitives / space/component/button/8`
  - `Primitives / space/component/button/12`
  - `Primitives / space/component/button/16`
- gave the new primitives matching descriptions, publish state, and WEB code syntax
- rebound both Light mode and Dark mode values for:
  - `Components / buttons/padding-y/lg`
  - `Components / buttons/padding-y/sm`
  - `Components / buttons/padding-x/lg`
  - `Components / buttons/padding-x/sm`
  - `Components / buttons/icon-only/padding/lg`
  - `Components / buttons/icon-only/padding/sm`
  - `Components / buttons/social/padding-x/with-text`

### Validation
- post-repair live audit reports 919 local variables
- collection counts: Primitives 498, Color 276, Layout 40, Effects 31, Typography 22, Components 52
- no duplicate variable names
- no unresolved aliases
- no missing mode values
- `Primitives / space/component/button/*` now includes `8`, `10`, `12`, `14`, `16`, and `18`
- button spacing audit checked 36 mode cells and found 0 padding alias-boundary problems

### Files
- `Figma: AHA - Design System [WIP]`
- `projects/aha-website-refresh/session-log.md`

### Next
- leave button gap aliases unchanged unless we decide gaps should also use exact component-specific primitives
- keep REST-token setup separate from MCP access; MCP can read/write the file, but shell REST commands still need `FIGMA_TOKEN` or `FIGMA_ACCESS_TOKEN`

## 2026-06-22
### Task
- check the remaining button spacing findings against the written token guide
- align local guide and lookup docs to the live Figma repair

### Change
- confirmed the guide treats `spacing/gap/*` and core `space/*` values as valid for auto-layout gaps
- confirmed the guide did not require button gap aliases to use exact `space/component/button/*` primitives
- left `buttons/gap/md`, `buttons/gap/sm`, and `buttons/social/gap` unchanged in Figma
- made the guide explicit that every public button padding alias should resolve through `Primitives / space/component/button/*`
- updated the documented button padding primitive set to include `8`, `10`, `12`, `14`, `16`, and `18`
- updated current validation counts from 916 / 495 primitives to 919 / 498 primitives
- recorded DEC-023 for the button padding alias-boundary rule

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-current-token-table.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- revisit button gaps only if a separate component-gap primitive rule is approved
- use the guide rule before treating generic gap aliases as defects

## 2026-06-22
### Task
- move AHA design-system reference work into one dedicated folder
- keep token guide, variable docs, exports, and export scripts discoverable together

### Change
- created `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/` as the durable design-system reference home
- moved AHA design-system docs, reports, CSV/JSON exports, and variable export chunks into `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/`
- moved the variable export normalizer into `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/scripts/`
- moved the token guide site into `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/`
- added `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/README.md` as the folder entrypoint
- updated `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/scripts/figma-variables.mjs` so new variable audit artifacts default to `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/figma-variable-audits/`
- updated lookup files and path references from the old `reference/docs/` and `reference/site/` locations

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/scripts/figma-variables.mjs`
- `scripts/README.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/now.md`
- `projects/aha-website-refresh/cleanup-candidates.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `npm run verify:brain` passed
- no stale design-system doc, normalizer, token guide site, or figma-variable-audit path references remain in text files

### Next
- use `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/README.md` as the entrypoint for design-system reference work
- keep future Figma variable exports under `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/figma-variable-audits/`

## 2026-06-22
### Task
- correct the button spacing primitive rule after user review
- update live Figma variables and written design-system docs
- save the rule for future token work

### Change
- confirmed native Figma account as `alexander.beck@mrm.com`
- audited the live AHA Design System WIP variable library before mutation
- found redundant `space/component/button/8`, `space/component/button/12`, and `space/component/button/16` primitives
- confirmed normal spacing primitives already cover those values:
  - `space/50` = 8
  - `space/75` = 12
  - `space/100` = 16
- rebound both Light mode and Dark mode values for:
  - `Components / buttons/padding-y/lg` to `space/75`
  - `Components / buttons/padding-y/sm` to `space/50`
  - `Components / buttons/padding-x/lg` to `space/100`
  - `Components / buttons/padding-x/sm` to `space/75`
  - `Components / buttons/icon-only/padding/lg` to `space/75`
  - `Components / buttons/icon-only/padding/sm` to `space/50`
  - `Components / buttons/social/padding-x/with-text` to `space/100`
- removed redundant `Primitives / space/component/button/8`, `12`, and `16`
- kept `Primitives / space/component/button/10`, `14`, and `18` as off-scale button anatomy exceptions
- marked `DEC-023` superseded and added `DEC-024`
- updated the token guide, handoff docs, lookup files, and variable audit script to prefer normal `space/*` primitives before component-specific button primitives

### Files
- `Figma: AHA - Design System [WIP]`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-current-token-table.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/index.html`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/README.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/scripts/figma-variables.mjs`
- `scripts/README.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- Use normal `Primitives / space/*` values first for future button spacing.
- Create `Primitives / space/component/button/*` only for approved off-scale button anatomy values.
- Keep public component-facing aliases in `Components / buttons/*`.

## 2026-06-22
### Task
- move design-system work completely out of the AHA brain repository
- create a standalone Projects-code folder for all AHA design-system material

### Change
- created `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/` as the external design-system workspace
- moved the design-system docs, JSON/CSV exports, variable export chunks, token-guide site, normalizer, and Figma variable audit script into that external folder
- removed the internal `reference/design-system/` folder from the AHA brain
- removed the internal `scripts/dev/figma-variables.mjs` script from the AHA brain
- added `npm run figma:variables` to `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/package.json`
- updated AHA brain lookup files to point at the external folder instead of owning the design-system material
- removed the stale `figma:variables` package script from the AHA brain

### Files
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/package.json`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/README.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/scripts/`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/`
- `package.json`
- `scripts/README.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/automation-inbox.md`
- `projects/aha-website-refresh/cleanup-candidates.md`
- `projects/aha-website-refresh/now.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- run token export and variable audit commands from `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens`
- use the AHA brain only as a pointer to this external design-system workspace

## 2026-06-22
### Task
- fix mixed button padding primitive mappings in the live Figma design system
- explain why the mixed mapping is wrong
- update written rules so the fix is not reversed

### Change
- confirmed native Figma account as `alexander.beck@mrm.com`
- audited the live AHA Design System WIP variable library before mutation
- found public button padding aliases mixing generic `Primitives / space/*` targets with exact `Primitives / space/component/button/*` targets
- created:
  - `Primitives / space/component/button/8`
  - `Primitives / space/component/button/12`
  - `Primitives / space/component/button/16`
- rebound both Light mode and Dark mode values for:
  - `Components / buttons/padding-y/lg` to `space/component/button/12`
  - `Components / buttons/padding-y/sm` to `space/component/button/8`
  - `Components / buttons/padding-x/lg` to `space/component/button/16`
  - `Components / buttons/padding-x/sm` to `space/component/button/12`
  - `Components / buttons/icon-only/padding/lg` to `space/component/button/12`
  - `Components / buttons/icon-only/padding/sm` to `space/component/button/8`
  - `Components / buttons/social/padding-x/with-text` to `space/component/button/16`
- left button gap aliases on generic `space/*` until a separate gap-specific decision is made
- marked `DEC-024` superseded and added `DEC-025`
- updated lookup files, token guide docs, and the variable audit script to use the button-specific primitive layer for button padding

### Files
- `Figma: AHA - Design System [WIP]`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-current-token-table.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/index.html`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/README.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/scripts/figma-variables.mjs`
- `scripts/README.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- live Figma validation reported 919 variables
- all six `space/component/button/{8,10,12,14,16,18}` primitives exist exactly once
- all public button padding aliases resolve through `Primitives / space/component/button/*`
- no duplicate variable names
- no unresolved aliases

### Next
- keep future button padding aliases on `Primitives / space/component/button/*`
- decide separately whether button gaps need a component-specific primitive layer

## 2026-06-22
### Task
- correct button spacing mappings to use standard primitive spacers
- remove the duplicate button-specific primitives created for on-scale values
- update docs and helper script to prevent the duplicate-primitive rule from returning

### Change
- confirmed native Figma account as `alexander.beck@mrm.com`
- audited the live AHA Design System WIP variable library before mutation
- confirmed `space/component/button/8`, `space/component/button/12`, and `space/component/button/16` were only referenced by the seven public component aliases from the previous pass
- rebound both Light mode and Dark mode values for:
  - `Components / buttons/padding-y/lg` to `space/75`
  - `Components / buttons/padding-y/sm` to `space/50`
  - `Components / buttons/padding-x/lg` to `space/100`
  - `Components / buttons/padding-x/sm` to `space/75`
  - `Components / buttons/icon-only/padding/lg` to `space/75`
  - `Components / buttons/icon-only/padding/sm` to `space/50`
  - `Components / buttons/social/padding-x/with-text` to `space/100`
- removed:
  - `Primitives / space/component/button/8`
  - `Primitives / space/component/button/12`
  - `Primitives / space/component/button/16`
- kept `Primitives / space/component/button/10`, `14`, and `18` because those values are not standard spacers
- marked `DEC-025` superseded and added `DEC-026`
- updated lookup files, token guide docs, and the variable audit script to prefer standard `space/*` primitives before component-specific button primitives

### Files
- `Figma: AHA - Design System [WIP]`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-current-token-table.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/index.html`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/README.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/scripts/figma-variables.mjs`
- `scripts/README.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- live Figma validation reported 916 variables
- `Primitives` returned to 495 variables
- `space/component/button/8`, `space/component/button/12`, and `space/component/button/16` no longer exist
- affected button padding aliases resolve through `Primitives / space/50`, `space/75`, and `space/100`
- no duplicate variable names
- no unresolved aliases
- no missing mode values

### Next
- keep on-scale button spacing aliases on standard `Primitives / space/*`
- create a component button primitive only when the value is not present in the standard spacing scale

## 2026-06-22
### Task
- remove the remaining component button spacing primitives
- use standard primitive spacers for all button spacing aliases

### Change
- confirmed native Figma account as `alexander.beck@mrm.com`
- remapped all remaining component button primitive references:
  - `space/component/button/10` to `space/75`
  - `space/component/button/14` to `space/100`
  - `space/component/button/18` to `space/125`
- removed:
  - `Primitives / space/component/button/10`
  - `Primitives / space/component/button/14`
  - `Primitives / space/component/button/18`
- confirmed no `Primitives / space/component/button/*` variables remain
- confirmed no variable aliases point to `Primitives / space/component/button/*`
- updated `DEC-026`, lookup files, token guide docs, and the variable audit script so component button spacing primitives are not recreated

### Files
- `Figma: AHA - Design System [WIP]`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-current-token-table.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-james-handoff-variable-structure.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/index.html`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/README.md`
- `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/scripts/figma-variables.mjs`
- `scripts/README.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `logs/decision-log.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- live Figma validation reported 913 variables
- `Primitives` now has 492 variables
- no `space/component/button/*` variables remain
- no aliases point to `space/component/button/*`
- no duplicate variable names
- no unresolved aliases
- no missing mode values

### Next
- keep button spacing aliases on standard `Primitives / space/*`
- do not create `Primitives / space/component/button/*`

## 2026-06-23
### Task
- run AHA Brain Daily Librarian pass
- verify whether any current-state reference drift crossed the maintenance bar
- keep this pass no-Figma and non-destructive

### Change
- verify `brain-maintenance` router and retrieval paths
- confirm `npm run verify:brain` passes
- confirm no Finder metadata files are present
- confirm the token-guide site, generated review manifests, and `output/playwright/criticalmass/` still resolve from current lookup files
- remove stale current-state references to absent `output/playwright/token-guide-component-policy-*.png`
- keep lookup, cleanup, inbox, and learning-rule files unchanged because no new durable artifact or resolved owner decision appeared
- refresh current-state memory for the `2026-06-23` pass

### Files
- `projects/aha-website-refresh/now.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- decide whether to promote `output/playwright/criticalmass/` into `reference/evidence/` or rewrite `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/design.md` to avoid scratch evidence
- keep proof-icon raster generation outside this no-Figma maintenance loop
- run any board-header sync only in an explicit Figma-enabled pass

## 2026-06-24
### Task
- run AHA Brain Daily Librarian pass
- verify whether any current-state or scratch-evidence drift crossed the maintenance bar
- keep this pass no-Figma and non-destructive

### Change
- verify `brain-maintenance` router and retrieval paths
- confirm `npm run verify:brain` passes
- confirm no Finder metadata files are present
- confirm the token-guide site, generated review manifests, the flat line icon review folder, `output/playwright/criticalmass/`, and `output/playwright/aha-token-system-guide-audit/` still resolve
- keep uncited `output/playwright/aha-token-system-guide-audit/` captures in scratch because no durable note cites them
- keep lookup, cleanup, inbox, and learning-rule files unchanged because no new durable artifact, broken reference, or resolved owner decision appeared
- refresh current-state memory for the `2026-06-24` pass

### Files
- `projects/aha-website-refresh/now.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- decide whether to promote `output/playwright/criticalmass/` into `reference/evidence/` or rewrite `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/design.md` to avoid scratch evidence
- keep proof-icon raster generation outside this no-Figma maintenance loop
- keep `output/playwright/aha-token-system-guide-audit/` in scratch unless a durable note starts citing it or the captures move to `reference/evidence/`

## 2026-06-24
### Task
- make the flat line icon bitmap candidate chunkier, closer to the supplied AHA example

### Change
- generated `aha-flat-clinical-line-12-sheet-v2.png`
- shifted the candidate toward dominant AHA-red strokes, heavier rounded outlines, simpler icon geometry, and pale blush circular fields
- kept the sheet as a bitmap review candidate, not a vector source or accepted replacement direction
- updated the candidate prompt, manifest, and lookup entries

### Files
- `design/generated/review/2026-06-23-flat-clinical-line/aha-flat-clinical-line-12-sheet-v2.png`
- `design/generated/review/2026-06-23-flat-clinical-line/manifest.md`
- `prompts/image-generation/flat-clinical-line-icon-sheet.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- visually reviewed generated bitmap sheet
- confirmed copied asset is a `1254 x 1254` PNG

### Next
- decide whether v2 should become the preferred flat-line review candidate or whether another pass should pull back the blush circles

## 2026-06-24
### Task
- remove the circular backgrounds from the chunky flat-line icon bitmap

### Change
- created `aha-flat-clinical-line-12-sheet-v3-no-backgrounds.png` from v2
- removed the pale blush circular fields by replacing background-tint pixels with white
- kept the chunky red icon linework and original sheet layout
- updated the candidate manifest and lookup entries

### Files
- `design/generated/review/2026-06-23-flat-clinical-line/aha-flat-clinical-line-12-sheet-v3-no-backgrounds.png`
- `design/generated/review/2026-06-23-flat-clinical-line/manifest.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- visually reviewed the no-background bitmap sheet
- confirmed the copied asset is a `1254 x 1254` PNG

### Next
- use `v3-no-backgrounds` as the current flat-line review pick unless the circular fields are needed again

## 2026-06-24
### Task
- combine the chunky no-background icon candidate with a second colour

### Change
- generated `aha-flat-clinical-line-12-sheet-v4-duo-colour.png`
- kept the chunky rounded bitmap line style and white sheet background
- added a controlled red-plus-purple stroke hierarchy so red carries AHA/action signals and purple carries secondary structure
- updated the candidate prompt, manifest, and lookup entries

### Files
- `design/generated/review/2026-06-23-flat-clinical-line/aha-flat-clinical-line-12-sheet-v4-duo-colour.png`
- `design/generated/review/2026-06-23-flat-clinical-line/manifest.md`
- `prompts/image-generation/flat-clinical-line-icon-sheet.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- visually reviewed generated bitmap sheet
- confirmed the copied asset is a `1254 x 1254` PNG

### Next
- review whether purple should be this dark or whether the second colour should shift closer to the existing AHA infographic purple

## 2026-06-24
### Task
- replace the purple second colour with warm grey in the chunky duo-line bitmap

### Change
- created `aha-flat-clinical-line-12-sheet-v5-warm-grey.png`
- recoloured purple support strokes from v4 to warm grey
- kept the chunky red signal strokes, white background, and 12-icon sheet layout
- updated the candidate prompt notes, manifest, and lookup entries

### Files
- `design/generated/review/2026-06-23-flat-clinical-line/aha-flat-clinical-line-12-sheet-v5-warm-grey.png`
- `design/generated/review/2026-06-23-flat-clinical-line/manifest.md`
- `prompts/image-generation/flat-clinical-line-icon-sheet.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- visually reviewed the warm-grey bitmap sheet
- confirmed the copied asset is a `1254 x 1254` PNG

### Next
- use `v5-warm-grey` as the current chunky two-colour review pick

## 2026-06-24
### Task
- create a large transparent one-colour topic icon sheet from the attached reference board

### Change
- generated a 54-topic chunky red line icon sheet using the attached board as topic and arrangement reference
- removed the chroma-key background and created true alpha
- sanitized all visible pixels to AHA red `#c8102e`
- created a large cutout-ready PNG at `8064 x 5376`
- recorded the cutout grid as `8` columns, `7` rows, `1008 x 768` cells
- added the reusable prompt, manifest, lookup entries, and session note

### Files
- `design/generated/review/2026-06-24-one-colour-topic-icons/aha-one-colour-topic-icons-v1-alpha-cutout-grid.png`
- `design/generated/review/2026-06-24-one-colour-topic-icons/manifest.md`
- `prompts/image-generation/one-colour-topic-icon-sheet.md`
- `prompts/image-generation/board-to-prompt-map.yaml`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- visually reviewed the final transparent bitmap sheet
- confirmed final file is `8064 x 5376` `RGBA`
- confirmed transparent corner alpha values are all `0`
- confirmed visible pixels are all AHA red and no green fringe remains
- confirmed exact cutout cells are `1008 x 768`

### Next
- use `aha-one-colour-topic-icons-v1-alpha-cutout-grid.png` for same-size cutout review

## 2026-06-24
### Task
- recreate the one-colour topic icon sheet with cleaner chunky line spacing, no white fills, and separate transparent cutouts

### Change
- generated `aha-one-colour-topic-icons-v2-chromakey.png` from the cleaner chunky line prompt
- removed the green key and all generated white/off-white fills
- sanitized every visible pixel to AHA red `#c8102e`
- created the final transparent review sheet `aha-one-colour-topic-icons-v2-alpha-cutout-grid.png`
- created `cutouts-v2/` with 54 same-size transparent PNGs at `1008 x 768`
- used component-aware cutout extraction so adjacent row fragments do not appear in individual icon files
- updated the reusable prompt, manifest, artifact index, and lookup file

### Files
- `design/generated/review/2026-06-24-one-colour-topic-icons/aha-one-colour-topic-icons-v2-alpha-cutout-grid.png`
- `design/generated/review/2026-06-24-one-colour-topic-icons/cutouts-v2/`
- `design/generated/review/2026-06-24-one-colour-topic-icons/aha-one-colour-topic-icons-v2-chromakey.png`
- `design/generated/review/2026-06-24-one-colour-topic-icons/manifest.md`
- `prompts/image-generation/one-colour-topic-icon-sheet.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- visually reviewed the full `v2` transparent bitmap sheet
- visually checked the emergency siren and pills/capsules cutouts against the reported collision issues
- confirmed final sheet is `8064 x 5376` `RGBA`
- confirmed sheet corner alpha values are all `0`
- confirmed the sheet has `0` non-red visible pixels, `0` visible white pixels, and `0` visible green pixels
- confirmed fully transparent pixels use white RGB with alpha `0`
- confirmed `cutouts-v2/` contains `54` PNGs, each `1008 x 768`, with transparent corners and no non-red, white, or green visible pixels

### Next
- use `aha-one-colour-topic-icons-v2-alpha-cutout-grid.png` and `cutouts-v2/` as the current one-colour topic icon review outputs

## 2026-06-25
### Task
- run AHA Brain Daily Librarian pass
- verify whether any verifier-safe maintenance drift crossed the bar
- keep this pass no-Figma and non-destructive

### Change
- verify `brain-maintenance` router and retrieval paths
- remove `design/generated/review/.DS_Store` so `npm run verify:brain` returns green again
- confirm follow-up `npm run verify:brain` passes
- confirm no Finder metadata files remain
- confirm the token-guide site, generated review manifests, the flat line icon review folder, the one-colour topic icon review folder, `output/playwright/criticalmass/`, and `output/playwright/aha-token-system-guide-audit/` still resolve
- keep uncited `output/playwright/aha-token-system-guide-audit/` captures in scratch because no durable note cites them
- keep lookup, cleanup, inbox, and learning-rule files unchanged because no new durable artifact, broken reference, or resolved owner decision appeared
- refresh current-state memory for the `2026-06-25` pass

### Files
- `design/generated/review/.DS_Store`
- `projects/aha-website-refresh/now.md`
- `projects/aha-website-refresh/session-log.md`

### Next
- decide whether to promote `output/playwright/criticalmass/` into `reference/evidence/` or rewrite `/Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/design.md` to avoid scratch evidence
- keep `output/playwright/aha-token-system-guide-audit/` in scratch unless a durable note starts citing it or the captures move to `reference/evidence/`
- keep proof-icon raster generation outside this no-Figma maintenance loop

## 2026-06-25
### Task
- implement conservative AHA Design Brain organization cleanup

### Change
- rename the daily stewardship contract to `brain/daily-stewardship-loop.md`
- add `repo-housekeeping` as the rare route for parent-level cleanup across root docs, ignore rules, package scripts, verifier policy, and lookup files
- align `.gitignore`, `npm run clean`, and `scripts/docs/verify-design-brain.mjs` around the same disposable roots
- keep `design/generated/` as the curated generated-asset home
- keep one-colour icon processing files in the manifest, but remove chromakey/raw intermediates from durable artifact-index support lists
- update lookup, cleanup, inbox, and current-state files for the new policy
- avoid Figma, commits, and destructive clean commands

### Files
- `.gitignore`
- `package.json`
- `README.md`
- `brain/daily-stewardship-loop.md`
- `brain/router.yaml`
- `scripts/docs/verify-design-brain.mjs`
- `projects/aha-website-refresh/retrieval-index.yaml`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/cleanup-candidates.md`
- `projects/aha-website-refresh/automation-inbox.md`
- `projects/aha-website-refresh/now.md`
- `design/generated/review/2026-06-24-one-colour-topic-icons/manifest.md`

### Validation
- `npm run verify:brain` passed after the route, rename, and disposable-root policy updates
- active lookup files no longer point to the old hourly maintenance filename
- `.playwright-mcp/` is now ignored and covered by `npm run clean`

### Next
- keep `output/playwright/criticalmass/` open until its external token-guide citation is moved to durable evidence or rewritten
- run `npm run clean` only after useful generated or captured work has been promoted

## 2026-06-25
### Task
- add lightweight accessible Ken Burns slideshow reference component

### Change
- add a self-contained React and CSS Modules component under `reference/components/`
- use oversized slide layers, clamped motion, two-layer crossfade, reduced-motion handling, and separate user/system pause state
- add handover notes for usage, overscan behavior, accessibility defaults, and consumer-app integration
- keep root package dependencies unchanged because this repo has no React app build target

### Files
- `reference/components/KenBurnsSlideshow/`
- `projects/aha-website-refresh/session-log.md`

### Next
- copy the component into the consuming React app before production use
- run that app's typecheck, lint, tests, build, and browser QA once the component is wired into a real page

## 2026-06-26
### Task
- add AHA living gradient playground prototype
- use linked Figma node as layout reference only
- keep the prototype repo-local and no-Figma-write

### Change
- add static `index.html`, `styles.css`, and `script.js` prototype under `reference/evidence/prototypes/`
- implement one `.living-gradient` class with `data-mode="sinus"`, `data-mode="ember"`, and `data-mode="sweep"`
- add controls for mode, rhythm, colour, movement, surface toggles, reduced motion, contrast-safe mode, pause, and CSS export
- use a neutral replaceable logo mask instead of recreating a protected AHA mark
- keep small-surface warmth lower than the large background so red remains dominant
- add the prototype to artifact lookup files
- remove Finder `.DS_Store` metadata files that blocked brain verification

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`
- `design/generated/review/.DS_Store`
- `design/generated/review/2026-06-24-one-colour-topic-icons/.DS_Store`
- `design/generated/review/2026-06-24-one-colour-topic-icons/cutouts-v2/.DS_Store`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- Playwright desktop and mobile flow passed for mode switching, sliders, surface toggles, pause, reduced motion, contrast-safe mode, CSS export, no console errors, no horizontal overflow, and mobile card-label clearance
- visual QA compared the Figma reference screenshot with desktop and mobile browser screenshots in `output/playwright/aha-living-gradient-playground/`

### Next
- use `http://localhost:4173/reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/` while the local server is running
- decide separately if this local prototype should be recreated or linked back into Figma

## 2026-06-26
### Task
- rebuild the AHA living gradient playground motion system to avoid hard edges and static-gradient overlays

### Change
- replace `sinus`, `ember`, and `sweep` with soft-field modes: `breath`, `current`, `pulse`, `orbit`, and `undertow`
- assemble each `.living-gradient` from injected moving red, deep-red, warm, and veil fields instead of a static linear-gradient base
- keep orange intermittent and red-dominant, with all visible field layers moving in each mode
- move the prototype font stack to LubDub first and reduce heavy UI text weights
- update artifact lookup notes for the new mode API

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- Playwright desktop and mobile flow passed for all five modes, slider CSS updates, surface toggles, pause, reduced motion, contrast-safe mode, Copy CSS, no console errors, no horizontal overflow, and background-surface field coverage
- browser QA confirmed `.background-surface` has no static `background-image`, covers the panel, and uses five animated radial fields
- `npm run verify:brain` passed
- `git diff --check` passed

### Next
- review the motion feel in-browser and tune individual mode timings if a specific rhythm becomes the preferred direction

## 2026-06-26
### Task
- action the prepared plans for stronger living-gradient modes and durable Parameterizer controls

### Change
- add `sweepfield` as a soft CSS-field interpretation of the animated gradient sweep reference
- add `meshflow` as a slowed, blurred, CSS-only interpretation of the smitpatelx / Stripe-style shader reference
- keep all live gradient colour fields limited to AHA orange, AHA red, and deep red
- keep live gradient surfaces built from moving blurred fields, with flat red only as pre-JS, disabled-surface, or reduced-motion fallback
- replace the ad hoc control markup with a single `controlSchema` in the prototype script
- add broader parameter ranges and effect-shape controls for duration, warmth, red/deep balance, drift, bloom origin, field size, sweep travel, mesh bend, mesh blur, deep drift, and surface blend
- add Copy Config and reload persistence alongside Copy CSS
- restyle the right panel into a compact fixed-width Parameterizer tool palette with stable row geometry
- update lookup files with the current seven-mode API and control-source path

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `find design/generated/review -name .DS_Store -delete` completed
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- Playwright desktop and mobile pass confirmed seven modes, generated controls, expanded ranges, live CSS variable updates, reload persistence, Copy Config, reset, no console errors, no horizontal overflow, fixed panel geometry, and mobile row geometry
- Playwright pixel check on the `meshflow` background found no white, visible orange, and no hard-edge colour jump in the gradient area
- `npm run verify:brain` passed
- `git diff --check` passed

### Next
- review `sweepfield` and `meshflow` in the browser at real speed and decide which mode should become the preferred default

## 2026-06-26
### Task
- add an Alex Harri-inspired WebGL gradient-map mode without adding WebGL

### Change
- add `mapflow` / Gradient Map Flow as an eighth `.living-gradient` mode
- interpret the article's dynamic JavaScript gradient-map idea as a JS-authored AHA colour ramp exposed through `--lg-map-gradient`
- keep the implementation CSS-only and performance-focused by animating oversized blurred fields with transforms and opacity
- use only AHA orange, AHA red, and deep red in the animated gradient fields
- include `--lg-map-opacity` and `--lg-map-gradient` in Copy CSS exports for the selected mode
- update artifact lookup files with the current eight-mode API

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- Playwright confirmed `mapflow` appears in the mode selector, applies `52s` duration, animates `lg-map-a` and `lg-map-b`, exports `--lg-map-gradient`, persists through reload, and has no console errors or horizontal overflow
- Playwright pixel check on the `mapflow` background found no white, visible orange, and no hard-edge colour jump in the sampled gradient area

### Next
- compare `mapflow` against `meshflow` at real speed and decide whether the generated gradient-map direction is worth keeping as a preferred exploration path

## 2026-06-26
### Task
- continue the living-gradient playground after the multi-agent audit

### Change
- add `cloudmesh` / Radial Cloud Mesh as a ninth `.living-gradient` mode based on a slowed, blurred CSS radial mesh effect
- move the desktop composition closer to the linked Figma node with the 511px right rail, 16px preview inset, 8px preview gaps, rounded preview panels, and lighter UI type
- replace the placeholder/text logo treatment with local Figma-exported logo assets for the MRM header mark, AHA header mark, and logo preview SVG
- replace the static logo preview image with local SVG clipping masks so the `.living-gradient` field animates inside the large and small AHA marks
- bump the saved settings key and config schema to `v6` so richer defaults replace stale washed-out browser values
- strengthen the authored defaults toward the Figma gradient: stronger AHA red, more deep-red pull, brighter/saturated output, and a clearer orange warmth window
- quiet the Parameterizer rail so it keeps functional controls without visually overpowering the Figma-style prototype composition
- animate the visible red-alt and veil layers in newer modes so `sweepfield`, `meshflow`, `mapflow`, and `cloudmesh` do not leave soft fields sitting still behind animated layers
- expand Copy CSS output to include derived runtime variables used by the field system, including field scale/size, warm/deep/red opacity, drift vectors, mesh scale/tilt, and map gradient values
- update artifact lookup notes with the current nine-mode API

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/assets/logo-mrm.svg`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/assets/logo-aha-header.png`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/assets/logo-preview.svg`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/assets/aha-logo-mask-large.svg`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/assets/aha-logo-mask-small.svg`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `find design/generated/review -name .DS_Store -delete` completed
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- Playwright confirmed the Figma-sized desktop layout uses a 511px rail, 16px preview inset, 8px preview gaps, 20px panel radii, no horizontal overflow, no console errors, and mobile renders without horizontal overflow
- Playwright confirmed local logo assets load, the MRM header mark renders at 64x21, the AHA header mark renders at 69x45, and the Figma preview SVG fills the logo preview panel
- Playwright confirmed the AHA preview marks are masked `.living-gradient` surfaces with injected moving fields, not flat static SVG fills
- Playwright confirmed v6 defaults load with richer red, deeper pull, higher saturation, no white leakage, no console errors, and no desktop/mobile horizontal overflow
- Playwright confirmed newer modes animate their visible red-alt and veil layers, and Copy CSS includes derived field variables for `cloudmesh`
- inset pixel sampling on the `cloudmesh` background found no white leakage, visible orange warmth, and no hard-edge jump inside the gradient field

### Next
- compare the Figma-matched desktop layout and `cloudmesh` orange visibility in the browser before deciding whether to keep the light Parameterizer rail treatment

## 2026-06-26
### Task
- action the AHA gradient punch and logo-fill plan

### Change
- bump saved settings and config schema to `v7` so older washed-out browser settings do not override the authored look
- strengthen the default AHA red, deep-red pull, orange warmth event, brightness, saturation, field spread, and surface blend values
- tune the clipped logo previews with logo-specific blur, field sizing, and field placement so the moving gradient remains visible inside the AHA marks
- keep the header logos static for Figma fidelity while the preview logos stay masked `.living-gradient` surfaces

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/session-log.md`

### Validation
- Browser QA confirmed v7 defaults render with `--lg-orange-intensity: 0.74`, `--lg-red-dominance: 0.98`, `--lg-deep-strength: 0.90`, `--lg-brightness: 1.08`, and `--lg-saturation: 1.24`
- Browser QA confirmed the large and small logo previews use local SVG masks, contain 15 injected gradient fields, and animate visible fields inside the clipped AHA marks
- Browser interaction QA confirmed mode switching to `cloudmesh` updates the selected mode, animates `lg-cloud-b` inside the logo mask, and updates Copy CSS for the selected mode
- Browser mobile smoke check at `390 x 844` found no horizontal overflow and confirmed the masked logo still contains the moving field system
- `find design/generated/review -name .DS_Store -delete` completed
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed

### Next
- review the v7 default state in the browser and decide whether this punch level should become the preferred baseline

## 2026-06-26
### Task
- compare every living-gradient mode against the original gradient colour reference and adjust the modes to keep the same colour vibe

### Change
- use the supplied CleanShot reference image as the colour target for the background preview
- capture actual browser screenshots for every mode and crop the `.background-surface` panel for comparison
- bump saved settings and config schema to `v8` so the browser loads the current colour baseline instead of older v7 values
- lower default brightness/saturation from the punch pass to better match the reference image instead of over-saturating the red
- add moving background-only red and deep-red anchor fields so every mode keeps the center-red and lower-depth structure
- add a moving warm-corner veil above the background anchors so the orange remains present without washing the whole surface
- keep the colour adjustment CSS-only, built from moving soft fields and pseudo-elements rather than a static gradient overlay

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/session-log.md`
- `output/playwright/aha-living-gradient-playground/mode-colour-comparison-final2-full/`
- `output/playwright/aha-living-gradient-playground/mode-colour-comparison-final2-crops/`

### Validation
- Browser screenshots captured all nine modes at `1440 x 924` and cropped the background preview from the measured `.background-surface` rect
- final comparison sheet: `output/playwright/aha-living-gradient-playground/mode-colour-comparison-final2-crops/contact-sheet.png`
- final comparison stats: `output/playwright/aha-living-gradient-playground/mode-colour-comparison-final2-crops/stats.json`
- Browser console check reported no warnings or errors during the capture pass
- `find design/generated/review -name .DS_Store -delete` completed
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed

### Next
- review the final contact sheet and decide whether the quieter modes should receive a stronger orange event at a different sampled phase

## 2026-06-26
### Task
- give each living-gradient effect its own bespoke parameter set and make the effect overview selectable through stacked cards

### Change
- bump saved settings and config schema to `v9`
- replace the dropdown mode selector with a selectable card overview that stacks effects vertically and scrolls them horizontally in the desktop rail
- move parameter generation from one flat global schema to per-mode profiles so each effect exposes a tailored set of motion, colour, depth, and softness controls
- keep shared surface toggles, reduced-motion, contrast-safe mode, pause, Copy CSS, Copy Config, and reset controls
- update lookup notes so the durable artifact points to the mode-profile parameter system

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- Browser QA confirmed the prototype loads at the expected localhost route with no console warnings or errors
- Browser QA confirmed the effect overview renders 9 selectable cards, with desktop cards arranged as vertical stacks that can scroll horizontally inside the rail
- Browser interaction QA confirmed selecting `cloudmesh` and `current` changes the active card, readout, `data-mode`, default cycle duration, and visible parameter set
- Browser interaction QA confirmed changing the `current` drift slider updates `--lg-drift-distance` and the Copy CSS export
- Browser responsive QA confirmed no horizontal overflow on desktop or `390 x 844` mobile, with mobile cards collapsing to a single readable vertical stack
- Browser state was reset to the authored `breath` default after QA
- `find design/generated/review -name .DS_Store -delete` completed
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed

### Next
- decide whether any single mode should receive an additional bespoke-only parameter after hands-on review

## 2026-06-26
### Task
- action the living-gradient consolidation and pipeline cleanup plan

### Change
- consolidate the public mode API from nine effects to five: `breath`, `current`, `pulse`, `undertow`, and `cloudmesh`
- remove `orbit`, `sweepfield`, `meshflow`, and `mapflow` from the card selector, mode profiles, CSS selectors, extra fields, and keyframes
- bump saved settings and config schema to `v10` so older browser storage does not restore removed modes
- replace always-injected field layers with mode-aware field injection: standard modes use five soft fields, while `cloudmesh` adds four cloud fields
- remove old unused control-system CSS, placeholder logo-mask styles, unused mode variables, dead select-control JS, and unreferenced animation blocks
- wire the `cloudmesh` field-bend parameter into cloud field keyframes so the bespoke control has a visible effect
- update artifact lookup notes and cleanup candidates to reflect the five-mode current artifact and superseded screenshot sets

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/cleanup-candidates.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- Browser QA confirmed the prototype loads at the expected localhost route with no console warnings or page errors
- Browser QA confirmed the effect overview now renders five selectable cards only: `breath`, `current`, `pulse`, `undertow`, and `cloudmesh`
- Browser QA confirmed the default state is `breath` with a `16s` cycle and five injected soft field layers on each `.living-gradient` surface
- Browser interaction QA confirmed `cloudmesh` switches every surface to nine injected fields, exposes its bespoke `meshBlur` and `meshTension` controls, and exports the selected mode plus mesh custom properties through Copy CSS
- Browser interaction QA confirmed switching from `cloudmesh` back to `current` removes the cloud-only fields and restores the five-field base system
- Browser responsive QA confirmed no horizontal overflow on desktop or `390 x 844` mobile
- Screenshot evidence saved to `output/playwright/aha-living-gradient-playground/consolidation-v10/`
- `find design/generated/review -name .DS_Store -delete` completed
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed

### Next
- review the five-mode set in-browser and decide whether one should become the named preferred direction

## 2026-06-26
### Task
- fix the faint button preview and clipped AHA logo mask in the living-gradient playground

### Change
- add surface-specific `.donate-button.living-gradient` overrides after the generic `.living-gradient` rule so the button keeps its intended tighter local blur instead of inheriting the global field blur
- strengthen the button preview with explicit red, warm, deep, and field-position settings while keeping the moving field effect
- add a matching `.donation-card.living-gradient` override so card-local blur settings are not accidentally overwritten by the generic gradient rule
- expand both AHA logo mask SVG viewBoxes so the left side of the mark is no longer clipped by the mask viewport

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/assets/aha-logo-mask-large.svg`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/assets/aha-logo-mask-small.svg`
- `projects/aha-website-refresh/session-log.md`

### Validation
- Browser/Playwright QA confirmed the button now computes `--lg-local-blur: 14px` instead of inheriting the global `62px` field blur
- Browser/Playwright screenshots confirmed the button is visibly stronger and both logo previews render without side clipping
- Browser/Playwright QA found no console warnings or errors and no horizontal overflow at desktop or `390 x 844` mobile

### Next
- review whether the stronger button should be pushed further toward the card/background saturation level

## 2026-06-27
### Task
- make every living-gradient effect more pronounced without adding hard edges

### Change
- bump saved settings and config schema to `v12` so the browser loads the new authored contrast baseline instead of older local slider values
- increase the default red coverage, deep pressure, brightness, and saturation while lowering the default field scale and soft falloff
- tighten the derived field-size, field-scale, and blur formulas so the colour masses are smaller and the gradients do not flatten into one broad wash
- tune the background preview with a stronger deep-red lower field and a smaller off-axis warm field so the red-led gradient has more contrast while orange remains intermittent
- keep the implementation CSS-driven with moving soft fields only; no hard bands, canvas, WebGL, or static visible gradient overlay added
- update the artifact index note to the current `v12` schema/storage baseline

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/session-log.md`

### Validation
- Browser QA confirmed the in-app route loads with five effect cards, no console warnings or errors, and no horizontal overflow
- Browser QA confirmed the new defaults compute `--lg-field-size: 174%`, `--lg-field-blur: 36px`, and `--lg-saturation: 1.24`
- Playwright QA captured all five modes and confirmed each mode activates correctly with no console warnings or horizontal overflow
- Background crop sampling improved the softer modes from roughly `15-19` luminance range to `26-29`, while `cloudmesh` reached `47`
- Mobile QA at `390 x 844` confirmed five cards, no horizontal overflow, and the same tighter `174%` field-size baseline

### Next
- review the v12 contrast baseline in motion and decide whether the orange event should be sampled at a stronger phase for the default screenshot state

## 2026-06-27
### Task
- add a deliberate tri-colour reveal moment to every current living-gradient mode

### Change
- bump saved settings and config schema to `v13`
- add `Reveal strength`, `Reveal window`, and `Reveal phase` controls to each mode profile
- derive and export reveal variables for warm and deep field peaks so Copy CSS and Copy Config include the new reveal state
- update all five mode keyframes so red, orange, and deep red become visible together during the authored reveal point, then return to a red-led rest state
- tune background, button, card, and logo surfaces so the reveal is clearest on the background and tighter on smaller UI surfaces
- update reduced-motion stills so the composition stays calm and readable while still showing a red-led field mix

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/session-log.md`

### Validation
- Browser QA at `http://127.0.0.1:4173/reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/` confirmed all five modes render and expose the reveal controls
- Playwright captured representative reveal samples for `breath`, `current`, `pulse`, `undertow`, and `cloudmesh` in `output/playwright/aha-living-gradient-playground/tri-colour-reveal-v13-balanced/`
- Playwright confirmed Copy CSS includes `--lg-reveal-strength`, `--lg-reveal-window`, `--lg-reveal-phase`, `--lg-warm-reveal-opacity`, and `--lg-deep-reveal-opacity`
- Playwright confirmed the large logo masks still contain moving gradient fields, button/card text stays readable, no console errors were reported, and desktop/mobile have no horizontal overflow
- Playwright confirmed pause freezes the tested warm/background layers and reduced-motion removes animation
- `find design/generated/review -name .DS_Store -delete` completed
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed

### Next
- compare sampled reveal screenshots against the original red/orange/deep reference and adjust per-mode peaks if any reveal feels too flat

## 2026-06-27
### Task
- add practical controls for faster, more dynamic living-gradient motion across every current effect

### Change
- bump saved settings and config schema to `v14`
- add a shared `Motion System` control group above the mode-specific controls
- add `Motion speed`, `Motion energy`, and `Colour field size` controls that apply to every mode
- map motion speed into the effective `--lg-duration` so all layer animations can be sped up or slowed down together
- map motion energy into drift vectors and mesh movement so the effects can become more active without adding hard edges
- map colour field size into the field sizing and blur formula so the user can make the gradient colours feel closer/tighter or broader/softer
- include the new motion variables in Copy CSS and Copy Config

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/session-log.md`

### Validation
- Browser QA confirmed `Motion System` appears above the mode-specific controls for all five modes
- Browser QA confirmed default `Motion speed` changes the authored `16s` breath cycle to computed `--lg-duration: 11.03s`
- Browser QA confirmed boosted settings update the live CSS variables: `Motion speed 2.40x` sets `--lg-duration: 6.67s`, `Motion energy 2.10x` raises drift to `36%`, and `Colour field size 0.52` compresses the fields to `92%`
- Browser QA confirmed Copy CSS includes `--lg-motion-speed`, `--lg-motion-energy`, `--lg-effect-size`, and `--lg-authored-duration`
- Browser QA confirmed Copy Config uses schema `aha-living-gradient-playground/v14` and includes the new motion-system state values
- Playwright captured desktop and mobile screenshots in `output/playwright/aha-living-gradient-playground/motion-system-v14/`
- Browser QA reported no console errors and no desktop/mobile horizontal overflow

### Next
- tune the default `Motion speed`, `Motion energy`, and `Colour field size` values in browser if the new baseline feels too active or still too calm

## 2026-06-27
### Task
- rebuild the living-gradient simulations with sharper CSS field tuning and two real shader-based modes

### Change
- bump saved settings and config schema to `v15`
- remove `undertow` from the selectable mode API and fold the deep-pull behavior into the remaining CSS modes
- keep CSS soft-field modes `breath`, `current`, `pulse`, and `cloudmesh`, with tighter default field scale, lower blur, stronger orange reveal, and less full-opacity red coverage
- add native no-dependency WebGL modes `shaderflow` and `softplasma`
- add shader-specific controls for speed, turbulence, warp strength, colour closeness, warm event, deep pull, shader blur, and render scale
- render shader modes through one lightweight canvas per active surface, with device pixel ratio capped at `1` and default render scale `0.65`
- pause shader rendering when paused, reduced-motion, page-hidden, or not in a shader mode
- add graceful shader fallback to `cloudmesh` when WebGL is unavailable
- update Copy CSS and Copy Config so shader variables and the v15 schema are exported

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed after shader edits
- Headed Chromium QA confirmed six selectable modes: `breath`, `current`, `pulse`, `cloudmesh`, `shaderflow`, and `softplasma`
- Headed Chromium QA confirmed shader modes create one `.lg-shader-canvas` on the background surface and no `.lg-field` layers
- Headed Chromium QA confirmed no console errors while switching through all six modes
- Headed Chromium QA confirmed pause freezes the shader canvas, reduced-motion removes shader canvases and uses a calm static AHA-colour fallback, Copy CSS includes shader variables and a WebGL renderer note, and `Shader speed` live-applies to `--lg-shader-speed`
- Mobile QA at `390 x 844` confirmed no horizontal overflow
- Headless Chromium reported WebGL unavailable in this environment; fallback to `cloudmesh` was confirmed

### Next
- review the published shader modes in a normal browser and tune `Warm event`, `Deep pull`, and `Colour closeness` if the client wants stronger or calmer reveal moments

## 2026-06-29
### Task
- refine the living-gradient playground so orange behaves like a gentle top-right light source instead of a visible circular blob

### Change
- bump saved settings and config schema to `v16`
- retune `breath`, `current`, `pulse`, and `cloudmesh` with slower warm-light ramps, broader blur/falloff, and top-right-biased orange fields
- add `Shader rotation` to shader mode controls and exports, correct the shader coordinate anchors, mute the middle red, and keep the light area in the top-right baseline
- brighten and rebalance `softplasma` so it keeps more light while keeping orange sparse
- add `heartlight` / Heartlight Beam and `emberveil` / Ember Veil as restrained red/deep-red/orange exploration modes
- update the artifact index and quick map to the eight-mode `v16` API

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- Playwright confirmed eight modes: `breath`, `current`, `pulse`, `cloudmesh`, `shaderflow`, `softplasma`, `heartlight`, and `emberveil`
- Playwright captured desktop screenshots for all eight modes and a mobile screenshot in `output/playwright/aha-living-gradient-playground/v16-refinement-final/`
- Playwright confirmed no console warnings or errors, no mobile horizontal overflow, Copy Config schema `aha-living-gradient-playground/v16`, Copy CSS includes `--lg-shader-rotation`, pause applies to shader mode, and reduced motion removes shader canvases
- `npm run verify:brain` passed
- `git diff --check` passed

### Next
- review the v16 screenshots in motion and tune individual defaults if the orange should be even more restrained in the logo mask

## 2026-06-29
### Task
- add explicit save-and-reload persistence to the living-gradient playground Parameterizer panel

### Change
- add a `Save Settings` action to the right-panel action row
- keep parameter edits live-applied immediately while removing implicit save-on-render
- save the current normalized state to the existing `aha-living-gradient-playground:v16` browser-storage key only when `Save Settings` is clicked
- load saved settings automatically on next reload through the existing `loadSavedState()` path
- keep Reset clearing browser storage and returning to authored defaults
- update lookup notes with the explicit Save Settings reload path

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- Playwright confirmed changing `Motion speed` live-applies immediately and changes `--lg-duration`
- Playwright confirmed unsaved parameter changes do not survive reload
- Playwright confirmed clicking `Save Settings` writes `aha-living-gradient-playground:v16` and reload restores the saved value automatically
- Playwright confirmed Reset clears browser storage and reload returns to authored defaults
- Playwright confirmed the fixed panel shell remains `511px` wide with a `46px` header, `26px` desktop rows, four equal action buttons, no desktop horizontal overflow, no mobile horizontal overflow, and `32px` mobile rows
- screenshots saved to `output/playwright/aha-living-gradient-playground/save-settings-v16/`
- `npm run verify:brain` passed
- `git diff --check` passed

### Next
- use `Save Settings` after tuning if the current right-panel state should become the next reload baseline in that browser

## 2026-06-29
### Task
- make the living-gradient Parameterizer panel show only controls that affect the selected effect

### Change
- make shared Motion System controls mode-aware so shader modes no longer show CSS-only `Motion speed`
- remove CSS-only timing/P3 controls from `shaderflow` and `softplasma`
- expand CSS mode profiles with the warm-field geometry controls that already influence those effects
- keep cloud-only mesh controls scoped to `cloudmesh`
- wire shader-visible controls into WebGL math so `Motion energy`, `Colour field size`, `Warp strength`, `Colour closeness`, and `Reveal strength` all visibly affect shader modes
- update lookup notes with the active-control contract

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- Playwright confirmed all eight modes render only their intended active controls: CSS modes keep CSS timing/field controls, `cloudmesh` alone shows mesh controls, and shader modes hide CSS-only timing, P3, and mesh controls
- Playwright confirmed `Bloom X` live-applies in `breath` and `Motion energy` live-applies in `shaderflow`
- Playwright confirmed no console warnings or errors and no desktop/mobile horizontal overflow
- `npm run verify:brain` passed
- `git diff --check` passed

## 2026-06-29
### Task
- add MP4 loop export for the living-gradient playground

### Change
- add an `Export MP4` action to the Parameterizer action row
- calculate the export loop length from the active mode and current motion speed or shader speed
- render a deterministic 1080px square canvas loop from the current parameter state so the first and last frames align cleanly
- prefer browser-native MP4 MediaRecorder encoders and show a clear unsupported-browser status when MP4 recording is unavailable
- keep the export path no-dependency and static-prototype friendly
- update lookup notes with the MP4 export behavior

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- Playwright confirmed `Export MP4` appears in the Parameterizer action row
- Playwright confirmed export loop plans vary by active mode: `breath` generated a `10.91s` plan, `cloudmesh` generated a `21.82s` plan, and `shaderflow` at `2.00x` shader speed generated an `8.00s` plan
- Playwright confirmed the export status updates and an MP4 download completes as `aha-living-gradient-shaderflow-8.00s-loop.mp4`
- file inspection confirmed the downloaded test export is an ISO MP4 container
- Playwright confirmed no console warnings or errors and no desktop/mobile horizontal overflow
- `npm run verify:brain` passed
- `git diff --check` passed

## 2026-06-29
### Task
- restore richer colour in the living-gradient playground after the v16 gentle-light pass became too washed out

### Change
- bump authored config and browser-storage schema from `v16` to `v17` so older saved soft settings do not auto-load
- tighten the default warm-field size and blur so red, deep red, and orange remain distinct colour masses
- raise baseline saturation, brightness, red dominance, and deep-red strength
- keep orange sparse and top-right biased, but make the warm reveal brighter than the v16 baseline
- align CSS fallback values, generated CSS/config exports, and P3 warm-field rendering with the new richer baseline
- update artifact lookup notes with the current `v17` baseline

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- Playwright confirmed authored defaults compute `--lg-field-size: 103%`, `--lg-field-blur: 26px`, `--lg-saturation: 1.24`, `--lg-brightness: 1.10`, `--lg-warm-ambient: 0.049`, `--lg-warm-reveal-opacity: 0.769`, and `--lg-shader-blur: 6px`
- Playwright confirmed Copy Config includes schema `aha-living-gradient-playground/v17`
- Playwright confirmed Save Settings writes `aha-living-gradient-playground:v17`, reload restores the saved value, and Reset clears storage back to authored defaults
- Playwright confirmed no console warnings or errors and no desktop/mobile horizontal overflow
- screenshots saved to `output/playwright/aha-living-gradient-playground/v17-richer-colour/`

## 2026-06-29
### Task
- make the repo root work as a GitHub Pages site for the current living-gradient prototype

### Change
- add a root `index.html` that sends the GitHub Pages root to the current living-gradient playground
- add `.nojekyll` so static prototype folders and assets are served directly
- add a GitHub Actions Pages workflow that deploys the static repo from `main`

### Files
- `index.html`
- `.nojekyll`
- `.github/workflows/deploy-pages.yml`
- `projects/aha-website-refresh/session-log.md`

### Validation
- root `index.html` served locally at `http://127.0.0.1:4173/`
- Playwright confirmed the root opens `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/` and renders the living-gradient prototype
- commit `47f3ab2` pushed to `main` with the Pages entrypoint, workflow, and current prototype files
- pushed `main` to `gh-pages` as a branch-source fallback
- GitHub Pages API rejected site creation with `422`: `Your current plan does not support GitHub Pages for this repository.`
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed

## 2026-06-29
### Task
- simplify the living-gradient playground around the best-performing breathing direction

### Change
- reduce the mode API to three modes: `breath`, `heartlight`, and `shaderflow`
- keep Breath Field as the default and closest current direction
- keep Light Breath as a simpler shadow/light CSS variant
- keep Shader Flow as the retained procedural shader option
- bump saved settings and config schema to `v18` so older saved states with removed modes do not reload
- simplify the visible parameters per mode so the right panel focuses on breath timing, top-right light, orange/deep pressure, softness, colour trim, and essential shader controls
- change the shader fallback from removed `cloudmesh` to `breath`
- update lookup notes to the three-mode contract

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- Playwright confirmed the effect overview exposes only `breath`, `heartlight`, and `shaderflow`
- Playwright confirmed clean reload defaults to Breath Field with no saved storage keys
- Playwright confirmed Copy Config exports schema `aha-living-gradient-playground/v18`
- Playwright confirmed Shader Flow still renders WebGL canvases and shows only the reduced shader control set
- Playwright confirmed no console warnings or errors and no desktop/mobile horizontal overflow
- screenshots saved to `output/playwright/aha-living-gradient-playground/v18-simplified-breath/`

## 2026-06-29
### Task
- remove washed-out colour behavior from the simplified living-gradient playground

### Change
- bump saved settings and config schema to `v19` so older saved v18 brightness/colour states do not reload
- remove default brightness lift and increase saturation without adding lightened colour stops
- restrict CSS gradient field stops to the three intended colours: red, deep red, and orange
- remove the remaining light red/intermediate red values from active CSS fields, P3 fallbacks, shader constants, and MP4 export ramps
- reduce warm opacity so orange remains light/energy without turning the red field coral

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- colour scan confirmed no remaining old light/intermediate gradient values in the active prototype files: `236 0 32`, `136 17 18`, `255 58 58`, `230 31 30`, `228 18 30`, `63 0 5`, `106 5 10`, or old P3 red/deep values
- Playwright confirmed clean reload exports schema `aha-living-gradient-playground/v19`
- Playwright confirmed authored defaults compute `--lg-brightness: 1.00`, `--lg-saturation: 1.34`, `--lg-warm-ambient: 0.032`, `--lg-warm-reveal-opacity: 0.668`, `--lg-red-field-opacity: 1.000`, and `--lg-red-alt-opacity: 0.960`
- Playwright confirmed no console warnings or errors and no desktop horizontal overflow
- screenshots saved to `output/playwright/aha-living-gradient-playground/v19-three-colour/`

## 2026-06-29
### Task
- repair the simplified living-gradient playground so opacity never washes the artwork over white

### Change
- bump saved settings and config schema to `v20`
- keep only `breath`, `heartlight`, and `shaderflow`
- remove the stale P3, brightness, saturation, cloudmesh, softplasma, pulse, current, and emberveil implementation surface from the active prototype contract
- keep every `.living-gradient` surface on an opaque middle-red base so transparent fields composite over red, not page white
- reduce the right-panel controls to the parameters that affect each selected effect
- drive Shader Flow from the same breath-cycle idea and keep its renderer/export path on red, deep red, and orange only

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- targeted scan confirmed the active prototype files no longer contain v19 storage/schema, removed mode implementations, P3 alternates, brightness/saturation controls, or the known washed-out intermediate red values
- Playwright confirmed only three effect cards render: `breath`, `heartlight`, and `shaderflow`
- Playwright confirmed Breath and Light Breath expose only cycle, breath depth, warm light, deep pressure, field size, soft falloff, colour intensity, surfaces, and motion/contrast controls
- Playwright confirmed Shader Flow exposes only cycle, shader speed, shader rotation, warm light, deep pressure, warp/noise, shader blur, colour intensity, surfaces, and motion/contrast controls
- Playwright confirmed Copy Config exports schema `aha-living-gradient-playground/v20`
- Playwright confirmed clean reload starts with no saved storage keys, Save Settings writes `aha-living-gradient-playground:v20`, and the saved value reloads
- Playwright confirmed Export MP4 produced a shortened Shader Flow download named `aha-living-gradient-shaderflow-5.33s-loop.mp4`
- Playwright confirmed `.living-gradient` computes an opaque `rgb(226, 0, 30)` base, with no desktop or mobile horizontal overflow and no console warnings or errors
- screenshots saved to `output/playwright/aha-living-gradient-playground/v20-opaque-three-colour/`

## 2026-06-29
### Task
- tune the v20 living-gradient modes so each one reaches the supplied red/deep/orange reference composition during its cycle

### Change
- increase the warm top-right peak while keeping the colour source limited to orange over the opaque middle-red base
- move deep-red pressure lower-left so it supports the reference shadow shape without darkening the whole center
- tighten the warm field geometry so the orange reads as an upper-right light state, not a full-surface wash
- apply the same reference-match balance to CSS modes, Shader Flow, and MP4 export frames

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- reference image sampling established the target top-right average at approximately `(220, 97, 54)`
- Playwright export-frame sampling at phase `0.4` confirmed all three modes reach the reference warm-top-right state:
  - `breath`: top-right `(239, 102, 35)`
  - `heartlight`: top-right `(239, 99, 34)`
  - `shaderflow`: top-right `(239, 98, 34)`
- Playwright confirmed only three mode cards, no horizontal overflow, opaque `rgb(226, 0, 30)` gradient backing, and zero console warnings or errors
- controlled peak screenshots saved to `output/playwright/aha-living-gradient-playground/v20-reference-match/`

## 2026-06-29
### Task
- add a slow-motion flame simulation to the living-gradient playground

### Change
- add `slowflame` / Slow Flame as a fourth shader-based mode
- bump saved settings and config schema to `v21`
- build the flame shader from the approved middle red, deep red, and orange only, with an opaque middle-red base and a heavily blurred rising plume
- give Slow Flame a mode-specific control set: cycle, shader speed, warm light, deep pressure, field size, warp/noise, shader blur, colour intensity, surfaces, and motion/contrast
- add Slow Flame support to Copy CSS, Copy Config, MP4 export rendering, reduced-motion fallback, and prototype lookup notes

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- Playwright confirmed the mode API renders `breath`, `heartlight`, `shaderflow`, and `slowflame`
- Playwright confirmed Slow Flame exports schema `aha-living-gradient-playground/v21`, renders five WebGL shader canvases, shows no horizontal overflow, and keeps the computed gradient backing at opaque `rgb(226, 0, 30)`
- Playwright confirmed Slow Flame exposes only its relevant controls and reduced motion disables shader canvases in favor of a static three-colour fallback
- Playwright console check found zero warnings and zero errors
- screenshot sampling of `output/playwright/aha-living-gradient-playground/v21-slow-flame/background-final-3.png` found top/right warm light, red center, deep lower-left, and no pale or white-ish pixels in the artwork crop

## 2026-06-29
### Task
- rebuild the living-gradient playground around the flame direction only

### Change
- replace the legacy multi-effect runtime with one responsive flame shader and four presets: A, B, C, and D
- remove the active blur control, CSS breath modes, Shader Flow branch, Slow Flame mode branch, and old shared mode plumbing
- add flame-specific controls for scale, horizontal/vertical position, plume width/height, flame strength, cycle, evolution speed, rise, sway, organic edge, inner tongue, warm light, deep pressure, and colour intensity
- add a compact in-demo explanation of how the shader works from an opaque middle-red base through noise masks, shadow, and orange light
- keep Copy CSS, Copy Config, Save Settings, Reset, reduced-motion fallback, and MP4 export aligned to the single flame contract
- update lookup notes to schema/storage `v22`

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- Playwright confirmed schema `aha-living-gradient-playground/v22`, visual mode `flame`, four preset cards, five WebGL shader canvases, no horizontal overflow on desktop or mobile, and zero console warnings/errors
- Playwright confirmed Save Settings restores a saved preset on reload and Reset clears storage back to preset A
- Playwright confirmed reduced motion disables shader canvases and uses a static three-colour flame fallback
- screenshots saved to `output/playwright/aha-living-gradient-playground/v22-flame-presets/`

## 2026-06-29
### Task
- make the single flame shader visibly faster and more evolutionary

### Change
- shorten preset cycles and raise default evolution speeds so A-D loop in roughly 9-14 seconds instead of 40-60 seconds
- expand the Evolution speed control range to `0.4x` through `4.0x`
- increase the shader's internal rising/noise multiplier so the organic flame edge and inner tongue visibly evolve within each loop
- keep the schema at `v22` because the control contract is unchanged

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- Playwright confirmed preset export loop lengths now resolve to approximately `A 11.85s`, `B 9.33s`, `C 14.4s`, and `D 11.43s`
- Playwright confirmed five shader canvases, schema `aha-living-gradient-playground/v22`, and no horizontal overflow

## 2026-06-29
### Task
- make all flame preview examples show the same shader section

### Change
- remove per-surface aspect remapping so logo, button, card, and background sample the same normalized flame section
- remove the surface-specific warm-light multiplier so the examples no longer vary intensity by surface type
- keep the existing responsive canvas sizing; only the crop/mask changes per example

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- targeted scan confirmed no remaining `u_surface`, `surfaceWeight`, per-resolution aspect remap, or old shader mode references in the active prototype files
- Playwright reload confirmed zero console warnings/errors
- screenshot saved to `output/playwright/aha-living-gradient-playground/v22-same-section/full-preview.png`

## 2026-06-29
### Task
- remove square-edged flame artifacts from the single shader

### Change
- replace the broad rectangular upper-light carrier with a tapered flame mask
- constrain orange to the organic flame body and inner tongue instead of letting it form an independent top-right plateau
- add noisy edge falloff, a narrowing plume, and a rounded tip structure so the visible shape behaves like flame rather than a square field

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- Playwright console check found zero warnings/errors
- card and background screenshots saved to `output/playwright/aha-living-gradient-playground/v22-organic-flame/`

## 2026-06-29
### Task
- add deeper flame shader controls and make blur adjustable

### Change
- bump saved settings and config schema to `v23`
- add visible controls for taper, tip roundness, edge softness, warm spread, shadow reach, noise scale, spine wobble, tongue width, and shader blur
- keep shader blur at `0px` by default, with the slider reaching `180px`
- include the expanded shader controls in Copy CSS and Copy Config
- include shader blur in the MP4 export render path

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- Playwright confirmed the expanded controls render for taper, tip roundness, edge softness, warm spread, shadow reach, noise scale, spine wobble, tongue width, and shader blur
- Playwright confirmed shader blur defaults to `0px`, updates the live shader canvas to `blur(140px)` when adjusted, and exports through both Copy CSS and Copy Config under schema `aha-living-gradient-playground/v23`
- Playwright console check found zero warnings/errors
- screenshot saved to `output/playwright/aha-living-gradient-playground/v23-expanded-controls/blur-140.png`

## 2026-06-29
### Task
- restore the orange colour event after the expanded flame controls made the default shader too red/deep

### Change
- bump saved settings and config schema to `v24` so stale `v23` local storage cannot keep the weaker orange defaults
- raise the default warm-light and warm-spread presets
- replace the overly constrained warm mask with noisy top/right flame lobes, a softer crown, and a restrained inner tongue
- keep the orange inside the flame body so it does not return as a square field

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- Playwright confirmed clean `v24` defaults load with `Warm light 1.24`, `Warm spread 0.92`, and `Shader blur 0px`
- Playwright confirmed Copy Config exports schema `aha-living-gradient-playground/v24`
- Playwright confirmed no horizontal overflow and zero console warnings/errors
- screenshots saved to `output/playwright/aha-living-gradient-playground/v24-orange-restored/`

## 2026-06-29
### Task
- add flame rotation control and allow much larger flame scaling

### Change
- bump saved settings and config schema to `v25`
- add a `Rotation` slider from `-180deg` to `180deg`
- wire rotation through preset values, CSS custom properties, Copy CSS, Copy Config, WebGL uniforms, and MP4 export
- expand Overall scale, Plume width, and Plume height controls to a maximum of `5.00`
- widen horizontal and vertical positioning from `-100%` to `200%` so oversized flames can be situated off-canvas

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- Playwright confirmed the Rotation slider ranges from `-180deg` to `180deg`
- Playwright confirmed Overall scale, Plume width, and Plume height all reach `5.00`
- Playwright confirmed horizontal and vertical position controls range from `-100%` to `200%`
- Playwright confirmed Copy Config exports schema `aha-living-gradient-playground/v25` with `flameRotation`, `flameScale`, `flameWidth`, and `flameHeight`
- Playwright confirmed no horizontal overflow and zero console warnings/errors after setting rotation to `45deg` and scale/width/height to `5.00`
- screenshot saved to `output/playwright/aha-living-gradient-playground/v25-rotation-scale/background-rotated-5x.png`

## 2026-06-29
### Task
- make MP4 export match the live background shader and soften colour transitions

### Change
- bump saved settings and config schema to `v26`
- soften the red-to-deep transition by broadening the shadow masks and lowering the hard deep-red peak
- change live blur geometry so the shader canvas renders beyond the visible surface before being blurred and cropped
- replace the old hand-drawn MP4 export approximation with the same WebGL flame shader used by the live preview
- change MP4 export to a flat `1920 x 1080` 16:9 canvas with no rounded-corner framing
- bake blur into MP4 export by rendering an oversized WebGL source and drawing it through a filtered 16:9 recording canvas

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- Playwright confirmed Copy Config exports schema `aha-living-gradient-playground/v26`
- Playwright confirmed MP4 export plan is `1920 x 1080`
- Playwright confirmed a `40px` blur renders the live shader canvas larger than the visible background surface, avoiding cutout-edge blur loss
- Playwright confirmed the MP4 export renderer uses a `1920 x 1080` recording canvas and a larger `2080 x 1240` shader source for `40px` blur
- Playwright confirmed a real intercepted MP4 export completes as `aha-living-gradient-flame-8.00s-loop.mp4` with MIME type `video/mp4`
- Playwright confirmed no horizontal overflow and zero console warnings/errors

## 2026-06-29
### Task
- add animated logo MP4 export with logo-specific shader mapping

### Change
- bump saved settings and config schema to `v27`, while reading legacy `v26` saved settings before the user saves forward
- add Logo Mapping controls for logo-only shader scale, X/Y offset, rotation offset, and export size
- apply logo mapping only to `data-surface="logo"` previews and logo MP4 export renders
- split MP4 actions into Export Background MP4 and Export Logo MP4
- render logo MP4s by drawing the current flame shader through the large AHA logo mask on a white `1920 x 1080` canvas
- keep oversized blur-plane behavior for both background and logo exports

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- Playwright confirmed legacy `aha-living-gradient-playground:v26` settings migrate into schema `aha-living-gradient-playground/v27` without writing `v27` before Save Settings
- Playwright confirmed Logo Mapping changes alter the logo shader override values while leaving the background shader unchanged
- Playwright confirmed Copy Config exports the new logo mapping fields
- Playwright confirmed Export Background MP4 and Export Logo MP4 both produce MP4 blobs with browser-supported `video/mp4` MIME type
- Playwright confirmed logo export uses a white `1920 x 1080` canvas, a centered large AHA logo mask, and an oversized shader source when blur is active
- Playwright headed Chromium confirmed WebGL is active, five live shader canvases render, the new logo controls/button are present, no horizontal overflow exists, and no console warnings/errors appear
- Playwright mobile Chromium confirmed the new export controls remain available with no horizontal overflow and no console warnings/errors

## 2026-06-29
### Task
- simplify the flame plume model so dark red is the background, not a separate moving area

### Change
- bump saved settings and config schema to `v28`, while reading legacy `v27` and `v26` saved settings before the user saves forward
- replace the multi-mask plume shader with a simpler nested model: opaque deep-red base, larger red plume, smaller orange plume
- remove the separate dark-red shadow mask, inner tongue, crown, tip cap, and shadow-reach logic from the active shader model
- remove unused tongue, spine, tip, and shadow controls from the authored `v28` state and active panel
- update reduced-motion and no-canvas fallback styling to use a deep-red base with red and orange plumes

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- Playwright headed Chromium confirmed Copy Config exports schema `aha-living-gradient-playground/v28`
- Playwright confirmed the active controls no longer include the removed tongue, spine, tip, or shadow-reach controls
- Playwright confirmed Copy CSS no longer exports the removed plume/shadow custom properties
- Playwright sampled the background preview and found all three intended colour regions: deep-red base, red plume, and smaller orange plume
- Playwright confirmed the background surface fallback colour is deep red `rgb(82, 2, 8)`
- Playwright confirmed Export Background MP4 and Export Logo MP4 still produce browser-supported `video/mp4` blobs with the simplified shader
- Playwright confirmed no horizontal overflow and zero console warnings/errors

## 2026-06-29
### Task
- quick-fix the logo preview so it uses the same shader window as the broader surfaces by default

### Change
- bump saved settings and config schema to `v29`
- default `logoShaderScale` to `1` instead of `0.5`
- migrate legacy `v28`, `v27`, and `v26` saved settings while resetting only logo scale, logo X/Y, and logo rotation offsets to neutral
- keep the global flame settings and existing logo export size during migration

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- Playwright seeded a legacy `v28` saved state with `logoShaderScale: 0.5`, `logoShaderX`, `logoShaderY`, and `logoShaderRotation` offsets, then confirmed `v29` loads logo mapping as neutral
- Playwright confirmed global flame scale, flame X/Y, and logo export size survive the legacy migration
- Playwright confirmed Copy Config exports schema `aha-living-gradient-playground/v29`
- Playwright confirmed no horizontal overflow and zero console warnings/errors

## 2026-06-29
### Task
- make side sway much stronger and add more visible plume movement

### Change
- bump saved settings and config schema to `v30`
- increase Side sway range from `0-1` to `0-4`
- multiply authored preset side-sway defaults by four
- migrate legacy saved side-sway values into the stronger range by multiplying by four and clamping to the new max
- add a slow whole-plume horizontal drift driven by Side sway
- strengthen the existing internal spine bend driven by Side sway

### Files
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
- `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- Playwright seeded a legacy `v29` saved state with `sway: 0.34`, then confirmed `v30` loads it as `1.36`
- Playwright confirmed Side sway max is `4` and authored default is `0.96`
- Playwright confirmed Copy Config exports schema `aha-living-gradient-playground/v30`
- Playwright confirmed Copy CSS exports the migrated stronger sway value
- Playwright confirmed no horizontal overflow and zero console warnings/errors

## 2026-06-29
### Task
- build spatial tabs and cards playground

### Change
- add a self-contained static prototype for testing tactile tabs and full-card targets in one live surface
- use the linked Figma node `3qEMU5hYtAJ3S7vWGijJhQ / 7070:408023` as the state reference, with solid red selected tabs
- add seven journey tabs and ten related cards across healthy living, conditions, caregiving, donation, volunteering, CPR, and personal-start examples
- make hover lift surfaces and increase drop shadow, while pressed moves surfaces inward into the page and reduces drop shadow
- separate each target into `.surface-body` and `.surface-content` layers so fill, edge, media, shadow, and transform can move without scaling or moving the text/icons
- keep inner body shadows fixed as pseudo-elements so they do not change across hover, pressed, selected, route, or slider states
- add right-panel sliders for shadow strength, lift, pressed depth, scale, timing, spread, tilt, and perspective
- add Route A / Route B, Live / State board, and Reduced motion toggles
- use the same gradient-playground header structure and right-side parameter panel pattern
- register the prototype in the artifact index and human lookup map

### Files
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/index.html`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/styles.css`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/assets/`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- `npm run play -- --no-open` confirmed the managed server is running at `http://127.0.0.1:4173`
- Browser QA confirmed seven semantic tabs, ten cards in the live card field, and eleven adjustment sliders
- Browser QA confirmed hover transforms only `.surface-body` to `scale(1.028)`, `translateY(-10px)`, and positive Z depth while `.surface-content` remains identity transform
- Browser QA confirmed pressed transforms only `.surface-body` to `scale(0.982)`, `translateY(7px)`, and negative Z depth while `.surface-content` remains identity transform
- Browser QA confirmed no content-nudge control remains and `.surface-content` computes to `transform: none` in default, hover, and pressed states
- Browser QA confirmed the `::after` inner body shadow stays identical across default, hover, and pressed states
- Playwright confirmed ArrowRight, Home, and End tab keyboard navigation update `aria-selected`
- Browser QA confirmed selecting tabs reorders related cards onto the foreground plane
- Browser QA confirmed hover-shadow, pressed-depth, and spatial-spread sliders update live CSS variables
- Playwright confirmed Route A / Route B, Live / State board, and Reduced motion toggles work and expose `aria-pressed`
- Browser QA confirmed image assets load, the image card uses local `card-build-healthier-habits.png`, panel contents fit, card titles fit, no console errors occur, and desktop/mobile layouts have no horizontal overflow
- screenshots saved to `output/playwright/aha-spatial-tabs-cards-playground-2026-06-29/desktop.png` and `output/playwright/aha-spatial-tabs-cards-playground-2026-06-29/mobile.png`

## 2026-06-29
### Task
- rebuild the cards and tabs playground from the corrected living-UI Figma frame

### Change
- replace the exaggerated spatial card field with the linked Figma node `3qEMU5hYtAJ3S7vWGijJhQ / 7140:440002`
- keep the gradient-playground status header, then match the frame structure: two medium image-card components in the top white panel, seven journey tabs centered in the lower white panel, and a quiet three-block right panel
- remove perspective, card tilt, Z-depth controls, foreground reordering, and the multi-card stage that did not match the design intent
- use local Figma-exported image and icon assets while keeping card text as live HTML
- define the subtle tactile contract in CSS: hover expands the visual surface by `2px` on each side, moves content up `1px`, and increases shadow; pressed tucks the visual surface inward by `1px`, moves content down `1px`, and removes the visible drop shadow
- document the exact motion in the right panel: hover `180ms cubic-bezier(.2,.8,.2,1)`, press `90ms cubic-bezier(.3,0,.2,1)`, release `220ms cubic-bezier(.16,1,.3,1)`

### Files
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/index.html`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/styles.css`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/assets/figma/`
- `README.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- `npm run play -- --no-open` confirmed the managed server is running at `http://127.0.0.1:4173`
- Browser QA confirmed two cards, seven semantic tabs, three right-panel blocks, loaded local assets, no console errors, and no desktop/mobile horizontal overflow
- Browser QA confirmed hover expands the surface from `320 x 471` to `324 x 475`, moves content to `translateY(-1px)`, and increases the drop shadow
- Browser QA confirmed pressed tucks the surface to `318 x 469`, moves content to `translateY(1px)`, and reduces the visible drop shadow to a 1px hairline
- Browser QA confirmed the inner shadow remains identical across live, hover, and pressed states
- Browser QA confirmed keyboard tab navigation still works
- screenshots saved to `output/playwright/aha-spatial-tabs-cards-playground-2026-06-29/rebuilt-desktop.png` and `output/playwright/aha-spatial-tabs-cards-playground-2026-06-29/rebuilt-mobile.png`

## 2026-06-29

### Task
- refine the living-UI cards and tabs playground against the linked Figma frame with subtler defaults and adjustable effect controls

### Change
- rechecked Figma node `3qEMU5hYtAJ3S7vWGijJhQ / 7140:440002`
- reduced the default hover behavior from the previous stronger surface expansion to `1px` on each side, with a `1px` content lift and a smaller shadow increase
- kept the pressed behavior intentionally quiet: `1px` inward surface tuck, `1px` content drop, and a near-zero shadow
- added right-panel sliders for hover expansion, hover text lift, hover shadow strength, pressed inset, pressed text drop, pressed shadow strength, hover timing, press timing, and release timing
- refined card typography to the Figma values: `24px / 1.1` title, `14px / 1.4` medium body, `0.14px` tracking, and `14px` title/body gap
- fixed the shell sizing so the right-panel controls do not stretch the Figma preview panels

### Files
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/index.html`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/styles.css`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js`
- `README.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- `npm run play -- --no-open` confirmed the managed server is running at `http://127.0.0.1:4173`
- Browser QA confirmed two cards, seven tabs, nine effect sliders, loaded assets, no console errors, and no desktop/mobile horizontal overflow
- Browser QA confirmed hover expands the visual surface by `1px` on each side, moves content to `translateY(-1px)`, and leaves the inner shadow unchanged
- Browser QA confirmed pressed tucks the visual surface inward by `1px`, moves content to `translateY(1px)`, and leaves the inner shadow unchanged
- Browser QA confirmed the sliders update live CSS variables
- screenshots saved to `output/playwright/aha-spatial-tabs-cards-playground-2026-06-29/refined-desktop.png` and `output/playwright/aha-spatial-tabs-cards-playground-2026-06-29/refined-mobile.png`

## 2026-06-29

### Task
- refine the living-UI playground gradient, typography rendering, and spatial motion after rechecking the Figma board

### Change
- captured the linked Figma frame `3qEMU5hYtAJ3S7vWGijJhQ / 7140:440002` to `output/figma-living-ui-7140-440002.png`
- changed the card media overlay to a Figma-style bottom-to-middle tone gradient with `7px` backdrop blur and a masked fade so the image reveals progressively instead of hitting a hard blur band
- changed motion from inset expansion to a layered body transform: the body layer scales/lifts while carrying the edge, image, gradient, inner light, and shadow
- kept the copy layer separate so text moves in whole pixels but is not scaled
- changed default hover to body scale `1.018`, body lift `6px`, text lift `2px`, and a stronger weighted shadow
- changed default pressed to body scale `0.992`, body drop `2px`, text drop `2px`, and a tightened near-surface shadow
- lengthened the timing to hover `360ms`, press `140ms`, and release `460ms`, with a slight hover overshoot via `cubic-bezier(.18,.72,.18,1.14)`
- set card and tab typography to geometric precision rendering with antialiasing, and fixed all tab bodies at `108px` height

### Files
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/index.html`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/styles.css`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js`
- `README.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js` passed
- Playwright confirmed hover scales the first card body from `320 x 471` to about `326 x 479`, lifts it, moves text to `0px -2px`, and increases the weighted shadow
- Playwright confirmed pressed scales the first card body to about `317 x 467`, drops it, moves text to `0px 2px`, and tightens the shadow
- Playwright confirmed the inner shadow stays constant across states
- Playwright confirmed the card gradient uses the Figma tone ramp, `blur(7px)`, and a fade mask
- Playwright confirmed all seven tabs are `108px` tall
- Playwright confirmed no console errors and no desktop/mobile horizontal overflow
- screenshots saved to `output/playwright/aha-spatial-tabs-cards-playground-2026-06-29/weighted-gradient-desktop.png` and `output/playwright/aha-spatial-tabs-cards-playground-2026-06-29/weighted-motion-mobile.png`

## 2026-06-29

### Task
- implement design parity for the Women’s Heart Health card against Figma component node `7140:440045`

### Change
- refreshed live Figma context and screenshot for `3qEMU5hYtAJ3S7vWGijJhQ / 7140:440045`
- changed the card renderer to support card-specific image layer schemas
- rebuilt the Women’s Heart Health media stack with the Figma layers: `#f5f5f4` fill, full-cover portrait image, cropped landscape image at `left: -75.86%`, `width: 209.23%`, `height: 99.99%`, then the final full-cover image layer
- fixed the card frame to `320px x 471px` with `16px` radius, Body 2 outer shadow, and constant Body 2 inner edge
- kept the Figma content metrics: `20px` horizontal padding, `24px` vertical padding, `24px` copy/chevron row gap, and `14px` title/body gap
- matched the title text to Figma punctuation: `Women’s Heart Health`
- changed the chevron rendering to use the Figma SVG directly, without CSS filtering, at the small inner geometry inside the `20px` icon box

### Files
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/styles.css`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js` passed
- Playwright captured the rendered Women’s Heart Health card to `output/playwright/aha-spatial-tabs-cards-playground-2026-06-29/womens-card-parity.png`
- Playwright confirmed card size `320 x 471`, radius `16px`, default Body 2 shadow restoration, and constant inner shadow across default, hover, and pressed states
- Playwright confirmed gradient height `200px`, `blur(7px)`, and `#503926` tone ramp
- Playwright confirmed title `24px / 26.4px / 700`, body `14px / 19.6px / 500`, body tracking `0.14px`, white title, and `rgba(255,255,255,0.8)` body colour
- Playwright confirmed content padding, row gap, title/body gap, Figma crop dimensions, chevron image geometry, no console errors, and no desktop/mobile horizontal overflow
- SVG inspection confirmed chevron `viewBox 0 0 6.66667 11.6667`, stroke opacity `0.94`, stroke width `1.66667`, and round caps/joins

## 2026-06-29

### Task
- rework the living-interface lab control system so more parameters fit cleanly in the right panel

### Change
- replaced the flat slider list with grouped controls for Presets, Surface, Copy, Depth, and Timing
- added Quiet, Default, Expressive, and Reset presets
- reset the default baseline to the screenshot values: hover scale `1.01`, hover lift `6px`, hover text lift `2px`, hover shadow `1.1`, pressed scale `0.992`, pressed drop `2px`, pressed text drop `1px`, pressed shadow `0.7`, hover `510ms`, press `80ms`, and release `720ms`
- expanded the parameter ranges for hover/pressed scale, lift, drop, half-pixel text movement, shadow weights, timing, hover tilt, media drift, chevron nudge, and overshoot
- added Copy response modes: Stable, Follow 25%, and Full surface diagnostic; Stable keeps live copy unscaled by default
- made the control panel denser with smaller rows, smaller range tracks, compact grouped headings, and internally scrolling effect controls
- disabled text selection on cards, tabs, labels, copy, and state/preset buttons while keeping sliders usable
- tightened the tab row toward the Figma master: `108px` tab height, `52px` icon row, `8px` top padding, `10px` sides, `15px` bottom padding, `8px` icon/label gap, and Make a contribution selected by default
- made reduced motion strict by neutralizing scale, lift, tilt, copy scale, media drift, chevron nudge, animated shadows, and transforms

### Files
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/index.html`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/styles.css`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js`
- `README.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- `npm run play -- --no-open` confirmed the managed server is running at `http://127.0.0.1:4173`
- Playwright confirmed grouped controls render as Presets, Surface, Copy, Depth, and Timing
- Playwright confirmed `2.5px` hover text lift and `1.5px` pressed text drop values update live
- Playwright confirmed Stable copy transforms without scale, Follow 25% reaches `matrix(1.0025, 0, 0, 1.0025, 0, -2.5)`, and Full surface diagnostic reaches `matrix(1.01, 0, 0, 1.01, 0, -2.5)`
- Playwright confirmed card and tab text selection computes to `user-select: none` while sliders remain draggable
- Playwright confirmed Make a contribution is selected by default and the tab metrics match `108px` height, `8px 10px 15px` padding, `52px` icon row, and `8px` gap
- Playwright confirmed reduced motion computes surface/content/media transforms to `none`, arrow translate to `0px`, and all movement variables to neutral values
- Playwright confirmed no console warnings or errors and no desktop or mobile horizontal overflow

## 2026-06-30

### Task
- refine the living-interface lab controls with lighter parameter typography, four presets, copy anchoring, and subtle card-arrow response

### Change
- reduced the weight of parameter labels, group status values, preset buttons, segmented copy-mode buttons, and motion-spec terms so the right panel no longer uses the thick display feel for controls
- added a fourth parameter preset, Anchored, alongside Quiet, Default, and Expressive; Reset still restores Default
- added an Anchored copy response mode that keeps live text unscaled but moves it with the surface lift/drop, plus the small text offset
- kept Stable as the default copy mode so normal usage still protects text sharpness and avoids scale-driven shimmer
- gave the card chevron its own hover and pressed response: hover nudges and scales it forward slightly, while pressed tucks it back/down subtly
- kept the chevron response connected to the existing Chevron nudge control and neutralized it in reduced motion

### Files
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/styles.css`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js`
- `README.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- `npm run play -- --no-open` started the managed server at `http://127.0.0.1:4173`
- Playwright confirmed the preset buttons render as Quiet, Default, Anchored, Expressive, and Reset
- Playwright confirmed the lighter control typography: group headers `700`, group status `600`, slider labels `600`, slider outputs `500`, and segmented buttons `600`
- Playwright confirmed Anchored mode keeps copy unscaled while moving with the surface: hover copy transform `matrix(1, 0, 0, 1, 0, -6)` and pressed copy transform `matrix(1, 0, 0, 1, 0, 2.5)` for the Anchored preset
- Playwright confirmed chevron response: hover transform `matrix(1.02625, 0, 0, 1.02625, 1.75, 0)` and pressed transform `matrix(0.9825, 0, 0, 0.9825, -0.6125, 0.4375)`
- Playwright confirmed reduced motion neutralizes content and arrow transforms to `none`, with chevron variables reset to `0px`, `0px`, and `1`
- Playwright confirmed no console warnings or errors and no desktop or mobile horizontal overflow

## 2026-06-30

### Task
- make Quiet the best/default living-interface motion baseline and refine tab/card depth realism

### Change
- made Quiet the opening state and Reset target instead of the stronger Default preset
- softened the overall motion baseline: hover scale `1.004`, hover lift `2px`, text lift `1px`, pressed scale `0.997`, pressed drop `1px`, pressed text drop `0.5px`, hover `420ms`, press `90ms`, release `560ms`, and overshoot `0.08`
- gave tabs their own Body 1 resting shadow and a separate tab hover shadow so they gain drop shadow on hover without using the heavier card shadow
- retained the existing tab structure and selected-tab styling while making default/resting tab depth quieter
- refined the card chevron response to read as a realistic lateral nudge: Quiet hover moves it `1.5px` sideways with a very small scale increase, and pressed tucks it back/down
- softened the stronger Default preset so it remains available for comparison without overpowering the Quiet baseline

### Files
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/styles.css`
- `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js`
- `README.md`
- `projects/aha-website-refresh/artifact-index.yaml`
- `projects/aha-website-refresh/WHERE-THINGS-LIVE.md`
- `projects/aha-website-refresh/session-log.md`

### Validation
- `node --check reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js` passed
- `npm run verify:brain` passed
- `git diff --check` passed
- `npm run play -- --no-open` confirmed the managed server is running at `http://127.0.0.1:4173`
- Playwright confirmed the lab opens on Quiet and Reset returns to Quiet
- Playwright confirmed the Quiet baseline variables: hover scale `1.004`, hover lift `-2px`, hover duration `420ms`, and release duration `560ms`
- Playwright confirmed tabs rest on the Body 1 shadow and hover with the tab-specific deeper drop shadow
- Playwright confirmed hover moves card copy to `matrix(1, 0, 0, 1, 0, -1)` and moves the chevron sideways to `matrix(1.0105, 0, 0, 1.0105, 1.5, 0)`
- Playwright confirmed pressed state tightens the tab shadow, moves card copy to `matrix(1, 0, 0, 1, 0, 0.5)`, and tucks the chevron to `matrix(0.991, 0, 0, 0.991, -0.525, 0.27)`
- Playwright confirmed reduced motion neutralizes content, arrow, and tab transforms to `none`
- Playwright confirmed no console warnings or errors and no desktop or mobile horizontal overflow
