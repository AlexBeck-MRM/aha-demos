---
project_id: aha-website-refresh
id: aha-healthy-eating-guide-narrative-rationale
title: Healthy Eating Guide Narrative Rationale
category: slide-narrative-source
source:
  - user-pasted-thread-summary-2026-04-29
  - knowledge/distilled/canonical-brief.md
  - knowledge/sources/current-site-audit/healthy-eating-topic-network-2026-04-29.md
  - knowledge/sources/current-site-audit/healthy-living-guide-system-high-fidelity-2026-04-28.md
  - knowledge/sources/current-site-audit/health-condition-authority-structure-2026-04-27.md
  - knowledge/sources/current-site-audit/high-blood-pressure-authority-page-proposal-2026-04-20.md
  - user-provided-healthy-eating-figma-screenshots-2026-04-29
  - https://developers.google.com/search/docs/fundamentals/creating-helpful-content
  - https://developers.google.com/search/docs/fundamentals/seo-starter-guide
  - https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
  - https://developers.google.com/search/blog/2025/05/succeeding-in-ai-search
  - https://www.nngroup.com/videos/mobile-images/
status: working
last_updated: 2026-04-29
---

# Healthy Eating Guide Narrative Rationale

## Purpose
- Provide the rationale source for the AHA health-information guide narrative test.
- Keep this narrative separate from the future AHA Figma slides skill.
- Exclude the `Top 18 Areas of Focus` rearrangement topic from the test story.
- Use Healthy Eating as the worked example after the wider Conditions and Healthy Living guide system is introduced.

## Core Frame
AHA has the trust, depth, and breadth to be the clearest guide for heart health. The core challenge is structural: the current site often behaves like a repository, asking people to navigate legacy groupings, campaign labels, content buckets, and internal structures before they can understand what matters.

The redesign opportunity is to turn AHA's strongest content areas into canonical learning and action experiences. A companion helps people understand where they are, what matters now, what to do next, and how one topic connects to another.

## Evidence Basis
- The canonical ambition is `a trusted companion that empowers every person on their journey`.
- The current Healthy Eating capture found `221` captured HTML pages:
  - `218` pages in the AHA Healthy Eating branch
  - `3` representative recipe pages
  - `344` in-scope link targets
- The Healthy Eating branch is not a small hub with a few leaves.
- Current branches mix different kinds of things:
  - `Eat Smart`
  - `Cooking Skills`
  - `Add Color`
  - `Heart-Check Foods`
  - `Losing Weight`
  - recipes
  - tools
  - article collections
  - practical support
  - clinical-adjacent goals
- The high-fidelity Healthy Living direction already proposes:
  - directional Super Hub
  - evergreen Guide
  - linked Article, Resource, Recipe, Tool, Video, or Infographic
- User-provided screenshots show the Healthy Eating page set zoomed out as a dense wall of pages, with repeated page shells, repeated sign-up bands, repeated footer/donation moments, and similar feature modules appearing across many pages.
- Archived screenshot assets for this narrative:
  - `reference/slides/healthy-eating-narrative-assets/healthy-eating-pages-zoomed-out.jpg`
  - `reference/slides/healthy-eating-narrative-assets/healthy-eating-pages-landscape.jpg`
  - `reference/slides/healthy-eating-narrative-assets/healthy-eating-pages-detail.jpg`

## Problem Statement
The content breadth is real. The organizing logic needs a more canonical shape.

Healthy Eating contains strong, useful material. The current structure needs clearer separation between evergreen guide material, editorial content, tools, recipes, programs, and resources. Users can find pages. The next step is a more teaching-led system.

## Page Volume And Noise Hypothesis
The screenshots strengthen the premise that the issue includes navigation depth and the overall feeling of the page system.

Working hypothesis:
- Some granular pages are useful because they answer a distinct user intent.
- Some granular pages may be spreading one journey across too many stops.
- Repeated banners, repeated sign-up modules, repeated footer/donation moments, and generic image-led shells can make separate pages feel less intentional.
- When pages share the same job, the same modules, or very similar answers, the experience can start to feel like content noise rather than guidance.
- The goal is fewer dead ends, fewer duplicate decision points, and clearer canonical topic homes.

