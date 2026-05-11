---
status: working
project_id: aha-website-refresh
owner: design-brain
last_reviewed: 2026-05-01
source_refs:
  - design/routes/homepage-structure.md
  - design/routes/homepage-annotated-wireframe-v2.md
  - design/ui-style-inventory/wireframe-style.md
  - knowledge/distilled/canonical-brief.md
  - knowledge/sources/experience-insights-mergers/hypotheses-and-conclusions.md
decision_refs:
  - ROUTE-001
  - ROUTE-002
  - ROUTE-003
  - ROUTE-004
---

# Homepage Route Wireframes

## Scope
These two routes apply only to the homepage and main navigation. They share the same page spine and viewport contract, but they should feel like different homepage experiences.

## Shared Spine
- Floating navigation.
- Mission and vision hero.
- Three quick links.
- Mission proof and stats after the first viewport.
- Simple donation module.
- Personalized filters.
- Expanded personalized drawer.
- Scroll storytelling.
- Human story.
- Full-bleed red heartbeat close.
- Open footer.

## Shared Rules
- One job per viewport.
- One main CTA at most.
- Three information units max.
- Fourth-grade-simple labels.
- Top half is curated.
- Middle becomes personalized.
- Red is restrained until the closing heartbeat section.

## Route A: Reassuring Guide
### Experience Intent
Route A should make the homepage feel like a calm companion. It should be warm, accessible, emotionally steady, and easy to enter for someone who may be worried, uncertain, or helping someone else.

### Main Navigation
- Label set:
  - `Health Guide`
  - `Ways to Help`
  - `For Professionals`
  - `About AHA`
- Search prompt:
  - `What do you need help with?`
- Menu behavior:
  - soft guided paths
  - plain-language user intents
  - fewer visible columns
  - reassuring helper copy
- Menu examples:
  - `Understand symptoms`
  - `Build healthy habits`
  - `Help someone`
  - `Give or volunteer`

### Homepage Behavior
- Hero feels human and reassuring.
- Illustration or photography placeholder is larger and softer.
- Copy hierarchy is gentle: mission first, then one clear action.
- Quick links read like help paths, not system categories.
- Donation module is impact-led and low-pressure.
- Personalized filters use supportive labels.
- Drawer language feels like guidance: `Start with this`.
- Story section carries more warmth and lived experience.
- Scroll text should feel calm and hopeful.
- Red heartbeat close should feel protective and human.

### Wireframe Differences
- More rounded cards.
- More generous vertical spacing.
- Softer gray blocks.
- More human visual placeholders.
- Larger story module.
- Side annotations should call out reassurance and low cognitive load.

### Route A Image Prompt
```text
Use case: ui-mockup
Asset type: annotated low-fidelity homepage wireframe, Route A
Route name: Reassuring Guide
Primary request: Create a tall annotated homepage wireframe for the American Heart Association refresh. Use the attached gray wireframe screenshot as the style reference, but make this route feel warmer, more accessible, and more reassuring.
Scope: homepage and main navigation only.
Shared structure: floating nav, mission hero, three quick links, mission proof, donation module, personalized filters, expanded drawer, scroll storytelling, human story, full-bleed red heartbeat close, open footer.
Viewport rule: each viewport has one job, one main CTA at most, and no more than three information units.
Navigation: floating soft pill nav with AHA logo, Health Guide, Ways to Help, For Professionals, About AHA, small Donate pill, and separate search. Search placeholder says "What do you need help with?"
Hero: warm mission and vision hero with a soft human illustration or photography placeholder, one simple CTA "See our mission", no stats in first viewport.
Quick links: three large rounded cards labeled Find health guidance, Give or get involved, For professionals. Cards should feel like helpful doors.
Mission proof: one large reassuring text block and two stat placeholders, revealed after the hero.
Donation: calm impact-led module with three tiles: Give once, Give monthly, Give in honor, one CTA "Choose a way to give".
Personalization: supportive three-filter area labeled I am, I want to, Topic. The module should feel like a guided helper, not a form.
Drawer: expanded drawer with one recommended next step, three links, and one warm story/tool placeholder. Main CTA "Start here".
Storytelling: large scroll text with soft pacing and warm visual placeholders.
Story: large human story module, more prominent than in Route B.
Close: full-bleed AHA red heartbeat closing section, calm and protective, with one CTA.
Annotations: numbered callouts for low cognitive load, one CTA, three info units, soft guided nav, personalized drawer, red heartbeat close.
Visual style: grayscale wireframe, warm light gray tones, generous white space, soft rounded cards, subtle shadows, small AHA-red accents only until final red close.
Avoid: dense grids, technical dashboard feel, hard-edged systems, heavy red above the final close, busy annotations, fake stats, stock-photo realism, and overlapping text.
```

