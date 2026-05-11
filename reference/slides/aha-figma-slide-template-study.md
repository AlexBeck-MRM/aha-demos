---
project_id: aha-website-refresh
id: aha-figma-slide-template-study
title: AHA Figma Slide Template Study
category: slide-system
source: https://www.figma.com/design/NAaHet2YIlt2qowjmhwMuw/AHA---Slide-Template?node-id=98-6876
figma_file_key: NAaHet2YIlt2qowjmhwMuw
figma_section_node_id: "98:6876"
figma_section_name: AHA MRM Slides
last_reviewed: 2026-04-29
status: working
---

# AHA Figma Slide Template Study

## Purpose
- Teach Codex how to use the live AHA Figma slide template before creating a reusable skill.
- Keep the slide system grounded in the existing deck, not a generic presentation taxonomy.
- Use the live Figma frames as source of truth for layout, spacing, type, color, and component behavior.
- Defer skill creation until a six-slide test narrative succeeds.

## Current Source
- File: `AHA---Slide-Template`
- Section: `AHA MRM Slides`
- Section node: `98:6876`
- Full-size slide frames found: `61`
- Canonical slide size: `1920 x 1080`
- Existing local system note: `reference/slides/aha-slide-system-v1.6.md`
- Existing local token file: `reference/slides/tokens-v1.6.json`
- Figma inspection note: current tool surface could not verify the bound account identity because `codex mcp` exposes no `whoami` command and the plugin API does not support `figma.currentUser`.

## Global Construction Rules
- Use `1920 x 1080` frames.
- Keep the page frame itself fixed-position, with major content inside nested auto-layout frames.
- Use the shared header instance on most white-background slides.
- Use the shared footer instance on almost every slide.
- Keep the main content zone at `x=40`, usually `y=112`, usually `w=1840`.
- Keep footer at `y=1016`, `h=64`.
- Keep header at `y=0`, commonly `h=74`, with `40px` horizontal padding and `24px` vertical padding.
- Use white backgrounds for explanation, evidence, data, tabular, and design-review slides.
- Use red/image-background cover frames only for opener, divider, metric hero, quote, and closer moments.
- Do not add dense copy unless the layout is explicitly a canvas, table, matrix, scorecard, or diagnostic board.

## Auto-Layout Behavior
- The section has heavy auto-layout usage: `512` auto-layout frames out of `703` frame-like nodes inspected.
- Common modes:
  - `VERTICAL` for text stacks, panels, cards, quote stacks, and page-level content flow.
  - `HORIZONTAL` for columns, image pairs, card rows, and header instances.
  - `GRID` for repeatable cards, timeline rows, comparison fields, matrices, and dense canvas structures.
- Common gaps:
  - `8` for small label/body stacks.
  - `12` for image plus caption stacks.
  - `20` for image-caption columns.
  - `24` for headings with subheads and card internals.
  - `40` for major columns and medium stacks.
  - `64` for heading-to-body or section-to-table spacing.
  - `80` for large narrative separation and dense slide rhythm.
- Common panel padding:
  - `20` on small cards and prompt boxes.
  - `40/20/40/20` on pillar cards.
  - `1` border-padding on table containers.

## Type System
- Primary font: `MW Sans`.
- Recurring styles:
  - Section display: `MW Sans SemiBold`, `100`, `98%`, usually white or red.
  - Large title: `MW Sans SemiBold`, `86`, `110%`, often red for typographic statements.
  - Slide title: `MW Sans SemiBold`, `57`, `108%`, usually dark.
  - Card title: `MW Sans SemiBold`, `34`, `110%`.
  - Large body: `MW Sans Regular`, `40`, `120%`.
  - Body: `MW Sans Regular`, `34`, `120%`.
  - Medium body/table text: `MW Sans Regular`, `23`, `120%`.
  - Header label: `MW Sans Bold`, `22`, about `26px`.
  - Caption/footer: `MW Sans Regular`, `16` or `22`, `120%`.
- Some table-like imported elements use `Arimo`; do not introduce more Arimo unless duplicating that exact table construction.
- Letter spacing is neutral.

## Color System
- Core dark text: `#181d27`.
- Supporting text: `#414651`.
- White: `#ffffff`.
- Soft panel: `#f5f5f5`.
- Line/border: `#e9eaeb`.
- AHA red in this deck: `#cf222b`.
- Red-background support tint: `#ff9ea1`.
- Use red as signal, not decoration.
- Avoid adding new hues unless an existing heatmap/status treatment requires it.

