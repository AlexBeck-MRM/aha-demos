---
status: working
project_id: aha-website-refresh
owner: design-brain
last_reviewed: 2026-05-01
source_refs:
  - design/routes/homepage-structure.md
  - design/ui-style-inventory/wireframe-style.md
  - knowledge/distilled/canonical-brief.md
  - knowledge/sources/experience-insights-mergers/hypotheses-and-conclusions.md
decision_refs:
  - ROUTE-001
  - ROUTE-002
  - ROUTE-003
---

# Homepage Annotated Wireframe V2

## Direction
Create a homepage that reads as a clean guided overview. The page should feel simple, modern, useful, and clearly AHA: floating nav, generous white space, modular sections, a curated top, a personalized middle, warm story moments, and a full-bleed red heartbeat close.

The design rule is strict: each viewport should have one job, one main action at most, and no more than three information units. The page can be visually rich, but it should never ask the user to think too hard before taking the next step.

## Board Annotations
Use these as numbered callouts on the wireframe image.

| No. | Callout | Meaning |
| --- | --- | --- |
| 1 | `1 job per view` | Each viewport has one primary purpose. |
| 2 | `1 main CTA` | Only one action should visually lead in any viewport. |
| 3 | `3 info units max` | No viewport should show more than three separate ideas. |
| 4 | `plain words` | Labels should be short and easy to understand. |
| 5 | `curated first` | The top of the page is intentionally selected by AHA. |
| 6 | `personalized next` | The middle of the page adapts through filters and a drawer. |
| 7 | `motion explains` | Scroll animation should pace attention, not decorate. |
| 8 | `red close` | Red becomes immersive only at the bottom heartbeat moment. |

## Viewport Stack
### 1. Mission hero
**User sees:** floating nav, warm human visual placeholder, short mission statement, one CTA.

**Information units:** mission, visual, mission/vision link.

**CTA:** `See our mission`.

**Annotation:** `No stats yet. First arrival is meaning, not proof.`

**Motion:** hero content fades up once; nav floats above the page.

### 2. Quick links
**User sees:** three large cards: `Find health guidance`, `Give or get involved`, `For professionals`.

**Information units:** three equal route cards.

**CTA:** none; cards are the choices.

**Annotation:** `Three doors, no menu overload.`

**Motion:** cards rise in a soft stagger on scroll.

### 3. Mission proof
**User sees:** one large mission sentence with two stat/proof placeholders.

**Information units:** large mission line, proof block one, proof block two.

**CTA:** `Learn how we help`.

**Annotation:** `Stats come after the mission is understood.`

**Motion:** large text activates first, proof blocks follow.

### 4. Donation module
**User sees:** one donation panel with three simple choices: `Give once`, `Give monthly`, `Give in honor`.

**Information units:** three donation options.

**CTA:** `Choose a way to give`.

**Annotation:** `Explain giving before asking for money.`

**Motion:** option tiles settle into place; CTA stays stable.

### 5. Personalized controls
**User sees:** a large guidance module with three controls: `I am...`, `I want to...`, `Topic`.

**Information units:** three filters.

**CTA:** none if filters update automatically; otherwise `Show my guide`.

**Annotation:** `This should feel like an expanded menu, not a form.`

**Motion:** selected filter state changes clearly and quickly.

### 6. Personalized drawer
**User sees:** one open drawer with a recommended next step, up to three relevant links, and one supporting story, tool, or guide.

**Information units:** recommendation, links, support object.

**CTA:** `Start here`.

**Annotation:** `Personalized, but still edited.`

**Motion:** drawer expands without a layout jump.

### 7. Scroll story text
**User sees:** one oversized sentence at a time, paired with a visual placeholder.

**Information units:** phrase, visual, small label.

**CTA:** none.

**Annotation:** `Use motion to reduce load, not add it.`

**Motion:** words activate as the user scrolls; visuals alternate between photo, icon, and illustration placeholders.

### 8. Human story
**User sees:** a warm story card with a large image placeholder and one action.

**Information units:** story headline, visual, action.

**CTA:** `Read the story`.

**Annotation:** `Warmth comes from a real story, not sentiment.`

**Motion:** image and story text reveal together.

### 9. Red heartbeat close
**User sees:** full-bleed red background, subtle heartbeat line, one closing statement, one CTA.

**Information units:** statement, heartbeat, action.

**CTA:** `Take the next step`.

**Annotation:** `This is the brand crescendo.`

**Motion:** heartbeat line draws once on scroll; static fallback for reduced motion.

### 10. Open footer
**User sees:** Apple-like open footer with grouped links, social/support utilities, legal/accessibility links.

**Information units:** footer groups, utilities, legal/accessibility.

**CTA:** none.

**Annotation:** `Recovery, not another campaign module.`

**Motion:** no decorative motion; mobile groups can collapse into accordions.

## Visual Mix
- Use photography placeholders for story and human proof.
- Use illustration placeholders for mission support and guidance.
- Use icon placeholders for quick links, donation choices, and filters.
- Use stat blocks only after the first viewport.
- Use large type for scroll storytelling.
- Use full-bleed red only at the heartbeat close.

## Interaction Standards
- Sticky nav must not cover content or create visual noise.
- Drawer interactions should be fast and predictable.
- Scroll text should work without relying on sound, video, or autoplay.
- Reduced-motion users should see static section states.
- Mobile should keep the same sequence but stack each viewport into one main idea.
- The page should protect performance: avoid heavy scroll scripts and keep interaction feedback immediate.

## Image-Generation Prompt
```text
Use case: ui-mockup
Asset type: annotated low-fidelity homepage wireframe
Primary request: Create a tall annotated homepage wireframe for the American Heart Association refresh. Use the provided gray wireframe screenshot as the style reference: white-first canvas, floating nav, soft gray placeholders, rounded tactile modules, light depth, and small AHA-red accents.
Composition: show a full vertical homepage with clear viewport bands. Each viewport should feel spacious and show one main idea.
Annotation system: use small numbered callout bubbles from 1 to 8 with thin leader lines. Keep annotation text minimal and place most notes in a side legend.
Header: floating pill nav with AHA logo, Health Guide, Get Involved, Professionals, About Us, Donate, and search.
Viewport 1: mission and vision hero, human visual placeholder, one CTA "See our mission", no stats.
Viewport 2: three quick-link cards: Find health guidance, Give or get involved, For professionals.
Viewport 3: mission proof section with one large text block and two stat placeholders.
Viewport 4: donation module with three option tiles: Give once, Give monthly, Give in honor, and one CTA.
Viewport 5: personalized content controls with three filters: I am, I want to, Topic.
Viewport 6: large expanded drawer with one recommended next step, three links, and one supporting story/tool placeholder.
Viewport 7: scroll storytelling section with oversized text and alternating photo, icon, and illustration placeholders.
Viewport 8: human story section with large photography placeholder and one CTA.
Viewport 9: full-bleed AHA-red heartbeat closing section with subtle heartbeat line and one CTA.
Viewport 10: open Apple-like footer with grouped columns.
Visual style: grayscale wireframe, subtle shadows, soft corners, generous vertical spacing, minimal text, readable key labels only.
Avoid: high-fidelity final UI, stock-photo realism, dense article grids, popups, fake statistics, cluttered annotations, heavy red above the final close, decorative gradients, and overlapping text.
```
