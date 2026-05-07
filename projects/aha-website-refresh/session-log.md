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