## Shared Components
- `Header`
  - Used on most white-background slides.
  - Fixed at full slide width.
  - Holds section label text at top left.
- `Document Marks - Footer`
  - Used on nearly all slides.
  - Holds MRM/AHA footer marks and footer text.
  - Has black/dark and white variants depending on background.
- `Document Marks - Headers`
  - Used in style and agenda/reference frames.
- `Document Marks`
  - Used in at least one agenda slide.

## New Slide Build Method
- Duplicate an existing frame that already matches the narrative intent.
- Keep the duplicated frame at `1920 x 1080`.
- Keep the original `Header` and `Document Marks - Footer` instances unless the slide is a red/image opener, divider, metric hero, quote, or closer.
- Edit text inside the existing auto-layout containers instead of flattening or manually positioning copy.
- Resize text boxes only when the source frame already uses fixed text widths for that role.
- Preserve parent layout modes, gaps, and padding.
- Replace image fills inside existing image placeholder frames instead of adding loose image rectangles.
- Keep new top-level additions rare; if needed, place them inside the existing content container.
- Do not convert auto-layout containers to absolute-position groups to make copy fit.
- If copy does not fit, shorten the copy or choose a more appropriate layout.

## Auto-Layout Maintenance Rules
- Use the page frame as a fixed canvas.
- Use nested frames as the layout system.
- Keep text stacks in `VERTICAL` auto-layout.
- Keep column systems in `HORIZONTAL` or `GRID` auto-layout.
- Keep repeated cards as siblings inside one parent layout frame.
- Keep card padding consistent with the source frame.
- Keep body text fixed-width inside the column; let height expand only when the parent frame supports it.
- Do not mix manually placed cards into an auto-layout card row.
- Do not detach header/footer instances unless the slide intentionally needs a new variant.
- When adding or removing repeated items, adjust the sibling count inside the parent layout and rebalance widths/gaps from the existing pattern.

## Density Rules
- Use low-density slides for narrative turns, principles, recommendations, and decisions.
- Use medium-density slides for evidence, findings, visual explanation, and next steps.
- Use high-density slides only for tables, scorecards, matrices, canvases, or appendix material.
- If a slide needs more than one headline-level idea, split it.
- If a slide needs more than six bullets, use a table, canvas, or appendix detail instead.
- If a visual slide needs more than three annotations, use an annotated board or appendix detail instead.
- If a point depends on source evidence, include that evidence in the slide or place it in a source note slide.

## Existing Layout Taxonomy

### Cover / Opener
- Existing frame: `2 Agenda B`
- Node examples: `98:6901`, `98:6908`, `98:6896`
- Use for: full-deck opening, agenda/title moment, or high-impact image-backed section entry.
- Structure:
  - Image fill background.
  - Large white `100px` semi-bold title.
  - Date or section text near lower left.
  - MRM logo/footer marks near bottom.
- Content budget:
  - One title.
  - One date or short support line.
  - No explanatory body copy.

### Red Section Divider
- Existing frame: `Covers-red-section-divider-slide`
- Node examples: `98:7886`, `98:7890`, `98:7894`, `98:7898`
- Use for: major chapter break.
- Structure:
  - Red/image background.
  - White section number at top right.
  - White section name at top left.
  - White footer.
- Content budget:
  - One short section title.
  - One section number.

### Timeline Cards
- Existing frame: `Timeline-slide`
- Node examples: `98:6967`, `98:6986`
- Use for: phases, project timing, run-of-show, or migration path.
- Structure:
  - Header and footer.
  - Title/subtitle stack at `x=40`, `y≈111`.
  - Four-column card grid or timeline grid in main zone.
  - Cards use soft fill and `20px` padding.
- Content budget:
  - One title.
  - One subtitle.
  - Four phases preferred.
  - Each phase gets one short title and one short description.

### Single Narrative
- Existing frame: `Text-narrative-single-narrative-slide`
- Node: `98:7043`
- Use for: one idea, why-it-matters explanation, or decision prompt.
- Structure:
  - Header and footer.
  - Left-aligned vertical stack: title, large paragraph, short bullets.
  - Optional soft decision-prompt box near lower left.
- Content budget:
  - One title.
  - One large paragraph.
  - Up to three bullets.
  - Optional one-line prompt.

