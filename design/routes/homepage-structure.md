---
status: working
project_id: aha-website-refresh
owner: design-brain
last_reviewed: 2026-05-01
source_refs:
  - knowledge/distilled/canonical-brief.md
  - knowledge/sources/discovery-playback/master-playback-notes.md
  - knowledge/sources/discovery-playback/technology-playback-notes.md
  - knowledge/sources/current-site-audit/aha-current-site-observations.md
  - knowledge/sources/experience-insights-mergers/hypotheses-and-conclusions.md
  - design/routes/route-comparison.md
  - design/routes/route-deltas.md
  - design/ui-style-inventory/first-load.md
  - design/ui-style-inventory/nav-elements.md
  - design/ui-style-inventory/cards.md
  - design/ui-style-inventory/search.md
  - design/ui-style-inventory/wireframe-style.md
decision_refs:
  - ROUTE-001
  - ROUTE-002
  - ROUTE-003
---

# Homepage Structure

## Working Read
The homepage should feel like a clean guided overview, not a showpiece and not a directory. It needs to explain who the American Heart Association is, help people find relevant guidance, and nudge action without forcing people to process too much at once.

The page should be simple enough to read at roughly a fourth-grade comprehension level: short labels, plain verbs, clear choices, and one obvious next step per moment. The design can still be modern, modular, beautifully spaced, and visually rich; the simplicity is in the decision load, not in the craft.

The current wireframe style remains the right base: white-first canvas, floating navigation, restrained grayscale modules, soft depth, and strategic AHA red. The new structure should expand that into a full-page wireframe language with clear viewport beats, scroll storytelling, personalized content, donation clarity, and a red full-bleed closing moment.

## How To Use This Draft
This structure is a starting scaffold, not the final homepage recommendation. Use it to hold the conversation in place while we add or replace modules based on the team's homepage wishes.

The consolidation rule is simple: if a wish changes what the homepage must say or prioritize, update the module sequence here. If a wish changes how the wireframe should look or behave as a planning artifact, update `design/ui-style-inventory/wireframe-style.md`.

## Homepage Jobs
- State the mission and vision clearly in the hero.
- Keep every viewport low-load: one main action, and no more than three information units.
- Use curated content at the top, then personalized content lower down.
- Make quick links feel useful and immediate.
- Explain ways to donate simply without turning the first screen into a fundraising page.
- Create warmth through real story moments, not generic sentiment.
- Use photography, illustration, iconography, stats, and large type as different kinds of meaning.
- Close with a full-bleed red heartbeat moment that feels unmistakably AHA.

## Viewport Contract
- Each viewport gets one main job.
- Each viewport can have one main CTA at most.
- Each viewport can show no more than three separate pieces of information.
- Short labels should do the work before longer copy appears.
- Important content should be revealed in steps, not all at once.
- Motion should clarify sequence, not decorate the page.
- Donation can remain in the global nav, but it should not visually compete with the active page CTA.
- Stats should not appear in the first arrival viewport. They can support the mission once the user already understands the page.

## Wireframe Structure
### 0. Floating navigation
- Keep the nav spatial and detached from the browser edge.
- Use the current top-level labels as the working set: `Health Guide`, `Get Involved`, `Professionals`, `About Us`.
- Keep `Donate` as a distinct red pill utility, but smaller than any active in-page CTA.
- Keep search visually separate from the nav group.
- On scroll, compress the nav into a calmer sticky state.

### 1. Viewport 1: mission and vision hero
- Purpose: say who AHA is and why the site exists.
- Information units:
  - mission statement
  - human visual placeholder
  - mission and vision link
- Main CTA: `See our mission`.
- Wireframe behavior: floating nav above a spacious hero; left visual placeholder, right mission copy, one button.
- Scroll behavior: hero copy fades up once; no stats in the first viewport.

### 2. Viewport 2: quick links
- Purpose: give people three simple routes without asking them to parse the whole ecosystem.
- Information units:
  - `Find health guidance`
  - `Give or get involved`
  - `For professionals`