## Route B: Adaptive Tapestry
### Experience Intent
Route B should make the homepage feel like a smart guidance system that can rebalance around user needs. It should show AHA as useful, confident, and clearly in control of the content mix, but less locked into a permanent homepage sequence.

### Main Navigation
- Label set:
  - `Health`
  - `Act`
  - `Science`
  - `About`
- Search prompt:
  - `Search conditions, CPR, recipes, ways to help`
- Menu behavior:
  - sharper structure
  - visible topic chips
  - quick-task rows
  - light iconography
  - adaptive homepage entry
- Menu examples:
  - `Conditions`
  - `Healthy living`
  - `CPR`
  - `Guidelines`
  - `Donate`

### Homepage Behavior
- First viewport behaves like a curated content tapestry rather than a fixed hero-plus-sections stack.
- Default state still covers the same core homepage content mix: guidance, habits, conditions, stories, proof, and action.
- Tile size and placement show priority and breadth.
- Personalized controls move into a more prominent bottom-of-viewport invitation.
- Customization updates the homepage in place instead of feeling like a separate drawer-first experience.
- Lower-page modules can still resolve into clearer bands for proof, action, story, and red close.
- Red heartbeat close should feel bold, ownable, and kinetic.

### Wireframe Differences
- Less permanent section stacking in the first viewport.
- Free-form tile arrangement with one anchored lead recommendation.
- More visible bottom-of-viewport customization control.
- Smarter mix of featured, utility, and story tiles.
- Sharper component rhythm with enough asymmetry to feel adaptive.
- More assertive annotation rhythm around adaptive behavior.

### Route B Image Prompt
```text
Use case: ui-mockup
Asset type: annotated low-fidelity homepage wireframe, Route B
Route name: Adaptive Tapestry
Primary request: Create a desktop homepage wireframe for the American Heart Association refresh. Use the attached gray smart topic finder screenshot as the style reference, but turn it into a fuller homepage route that feels more adaptive, more configurable, and more clearly curated by AHA.
Scope: homepage and main navigation only.
Navigation: floating precise pill nav with AHA logo, Health, Act, Science, About, small Donate pill, and separate search. Search placeholder says "Search conditions, CPR, recipes, ways to help".
Main viewport: a utility-led heading like "What do you need today?" above a free-form tapestry of cards. Show one large featured guide tile and several supporting tiles for recipes or habits, condition education, stories, and one proof or action tile. The arrangement should feel flexible and edited, not like permanent section bands.
Customization: at the bottom of the viewport, add a prominent control inspired by the earlier smart topic finder. It should invite quick tuning with selectors such as I am, Looking for, and Topic.
Below the viewport: hint at a mission proof band, deeper personalized recommendation area, ways-to-act or donate module, human story module, and final full-bleed red heartbeat close.
Annotations: numbered callouts for edited default mix, tile size shows priority, adaptive update behavior, bottom-of-viewport customization, and red heartbeat close.
Visual style: grayscale wireframe, clean bright whites, stronger alignment, crisp cards, subtle shadows, small AHA-red accents only until final red close.
Avoid: cold enterprise dashboard, childish playfulness, dense feed behavior, rigid homepage bands in the first viewport, heavy red above the final close, busy annotations, fake stats, stock-photo realism, and overlapping text.
```

## What To Compare
- Does Route A make the homepage feel more welcoming without becoming soft?
- Does Route B make the homepage feel smarter without becoming chaotic?
- Which navigation label set feels clearer for the homepage entry point?
- Which personalization behavior feels easier to trust at a glance?
- Which route better supports the final red heartbeat close?