### Split Narrative
- Existing frame: `Text-narrative-split-narrative-slide`
- Node: `98:7054`
- Use for: main claim on the left plus implications on the right.
- Structure:
  - Header and footer.
  - `1840px` grid container.
  - Left column around `949px`.
  - Right column around `859px`.
  - Large `64px` left-column spacing and `40px` right-column spacing.
- Content budget:
  - Left: one big claim plus one or two supporting paragraphs.
  - Right: three short titled blocks.

### Narrative + Visual
- Existing frame: `Text-narrative-narrative-visual-slide`
- Node examples: `98:7073`, `98:7084`, `98:7105`, `98:7116`
- Use for: claim plus screenshot, chart, diagram, or multi-visual evidence.
- Structure:
  - Header and footer.
  - Left text column, right visual column.
  - Variants include one large visual, four small visuals, quote-plus-visual, and wider visual arrangements.
- Content budget:
  - One title.
  - One explanation.
  - Up to three bullets or one short caption.
  - One visual or four tightly related visuals.

### Quote Stack
- Existing frame: `Text-narrative-quote-stack-slide`
- Node: `98:7774`
- Use for: repeated stakeholder signal or qualitative evidence.
- Structure:
  - Header and footer.
  - Large top statement.
  - Four stacked quotes below.
  - Quote stack uses vertical auto-layout with `40px` gap.
- Content budget:
  - One synthesis headline.
  - Three or four quotes.
  - Each quote needs a short attribution.

### Three-Line Manifesto
- Existing frame: `Text-narrative-three-line-manifesto-slide`
- Node: `98:7791`
- Use for: simple operating principle or narrative turn.
- Structure:
  - Header and footer.
  - Vertical stack at `x=40`, `y=112`, `w=1840`.
  - Three red `86px` statement lines.
  - One dark support sentence.
- Content budget:
  - Three short imperative lines.
  - One support line.

### Big Number Context
- Existing frame: `Data-big-number-context-slide`
- Node: `98:7136`
- Use for: one metric plus interpretation.
- Structure:
  - Header and footer.
  - Two-column grid.
  - Left column has red label, huge red metric, and context.
  - Right column has supporting observations.
- Content budget:
  - One metric.
  - One context sentence.
  - Two to three interpretive blocks.

### Metric Narrative
- Existing frame: `Text-narrative-metric-narrative-slide`
- Node: `98:7799`
- Use for: metric plus narrative consequence.
- Structure:
  - Header and footer.
  - Left metric stack.
  - Right observation/implication stack.
- Content budget:
  - One metric.
  - One metric explanation.
  - Two or three implications.

### Chart Commentary
- Existing frame: `Data-chart-commentary-slide`
- Node: `98:7159`
- Use for: chart plus meaning, not raw data dumping.
- Structure:
  - Header and footer.
  - Two-column grid.
  - One chart/image placeholder.
  - One commentary column.
- Content budget:
  - One chart.
  - One title.
  - Up to three insight blocks.

### Comparison Table
- Existing frame: `Tabular-comparison-table-slide`
- Node: `98:7183`
- Use for: current vs target, route comparison, model tradeoff.
- Structure:
  - Header and footer.
  - Vertical content stack.
  - Table container with `1px` border-like padding.
  - Header row plus structured body rows.
- Content budget:
  - One title.
  - Three columns preferred.
  - Four to six rows maximum.

### Workplan Matrix
- Existing frame: `Tabular-matrix-workplan-grid-slide`
- Node: `98:7226`
- Use for: workstreams, owners, milestones, or delivery plan.
- Structure:
  - Header and footer.
  - Matrix table under title.
  - Multiple rows with owner/milestone/status language.
- Content budget:
  - Four columns.
  - Four workstreams maximum for readability.

### Scorecard Heatmap
- Existing frame: `Tabular-scorecard-heatmap-grid-slide`
- Node: `98:7273`
- Use for: evaluation criteria, readiness, risk, or option scoring.
- Structure:
  - Header and footer.
  - Table grid.
  - Supports status-like cell treatments.
- Content budget:
  - Five to seven metrics.
  - Short labels only.
  - Use color sparingly and consistently.

### Evidence Stack
- Existing frame: `Findings-a-evidence-stack-slide`
- Node: `98:7336`
- Use for: grouped evidence signals.
- Structure:
  - Header and footer.
  - Two-column evidence grid.
  - Each signal has title and short explanation.