Modern SEO guidance supports this as a UX-led hypothesis. Page count by itself is a weak measure. Google Search Central emphasizes helpful, reliable, people-first content, unique value, clear page experience, and canonical treatment for duplicate or similar URLs. In practical terms: keep a granular page when it has a distinct purpose and enough substance; consolidate, redirect, or attach it to a guide when it fragments the same user question.

## SEO And Modern Content-Practice Support
- Google's people-first content guidance asks whether a reader leaves feeling they have learned enough to achieve their goal. That supports pages with a clear job, not page count as an end in itself.
- Google's SEO Starter Guide emphasizes easy-to-read, well-organized, unique, up-to-date, helpful, reliable content. That supports stronger guide pages over fragmented near-duplicates.
- Google's AI Search guidance emphasizes unique, valuable content for people and warns that strong content can still disappoint when the page is cluttered, difficult to navigate, or makes main information hard to find.
- Google's canonical guidance explains why similar or duplicate URLs should resolve around a preferred canonical page: clearer search results, cleaner metrics, and better crawl focus.
- Nielsen Norman Group's content and mobile guidance supports the same direction from a UX perspective: images and modules should add informational value, and findability depends on IA, category names, navigation, links, page design, and content quality.

This gives the narrative a stronger client-facing frame:

```text
Collection of related pages -> Guide

Scattered guidance makes users do the organizing work themselves.
A guide gives the information a center, a sequence, and a next step.
```

## Direction
Healthy Eating should become a proper guide, like a short course or handbook.

Recommended guide arc:
1. Start here: what heart-healthy eating means
2. Build your everyday plate
3. Choose foods with confidence
4. Plan, shop, cook, and store
5. Adjust the big levers: sodium, sugar, fats, fiber, alcohol
6. Make it work in real life
7. Eat for a health goal
8. Recipes, tools, programs, and sources

The guide should become the canonical learning destination. Articles, recipes, tools, videos, infographics, and program content should support specific steps inside the guide instead of competing as peer navigation items.

## System Logic
Use three clear jobs inside the wider AHA information system:

```text
Condition page:
What is happening, what does it mean, what should I do?

Healthy Living guide:
How do I build the habits that support my health over time?

Support content:
Here is the article, recipe, infographic, tool, program, or video that helps with this specific step.
```

## Conditions And Healthy Living Models
The guide idea applies across both major health-information families, with different structures for different user needs.

Health Conditions:
- Purpose: help someone understand a condition, recognize urgency, interpret symptoms, understand diagnosis and treatment, and live with the condition over time.
- Existing rationale: the condition-authority work defines a repeatable six-part structure:
  - `Overview`
  - `Symptoms`
  - `Causes`
  - `Diagnosis`
  - `Treatment`
  - `Living with it`
- The parent condition page acts as the complete guide.
- Specialist pages remain available as deeper rooms reached from the relevant chapter.
- The high blood pressure proposal supports this direction by moving from a `41` page first-hop network toward a `1 + 6` authority-page model.

Healthy Living:
- Purpose: help someone build habits, routines, and practical confidence over time.
- Existing rationale: the Healthy Living guide-system work defines a directional Super Hub, evergreen Guides, and supporting articles, resources, recipes, tools, videos, and infographics.
- The Healthy Eating guide model works like a short course or handbook:
  - start here
  - build the habit
  - choose with confidence
  - plan and prepare
  - adjust the levers
  - make it last
  - connect to goals
  - tools and sources

Shared principle:
- Canonical structure lowers the work of understanding.
- Stable chapters help users build a mental model, compare topics, and return with less effort.
- Supporting content earns its place by helping a specific step in the journey.