- Main CTA: none; the three cards are equal route choices.
- Wireframe behavior: three large tactile cards, each with a tiny icon or image placeholder.
- Scroll behavior: cards rise in sequence, one row only.

### 3. Viewport 3: mission proof and stats
- Purpose: support the hero with proof after people understand the mission.
- Information units:
  - one large mission sentence
  - one stat/proof block
  - one stat/proof block
- Main CTA: `Learn how we help`.
- Wireframe behavior: large text on one side, two proof blocks on the other.
- Content rule: use real approved stats later; until then, mark them as placeholders.

### 4. Viewport 4: donation module
- Purpose: explain ways to donate clearly and calmly.
- Information units:
  - `Give once`
  - `Give monthly`
  - `Give in honor`
- Main CTA: `Choose a way to give`.
- Wireframe behavior: one donation panel with three simple option tiles and one red button.
- Tone rule: explain the ways to donate before asking for money.

### 5. Viewport 5: personalized content controls
- Purpose: shift from curated overview to user-shaped guidance.
- Information units:
  - `I am...`
  - `I want to...`
  - `Topic`
- Main CTA: none if filters update automatically; otherwise `Show my guide`.
- Wireframe behavior: three simple filters at the top of a large personalized module.
- Interaction rule: the controls should feel like an expanded visual menu, not a form.

### 6. Viewport 6: personalized drawer
- Purpose: show relevant links and substructure based on the three filters.
- Information units:
  - recommended next step
  - three relevant links
  - supporting story, tool, or guide
- Main CTA: `Start here`.
- Wireframe behavior: one large drawer opens under the filters with a clear title, content cluster, and supporting visual.
- Interaction rule: drawer transitions should be smooth and fast, with no layout jump.

### 7. Viewport 7: scroll storytelling
- Purpose: create emotional rhythm without adding cognitive load.
- Information units:
  - one large sentence
  - one visual moment
  - one small supporting label
- Main CTA: none, unless the story connects to a single next step.
- Wireframe behavior: oversized text activates on scroll, paired with alternating photography, iconography, or illustration placeholders.
- Motion rule: reveal one phrase at a time; respect reduced-motion settings.

### 8. Viewport 8: story and warmth
- Purpose: make the organization feel human and specific.
- Information units:
  - story headline
  - story visual
  - related action or link
- Main CTA: `Read the story`.
- Wireframe behavior: large photo placeholder with a simple story card, not a busy testimonial carousel.

### 9. Viewport 9: red heartbeat close
- Purpose: create an ownable AHA ending before the footer.
- Information units:
  - large closing statement
  - heartbeat background line
  - one next-step CTA
- Main CTA: `Take the next step`.
- Wireframe behavior: full-bleed AHA-red background with a subtle oversized heartbeat line behind the content.
- Motion rule: heartbeat can draw on scroll once; do not loop aggressively.

### 10. Viewport 10: open footer
- Purpose: support recovery and broad browsing without feeling like a dense site map.
- Information units:
  - grouped footer columns
  - social/support utilities
  - legal and accessibility links
- Main CTA: none.
- Wireframe behavior: open Apple-like footer structure with clear groups, lots of spacing, and accordion behavior on mobile.

## Personalized Content Drawer
- Filter 1: `I am...`
  - examples: `Learning for myself`, `Helping someone`, `A health professional`, `A supporter`
- Filter 2: `I want to...`
  - examples: `Understand my health`, `Build healthy habits`, `Act in an emergency`, `Help the mission`
- Filter 3: `Topic`
  - examples: `Blood pressure`, `CPR`, `Healthy eating`, `Heart conditions`
- Drawer structure:
  - one recommended next step
  - up to three links
  - one supporting story, tool, or guide
  - optional secondary route into full search or browse
- Language rule: labels should sound like plain user intent, not taxonomy.