- Content budget:
  - Four to six signals.
  - One or two sentences each.

### Mixed Media Findings
- Existing frame: `Findings-b-mixed-media-findings-slide`
- Node: `98:7366`
- Use for: evidence plus visual proof.
- Structure:
  - Header and footer.
  - Grid with image/visual area and text stack.
  - Right or left evidence blocks.
- Content budget:
  - One visual cluster.
  - Three interpretation blocks.

### Diagnostic Board
- Existing frame: `Findings-b-diagnostic-board-slide`
- Node: `98:7391`
- Use for: problem decomposition across people, process, platform, content, or measurement.
- Structure:
  - Header and footer.
  - Title stack.
  - Grid of diagnostic cards.
- Content budget:
  - Four to six cards.
  - Each card should state one problem, not a paragraph.

### Principles Grid
- Existing frame: `Principles-grid-slide`
- Node examples: `98:7417`, `98:7443`
- Use for: design principles, operating rules, decision criteria.
- Structure:
  - Header and footer.
  - Title plus grid of numbered principle cards.
  - Uses red/dark number badge treatment.
- Content budget:
  - Four to six principles.
  - One short title and one sentence each.

### Principles With Rationale
- Existing frame: `Principles-rationale-cards-slide`
- Node examples: `98:7479`, `98:7496`, `98:7513`, `98:8178`
- Use for: principle-to-rationale, pain-point-to-response, or decision-to-why mapping.
- Structure:
  - Header and footer.
  - Vertical stack.
  - Rows/cards with left label and right rationale.
  - Pain-point variant uses two columns with a center marker.
- Content budget:
  - Three to six pairings.
  - Keep each side to one line or one short sentence.

### Annotated Visual
- Existing frame: `Annotation-annotated-visual-slide`
- Node examples: `98:7534`, `98:7558`
- Use for: explain what matters in a screenshot, wireframe, or visual artifact.
- Structure:
  - Header and footer.
  - Horizontal two-column layout.
  - Left narrative and annotation list.
  - Right visual with caption or callout area.
- Content budget:
  - One visual.
  - Two or three callouts.
  - One short explanation of why the callouts matter.

### Annotated Screens With Icons
- Existing frame: `Principles-annotated-screens-with-icons-slide`
- Node examples: `98:8134`, `98:8168`
- Use for: principle demonstrated against screen evidence.
- Structure:
  - Header and footer.
  - Text/principle column.
  - One or two screenshots with annotation lines.
  - Small icon principle labels.
- Content budget:
  - One principle.
  - One or two screen examples.
  - Up to three labels.

### End-to-End Journey
- Existing frame: `Flows-end-to-end-journey-slide`
- Node: `98:7577`
- Use for: operating flow, user journey, or staged service model.
- Structure:
  - Header and footer.
  - Title/subtitle stack.
  - Large flow visual placeholder.
  - Supporting stage cards beneath.
- Content budget:
  - Four or five steps.
  - Short label and one-sentence description per step.

### Roles Grid
- Existing frame: `People-roles-grid-slide`
- Node examples: `98:7601`, `98:7647`
- Use for: team model, responsibilities, stakeholder groups, audience roles.
- Structure:
  - Header and footer.
  - Title.
  - Grid of role cards.
- Content budget:
  - Six to eight roles.
  - One sentence per role.

### Technology / Recommendation Canvas
- Existing frame: `Canvas-detailed-technology-canvas-slide`
- Node examples: `98:7688`, `98:8031`, `98:8074`
- Use for: dense recommendation, capability canvas, roadmap item, or technology option.
- Structure:
  - Header and footer.
  - Large grid/canvas body.
  - Main body plus sidebar.
  - Sidebar includes horizon/type, impacted audiences, DACI, dependencies, related canvases.
- Content budget:
  - This is allowed to be dense.
  - Use only when detail is necessary for decision-making.
  - Avoid using this for narrative slides.

### Next Steps
- Existing frame: `Next-steps-slide`
- Node examples: `98:7746`, `98:7764`
- Use for: action plan, immediate next moves, meeting close.
- Structure:
  - Header and footer.
  - Title.
  - Horizontal row of action cards.
- Content budget:
  - Three or four action cards.
  - One clear owner/timeframe per card where possible.

### Closer
- Existing frame: `Closer-slide`
- Node: `98:7739`
- Use for: final thank-you or formal close.
- Structure:
  - Red/image background.
  - Huge white thank-you text.
  - Confidentiality line.
  - MRM logo.