## Slide Narrative Arc
1. AHA has depth, but the current structure reads like a repository.
2. The companion ambition requires guided learning and action.
3. Healthy Eating proves the issue: valuable content is spread across mixed organizing buckets.
4. The target model is a guide with linked support content, not another hub layer.
5. The recommendation is to make Healthy Eating the canonical guide and let clinical authority pages remain the home for clinical topics.
6. The next test is to map captured Healthy Eating content into the proposed guide chapters and check one adjacent condition journey.

## Revised Client-Facing Narrative Arc
1. We are solving how AHA health information becomes easier to understand and act on.
2. AHA has enormous depth, but trusted information can still feel hard to use when it is scattered.
3. Healthy Eating shows the problem at human scale: 218 captured AHA pages plus recipe samples.
4. More pages do not automatically create more clarity.
5. Repetition across shells, banners, sign-ups, and similar page jobs creates noise and cognitive load.
6. The goal is not fewer pages. The goal is fewer dead ends.
7. Search and UX point in the same direction: make pages helpful, people-first, clearly organized, and meaningfully distinct.
8. Turn a collection of related pages into one canonical guide.
9. Keep support content, but attach it to the chapter where it helps.
10. For users, this reduces hunting and builds confidence.
11. For AHA, this makes authority easier to see, govern, update, and connect to action.
12. Prove it by mapping simple, practical, and goal-based nutrition questions against the current path.

## Revised Wider Narrative Arc V6
1. AHA can turn health information into a clearer guidance system.
2. People come to AHA with questions, decisions, and next steps.
3. The information system has two main guide families:
   - Conditions
   - Healthy Living
4. Conditions help people understand what is happening, what it means, and what action matters next.
5. Healthy Living helps people build habits and routines that support health over time.
6. AHA priority areas should become durable guide homes with one clear place to start.
7. Each priority guide needs a promise, a sequence, related resources, and a clear next action.
8. The repeatable guide model is:
   - orient
   - prioritize
   - act
   - deepen
   - connect
9. Healthy Eating becomes the worked example inside the wider guide system.
10. Healthy Eating sits in Healthy Living and connects to condition priorities such as blood pressure, cholesterol, diabetes, CKM health, prevention, and weight management.
11. Healthy Eating makes the structure problem visible because the captured page set is large, repetitive, and spread across mixed content jobs.
12. The next proof is a question-path test across Conditions and Healthy Living.

## Language Guardrail
- Avoid contrastive phrasing in client-facing slide copy.
- Do not use the common pattern `not this, but that`.
- State the positive direction directly.
- Use the simplest version of the claim first, then support it with evidence.

## Visual Guardrail
- Use red outline and red text for selected cards or highlighted items.
- Keep the card interior white.
- Avoid pale red fills for highlighted content cards; they feel heavy and reduce the clarity of the slide system.

## Do Not Include
- Do not include the `Top 18 Areas of Focus` rearrangement topic.
- Do not show the focus-area classification table.
- Do not make the deck about all AHA priorities.
- Do not make the argument depend on a complete taxonomy of the site.

## Use In Figma Test
- Use this document as the content source for the six-slide narrative.
- Keep the copy minimal.
- Prefer clear claims over long explanations.
- Use source numbers only where they sharpen the argument.

## Figma Test Output
- File: `AHA---Slide-Template`
- Page: `[AI dropzone]`
- Page node: `132:2`
- Layout:
  - Missing template slides on row `y=0`
  - Narrative slides on row `y=1400`
  - Horizontal slide gap: `100px`
- Narrative slides:
  - `Narrative 01 - Repository Problem`: `132:146`
  - `Narrative 02 - Companion Ambition`: `132:160`
  - `Narrative 03 - Healthy Eating Evidence`: `132:177`
  - `Narrative 04 - Target Content Model`: `132:209`
  - `Narrative 05 - Recommendation`: `132:239`
  - `Narrative 06 - Next Steps`: `132:264`
- Validation:
  - `6` narrative slides created
  - all narrative gaps validated as `100px`
  - no text-node slide-bound overflow found
- Runtime note:
  - `MW Sans` could not be loaded by the Figma plugin runtime
  - edited text nodes use `AR One Sans` fallback for this first test
  - frame structure, layout, spacing, colors, and source slide sizing were preserved