## Scroll And Motion Notes
- Use scroll animation to pace attention, not to create spectacle.
- Large text can activate on scroll as a storytelling device between dense modules.
- Filter drawer changes should use opacity, vertical reveal, and simple state changes.
- The floating nav should compress on scroll and stay stable.
- The heartbeat line should appear once in the red closing section.
- Respect reduced-motion settings with static equivalents.
- Keep animations performant with transform and opacity where possible.

## Route Emphasis
### Shared base
- The first screen stays quiet, white, and clear.
- The page uses a strict viewport load rule.
- The top is curated; the middle becomes personalized.
- Donate is explained in its own module, not forced into the hero.
- Search and filters are treated as guidance, not utilities afterthoughts.
- The bottom closes with an AHA-red heartbeat moment.

### Route A
- Make the hero more human and editorial.
- Let storytelling sections feel warmer and more image-led.
- Give the large scroll text a little more emotional cadence.
- Keep the personalized drawer structurally clear so warmth does not reduce usefulness.

### Route B
- Make the hero more direct and system-legible.
- Make filters, drawers, quick links, and donation options more precise.
- Keep cards tighter and more grid-disciplined.
- Use professional resources and mission proof as authority cues without adding clutter.

## What Not To Do
- Do not open with a donation modal or heavy donation pressure.
- Do not stack sub-brands, campaign messages, and proof points in the hero.
- Do not use a generic article feed as the main homepage body.
- Do not make personalized content feel like a questionnaire.
- Do not show more than three ideas in one viewport.
- Do not hide guidance behind clever labels.
- Do not make the page feel like institutional navigation with a prettier skin.

## Image-Generation Brief
Use this once the structure is ready to turn into a visual.

```text
Use case: ui-mockup
Asset type: low-fidelity homepage wireframe concept for the American Heart Association website refresh
Primary request: Create a tall, white-first homepage wireframe based on the provided mock-up reference. Keep the composition calm, modern, tactile, and grayscale, with only a small AHA-red accent for the logo and Donate button.
Input image: Use the attached wireframe screenshot as the composition and fidelity reference, not as an exact layout to copy.
Canvas: tall portrait website page, desktop-width content scaled into a vertical artboard, generous blank lower-page space filled with structured homepage modules.
Style: low-fidelity but polished wireframe, soft gray content blocks, floating pill navigation, light depth, rounded tactile cards, restrained AHA healthcare design language.
Header: floating nav centered near the top with AHA logo, Health Guide, Get Involved, Professionals, About Us, small red Donate pill, and a separate search control.
Hero: first viewport mission and vision hero, one human visual placeholder, one main CTA labeled See our mission, no stats in the first viewport.
Quick links: second viewport with three tactile cards labeled Find health guidance, Give or get involved, For professionals.
Mission proof: third viewport with one large mission sentence and two stat/proof placeholders.
Donation: simple ways-to-donate module with three option tiles, Give once, Give monthly, Give in honor, and one CTA.
Personalization: three-filter module labeled I am, I want to, Topic, with a large expanded drawer underneath showing one recommended next step, three links, and one supporting story/tool placeholder.
Storytelling: scroll-activated large text section with alternating placeholders for photography, iconography, and illustration.
Closing: full-bleed AHA red bottom section with a subtle heartbeat line in the background and one main CTA.
Footer: open Apple-like footer structure with grouped columns and generous spacing.
Annotations: include numbered annotation bubbles and short side notes for viewport rules, motion behavior, and information count.
Text handling: keep only key labels readable; represent body copy as gray bars.
Avoid: high-fidelity stock photography, busy campaign graphics, dark backgrounds except the final red close, heavy red saturation above the close, gradients, decorative blobs, dense article grids, popups, overlapping text, fake statistics, and generic healthcare clip art.
```

## Open Questions
- Which approved mission and vision language should appear in the hero?
- Which three donation options are strategically correct for AHA?
- Which default personalized drawer state should appear before a user changes filters?
- Which real stats can be used in the mission proof section?
- Should the quick links include search, or should search stay in the nav and personalized module?