- Content budget:
  - One closing statement.
  - Optional confidentiality text.

### Single Large Image
- Existing frame: `Design-prez-single-large-image-slide`
- Node examples: `98:7822`, `98:7829`
- Use for: one design example, screenshot, or hero artifact.
- Structure:
  - Header and footer.
  - Title/subtitle stack.
  - One `1840 x 696` image area.
- Content budget:
  - One image.
  - One title.
  - One caption/subtitle.

### Two Large Images
- Existing frame: `Design-prez-two-large-images-slide`
- Node: `98:7836`
- Use for: before/after, route comparison, or two related examples.
- Structure:
  - Header and footer.
  - Title/subtitle stack.
  - Two image columns around `900px` wide with `40px` gap.
- Content budget:
  - Two visuals.
  - One caption per visual.

### Three Image Columns
- Existing frame: `Design-prez-three-image-columns-slide`
- Node: `98:8109`
- Use for: three audience contexts, three examples, or three visual directions.
- Structure:
  - Header and footer.
  - Title.
  - Three equal columns with title, short paragraph, image, caption.
- Content budget:
  - Three examples.
  - Keep captions short.

### Five Pillars
- Existing frame: `Lists-five-column-icon-pillars-slide`
- Node: `98:7849`
- Use for: five parallel pillars, checklist dimensions, or system qualities.
- Structure:
  - Header and footer.
  - Title/subtitle.
  - Five horizontal cards with icon space and text.
- Content budget:
  - Five pillars exactly.
  - One title and one sentence each.

### Red Metric Hero
- Existing frame: `Covers-red-metric-hero-slide`
- Node: `98:7902`
- Use for: one major number that needs emotional impact.
- Structure:
  - Red background.
  - Centered large metric.
  - White main text.
  - Pink support line.
- Content budget:
  - One metric.
  - One short interpretation.
  - One support line.

### Big Title Statement
- Existing frame: `Text-narrative-big-title-statement-slide`
- Node examples: `98:7909`, `98:7917`, `98:7931`
- Use for: learning, key claim, or strategic takeaway.
- Structure:
  - Header and footer.
  - Red label.
  - Red `100px` quote/statement.
  - Dark supporting paragraph.
- Content budget:
  - One label.
  - One large statement.
  - One supporting paragraph.

### Typographic Statement
- Existing frame: `Text-narrative-typographic-statement-slide`
- Node examples: `98:7947`, `98:7985`
- Use for: quote with structured implications.
- Structure:
  - Header and footer.
  - Main red typographic quote or statement.
  - Right-side benefit/implication/response stack.
- Content budget:
  - One quote or statement.
  - Two or three right-side blocks.

### Red Typographic Quote
- Existing frame: `Covers-red-typographic-quote-slide`
- Node: `98:8022`
- Use for: high-emotion stakeholder quote or chapter-setting voice.
- Structure:
  - Red background.
  - Centered vertical quote stack around `x=315`, `y=316`.
  - White quote.
  - Pink support line.
- Content budget:
  - One quote.
  - One explanation line.

## Proposed Missing Standard Layouts
- `Decision Recommendation`
  - Use when the deck needs to say what we should do, not just describe evidence.
  - Base it on `Split Narrative` or `Principles With Rationale`.
  - Structure: recommendation on left, rationale/risks/next proof on right.
- `Source / Evidence Note`
  - Use when a short narrative needs traceability without making the main slide dense.
  - Base it on `Single Narrative`.
  - Structure: small title, compact source bullets, confidence note.
- `Before / After UX Change`
  - Use when showing a current-state screen and proposed direction side by side.
  - Base it on `Two Large Images`.
  - Structure: before visual, after visual, one caption each, optional short takeaway.
- `Storyboard Sequence`
  - Use when explaining a user journey across three to five moments.
  - Base it on `Timeline Cards` or `End-to-End Journey`.
  - Structure: moment cards with minimal copy and optional small visual.
- `Appendix Detail`
  - Use for dense supporting material that should not interrupt the main story.
  - Base it on `Canvas` or `Tabular Matrix`.
  - Structure: clear appendix label, dense but organized evidence.