## Figma Test Output V3
- Purpose:
  - make the argument broader than Healthy Eating
  - use Healthy Eating as the worked example
  - persuade stakeholders through a clearer topic-system story
- Page: `[AI dropzone]`
- Row: `y=4200`
- Horizontal slide gap: `100px`
- Narrative slides:
  - `Narrative v3 01 - Bigger Than Healthy Eating`: `137:128`
  - `Narrative v3 02 - Not Mini Sites`: `137:142`
  - `Narrative v3 03 - Topic Portfolio Overview`: `137:156`
  - `Narrative v3 04 - Jobs By Topic Type`: `137:192`
  - `Narrative v3 05 - Healthy Eating Proof Case`: `137:217`
  - `Narrative v3 06 - Mixed Jobs In Example`: `137:246`
  - `Narrative v3 07 - Guide Principle`: `137:278`
  - `Narrative v3 08 - Repeatable Model`: `137:292`
  - `Narrative v3 09 - Recommendation`: `137:322`
  - `Narrative v3 10 - Next Proof`: `137:347`
- Validation:
  - `10` narrative slides created
  - all row gaps validated as `100px`
  - no text-node slide-bound overflow found
- Narrative adjustment:
  - lead with the full priority-topic system problem
  - state that AHA does not need disconnected topic mini-sites
  - show topic jobs at a high level
  - then use Healthy Eating as the proof case
  - keep Healthy Eating as an example, not the whole argument

## Figma Test Output V4
- Purpose:
  - start at the real project topic
  - explain that the work is about making AHA health information easier to grasp
  - connect the narrative to the repo-backed repository-to-companion shift
  - frame the core problem as a structure, wayfinding, and mental-model problem
  - use Healthy Eating only after the canonical information model is established
- Page: `[AI dropzone]`
- Row: `y=5600`
- Horizontal slide gap: `100px`
- Narrative slides:
  - `Narrative v4 01 - What We Are Looking At`: `146:68`
  - `Narrative v4 02 - Core Problem`: `146:82`
  - `Narrative v4 03 - Repository To Companion`: `146:96`
  - `Narrative v4 04 - Volatile Structures`: `146:113`
  - `Narrative v4 05 - Canonical Principle`: `146:127`
  - `Narrative v4 06 - Topic Homes`: `146:141`
  - `Narrative v4 07 - User Mental Model`: `146:166`
  - `Narrative v4 08 - Healthy Eating Example`: `146:196`
  - `Narrative v4 09 - Recommendation`: `146:225`
  - `Narrative v4 10 - Proof Plan`: `146:250`
- Validation:
  - `10` narrative slides created
  - all row gaps validated as `100px`
  - no text-node slide-bound overflow found
- Narrative adjustment:
  - lead with `How AHA health information becomes easier to grasp`
  - define the problem as trusted information still feeling hard to use
  - connect to the documented shift from passive repository to trusted companion
  - call out campaign-like and volatile structures as a trust problem
  - define canonical topic experiences before showing Healthy Eating
  - use Healthy Eating as the first worked example and proof case

## Figma Test Output V5
- Purpose:
  - add the page-volume/noise hypothesis to the narrative
  - include centered white statement slides for strong client-facing claims
  - make the story about moving from scattered pages to canonical guides
  - keep the SEO point careful: distinct helpful pages are valuable; thin, duplicate, or competing pages should be consolidated or contextualized
- Page: `[AI dropzone]`
- Row: `y=7000`
- Horizontal slide gap: `100px`
- Narrative slides:
  - `Narrative v5 01 - What We Are Solving`: `158:128`
  - `Narrative v5 02 - Healthy Eating Zoomed Out`: `158:140`
  - `Narrative v5 03 - More Pages More Clarity`: `158:969`
  - `Narrative v5 04 - Repetition Creates Noise`: `158:982`
  - `Narrative v5 05 - Fewer Dead Ends`: `158:1053`
  - `Narrative v5 06 - Search Also Rewards Usefulness`: `158:1066`
  - `Narrative v5 07 - Collection To Guide`: `158:1089`
  - `Narrative v5 08 - Guide As Structure`: `158:1102`
  - `Narrative v5 09 - Content Work`: `158:1137`
  - `Narrative v5 10 - User Advantage`: `158:1160`
  - `Narrative v5 11 - AHA Advantage`: `158:1179`
  - `Narrative v5 12 - Test With Questions`: `158:1198`
- Validation:
  - `12` narrative slides created
  - all row gaps validated as `100px`
  - no text-node slide-bound overflow found
  - visual review caught and fixed the slide 04 hypothesis callout collision
- Runtime note:
  - Local screenshot import into Figma was blocked because the runtime supported neither `createImageAsync` nor `fetch`
  - The screenshots are archived as repo evidence assets
  - The Figma row uses editable reconstructed page-wall visuals instead of embedded screenshot bitmaps

## Figma Test Output V6
- Purpose:
  - shift the opening from Healthy Eating to the wider AHA information system
  - frame Conditions and Healthy Living as the two main guide families
  - align guide homes to AHA priorities and what AHA wants to be known for
  - use Healthy Eating as the worked example after the guide-system idea is established
  - remove contrastive phrasing from generated slide copy
- Page: `[AI dropzone]`
- Row: `y=8400`
- Horizontal slide gap: `100px`
- Narrative slides:
  - `Narrative v6 01 - Information System Opportunity`: `163:200`
  - `Narrative v6 02 - Guided Path`: `163:212`
  - `Narrative v6 03 - Conditions And Healthy Living`: `163:225`
  - `Narrative v6 04 - Clear Place To Start`: `163:242`
  - `Narrative v6 05 - Priority Guide Homes`: `163:255`
  - `Narrative v6 06 - Page Collections To Guides`: `163:286`
  - `Narrative v6 07 - Repeatable Guide Model`: `163:305`
  - `Narrative v6 08 - Healthy Eating As Example`: `163:336`
  - `Narrative v6 09 - Healthy Eating At Scale`: `163:356`
  - `Narrative v6 10 - Organizing Principle`: `163:1185`
  - `Narrative v6 11 - Healthy Eating Guide Structure`: `163:1198`
  - `Narrative v6 12 - System Value`: `163:1233`
  - `Narrative v6 13 - Question Path Test`: `163:1252`
- Validation:
  - `13` narrative slides created
  - all row gaps validated as `100px`
  - no text-node slide-bound overflow found
  - no generated slide text matched `not`, `but`, `rather than`, or `instead`
  - visual review caught and fixed slide 08 card body spacing
  - highlighted cards updated to red outline with white fill
  - slide 06 updated to back the page-count claim with SEO and modern content-practice evidence

## Figma Test Output V7
- Purpose:
  - make the chapter feel like part of a wider presentation that also covers navigation and search
  - start with a red chapter slide
  - use a softer, more storytelling-led tone while keeping evidence and a step-by-step approach
  - use `American Heart` in slide copy instead of the acronym
  - connect Health Conditions and Healthy Living as two related guide families
  - ground Health Conditions in the existing six-part condition authority structure
  - use Healthy Eating as one proof case inside the wider health-information chapter
- Page: `[AI dropzone]`
- Row: `y=9800`
- Horizontal slide gap: `100px`
- Narrative slides:
  - `Narrative v7 01 - Chapter Health Information`: `177:278`
  - `Narrative v7 02 - Real Problem`: `177:292`
  - `Narrative v7 03 - Human Moment`: `177:304`
  - `Narrative v7 04 - Current Pattern`: `177:317`
  - `Narrative v7 05 - Two Guide Families`: `177:329`
  - `Narrative v7 06 - Conditions Canonical Structure`: `177:346`
  - `Narrative v7 07 - Healthy Living Guide Rhythm`: `177:370`
  - `Narrative v7 08 - Shared Principle`: `177:397`
  - `Narrative v7 09 - Evidence Across Topics`: `177:410`
  - `Narrative v7 10 - Modern Content Practice`: `177:427`
  - `Narrative v7 11 - Healthy Eating Proof Case`: `177:450`
  - `Narrative v7 12 - Step By Step Approach`: `177:1279`
  - `Narrative v7 13 - What This Changes`: `177:1305`
  - `Narrative v7 14 - Paired Proof Test`: `177:1325`