## Slide Selection Rules
- Start with narrative intent, then choose layout.
- Use a red divider only when the story turns to a new chapter.
- Use a typographic slide when the point needs to land emotionally or strategically.
- Use a table only when the audience must compare structured fields.
- Use a canvas only when the audience needs decision detail.
- Use image-led slides when the image is the argument.
- Use evidence/finding slides when there are multiple observed signals.
- Use next-steps slides only when the actions are specific enough to assign.

## Intent-To-Layout Map
- Name the problem: `Cover / Opener`, `Red Section Divider`, or `Big Title Statement`.
- Explain why it matters: `Single Narrative` or `Split Narrative`.
- Show source evidence: `Evidence Stack`, `Mixed Media Findings`, or `Source / Evidence Note`.
- Diagnose the pattern: `Diagnostic Board`, `Principles With Rationale`, or `Comparison Table`.
- Show the system change: `Narrative + Visual`, `End-to-End Journey`, or `Storyboard Sequence`.
- Compare current and target state: `Comparison Table`, `Two Large Images`, or `Before / After UX Change`.
- Land a strategic principle: `Three-Line Manifesto`, `Big Title Statement`, or `Principles Grid`.
- Make a recommendation: `Decision Recommendation` or `Split Narrative`.
- Assign action: `Next Steps` or `Workplan Matrix`.
- Store detail: `Appendix Detail`, `Technology / Recommendation Canvas`, or `Scorecard Heatmap`.

## Content Guardrails
- One main idea per slide.
- Prefer one strong sentence over three weak bullets.
- Bullets should be evidence, implications, or actions, not decorative restatement.
- Do not invent facts to fill a layout.
- If a claim lacks evidence, label it as hypothesis or open question.
- Keep slide language closer to working design direction than marketing copy.
- Use AHA-like plain language and direct verbs.

## Skill-Creation Implications
- The eventual skill should load this study only when asked to build or revise AHA slides.
- The skill should read live Figma before creating slides when the source file is available.
- The skill should duplicate existing frames and modify copy/assets rather than recreate styles from scratch.
- The skill should enforce layout choice by narrative purpose.
- The skill should include a six-slide test before being treated as reliable.

## Six-Slide Test Requirement
- Test narrative source requested by user: `codex://threads/019dd492-359e-7621-bbf7-577c6e015b9f`.
- Current state: the user pasted the relevant thread summary into the working conversation.
- Source constraint: leave out the `Top 18 Areas of Focus` rearrangement topic from the test narrative.
- Use the pasted source to discuss the Healthy Eating / guide-system problem, not to classify all focus areas.
- Do not include the focus-area split table in the test deck.
- Do not make the narrative about reorganizing `18` priority areas.
- Keep the narrative on the structural problem:
  - AHA has trust and content depth, but the current site often behaves like a repository.
  - Users need guided journeys that explain where they are, what matters now, what to do next, and how topics connect.
  - The Healthy Eating capture makes the issue concrete because a large set of valuable pages is organized through mixed campaign, article, tool, lifestyle-goal, and clinical-adjacent buckets.
  - The redesign opportunity is to turn priority content into canonical learning and action experiences.
  - Healthy Eating should become a guide or short-course-like experience with clear chapters and supporting articles, recipes, tools, programs, and sources.
  - Condition/clinical pages, Healthy Living guides, and supporting content should have distinct jobs.
- Proposed six-slide test arc:
  1. `Big Title Statement`: AHA has the depth, but the current structure reads like a repository.
  2. `Single Narrative`: The companion ambition requires guided learning and action, not just access to pages.
  3. `Evidence Stack` or `Diagnostic Board`: Healthy Eating shows mixed organizing logic across valuable content.
  4. `End-to-End Journey` or `Storyboard Sequence`: Show the target model from guide chapter to supporting content.
  5. `Decision Recommendation`: Make Healthy Eating a canonical guide, with clinical topics handled by authority pages.
  6. `Next Steps`: Test the chapter model against the captured Healthy Eating content and one adjacent condition journey.

## Test Narrative Draft Notes
- Do say: `content breadth is real, but the organizing logic does not feel canonical`.
- Do say: `a companion helps people understand where they are, what matters now, what to do next, and how one topic connects to another`.
- Do say: `Healthy Eating should work like a short course or handbook`.
- Do say: `support content should serve a specific step`.
- Do not say: `Top 18 Areas of Focus`.
- Do not show the focus-area classification table.
- Do not let the test become a taxonomy exercise about all AHA priorities.
- Keep the test anchored in the Healthy Eating guide-system problem.