- Validation:
  - `14` narrative slides created
  - all row gaps validated as `100px`
  - no text-node slide-bound overflow found
  - no `AHA` acronym found in generated slide text
  - no contrastive phrase hits found
  - no pale-red highlighted card fills found
- Narrative adjustment:
  - lead with the chapter topic: `03 Health Information on American Heart`
  - define the redesign problem as a health-information model problem, not only a visual-design problem
  - show Conditions and Healthy Living as related models with different internal structures
  - use high blood pressure and Healthy Eating as evidence at different scales
  - end with a paired proof test across one condition journey and one Healthy Living journey

## Figma Test Output V9
- Purpose:
  - rebuild the preferred narrative as actual instances of the full-slide components on `Slides Template MASTER`
  - keep the story focused on the broader health-information model across Conditions and Healthy Living
  - use Healthy Eating as the proof case after the wider model is established
  - remove the generated v8 component system and custom reconstructed visual treatment
- Page: `[AI dropzone]`
- Row: `y=11200`
- Horizontal slide gap: `100px`
- Narrative slides:
  - `Narrative v9 01 - Chapter Health Information`: `189:1334`
  - `Narrative v9 02 - Real Problem`: `189:1343`
  - `Narrative v9 03 - Human Moment`: `189:1360`
  - `Narrative v9 04 - Current Pattern`: `189:1374`
  - `Narrative v9 05 - Two Guide Families`: `189:1399`
  - `Narrative v9 06 - Conditions Model`: `189:1448`
  - `Narrative v9 07 - Healthy Living Rhythm`: `189:1480`
  - `Narrative v9 08 - Shared Principle`: `189:1523`
  - `Narrative v9 09 - Evidence Across Topics`: `189:1537`
  - `Narrative v9 10 - Modern Content Practice`: `189:1573`
  - `Narrative v9 11 - Healthy Eating Proof Case`: `189:1602`
  - `Narrative v9 12 - Step By Step Approach`: `189:1619`
  - `Narrative v9 13 - What This Changes`: `189:1644`
  - `Narrative v9 14 - Paired Proof Test`: `189:1669`
- Validation:
  - `14` narrative slides created
  - all slides are top-level component instances
  - all row gaps validated as `100px`
  - no leftover source-copy hits from the slide template
  - no `AHA` acronym hits in generated slide text
  - no contrastive phrase hits
  - no generated v8 components or instances remain on `[AI dropzone]`
- Runtime note:
  - `MW Sans` is still not visible to the Figma plugin runtime
  - editable text overrides use `AR One Sans` for now

## Figma Test Output V10
- Purpose:
  - rebuild the narrative from the new `AI Layout/*` slide masters
  - restore the stronger chunking and substructure from the earlier preferred version
  - use dark page-wall slides for problem scale and page abundance
  - include guide-system structure, question-path diagrams, evidence cards, content-practice rationale, photo-led reasoning, and a wireframe proof slide
- Page: `[AI dropzone]`
- Row: `y=14000`
- Horizontal slide gap: `100px`
- Narrative slides:
  - `Narrative v10 01 - Chapter Health Information`: `197:749`
  - `Narrative v10 02 - Real Problem`: `197:760`
  - `Narrative v10 03 - Human Moment`: `197:772`
  - `Narrative v10 04 - Scope Wall`: `197:784`
  - `Narrative v10 05 - Fragmented Question`: `197:1300`
  - `Narrative v10 06 - Two Guide Families`: `197:1673`
  - `Narrative v10 07 - Conditions Structure`: `197:1690`
  - `Narrative v10 08 - Healthy Living Sequence`: `197:1711`
  - `Narrative v10 09 - Current Question Path`: `197:1735`
  - `Narrative v10 10 - Guide Path`: `197:1758`
  - `Narrative v10 11 - Evidence Cards`: `197:1783`
  - `Narrative v10 12 - Content Practice`: `197:1804`
  - `Narrative v10 13 - Human Reasoning`: `197:1822`
  - `Narrative v10 14 - Guide Mockup`: `197:1844`
  - `Narrative v10 15 - Recommendation`: `197:1870`
  - `Narrative v10 16 - Paired Proof Test`: `197:1888`
- Screenshot contact sheet:
  - `Narrative v10 Screenshots / contact sheet`: `203:1498`
  - `16` exported thumbnails
- Validation:
  - `16` narrative slides created
  - all slides are top-level component instances
  - all row gaps validated as `100px`
  - no text outside slide bounds
  - no text overlaps
  - no likely awkward word-break risks
  - no leftover source-copy hits from the slide template
  - no `AHA` acronym hits in generated slide text
  - no contrastive phrase hits
- Master component follow-up:
  - adjusted statement and dark scope masters to create more vertical breathing room for real copy
  - final master QA found no text overlaps, text-outside-slide issues, or likely awkward word-break risks across the `20` `AI Layout/*` components

## Figma Test Output V11
- Purpose:
  - create a final, tighter problem-to-solution narrative
  - spend less time on the challenge after it is clearly deconstructed
  - spend more time on the solution, page structures, topic organisation, user guidance, and source-of-truth model
  - make the story about improving the user experience and making American Heart easier to trust as the canonical health-information home
- Page: `[AI dropzone]`
- Row: `y=17200`
- Horizontal slide gap: `100px`
- Narrative slides:
  - `Narrative v11 01 - Chapter`: `205:1889`
  - `Narrative v11 02 - Problem Statement`: `205:1900`
  - `Narrative v11 03 - Human Need`: `205:1912`
  - `Narrative v11 04 - Problem Deconstructed`: `205:1924`
  - `Narrative v11 05 - Scope Wall`: `205:1945`
  - `Narrative v11 06 - Solution Statement`: `205:2461`
  - `Narrative v11 07 - Topic Organisation`: `205:2473`
  - `Narrative v11 08 - Condition Structure`: `205:2490`
  - `Narrative v11 09 - Healthy Living Structure`: `205:2511`
  - `Narrative v11 10 - Guided User Path`: `205:2535`
  - `Narrative v11 11 - Solution Visual Guide`: `205:2560`
  - `Narrative v11 12 - Source Of Truth Model`: `205:2586`
  - `Narrative v11 13 - Why It Works`: `205:2613`
- Screenshot contact sheet:
  - `Narrative v11 Screenshots / contact sheet`: `239:2991`
  - `13` exported thumbnails
- Validation:
  - `13` narrative slides created
  - all slides are top-level component instances
  - all row gaps validated as `100px`
  - no text outside slide bounds
  - no text overlaps after the guide mock-up master fix
  - no likely awkward word-break risks
  - no leftover source-copy hits from the slide template
  - no `AHA` acronym hits in generated slide text
  - no contrastive phrase hits
- Master component follow-up:
  - adjusted `AI Layout/15 Wireframe / Guide Page` so longer solution-example titles have more room before the body copy starts
  - rebuilt `AI Layout/11 Diagnostic / Volume Repetition Structure` around three clearer diagnostic factors:
    - `Volume`
    - `Repetition`
    - `Structure`
  - renamed repeated master text fields into semantic slots on:
    - `AI Layout/06 System / Two Guide Families`
    - `AI Layout/08 Structure / Healthy Living Sequence`
    - `AI Layout/10 Journey / Guide Path`
    - `AI Layout/18 Content / Consolidation Canvas`
    - `AI Layout/20 Proof / Paired Journey Test`
  - repopulated v11 slides by semantic slot and parent container name to avoid card-title and card-body mixups
