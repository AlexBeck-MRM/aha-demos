---
status: working
project_id: aha-website-refresh
owner: design-brain
last_reviewed: 2026-05-06
source_refs:
  - design/routes/homepage-route-wireframes.md
  - design/routes/homepage-structure.md
  - design/ui-style-inventory/wireframe-style.md
  - knowledge/distilled/canonical-brief.md
decision_refs:
  - ROUTE-004
  - ROUTE-005
  - ROUTE-006
---

# Homepage Route B: Adaptive Tapestry

## Direction
Create a second homepage route that behaves less like a fixed stack of permanent sections and more like a calm, configurable field of content. The page should still show AHA's editorial judgment, but it should do that through a sparse adaptive tile layout rather than a rigid banded sequence.

The key shift is behavioral, not decorative. Instead of asking the user to move down through a prescribed homepage order, the page should present a small set of suspended content tiles that can rebalance around one user signal. The default state should feel coherent and mission-led. The configured state should feel more relevant and local without becoming busy.

The control model should now be lighter. Remove the large in-page finder bar. Use one small persistent floating selector near the bottom center so personalization stays available without dominating the page.

## Experience Intent
This route should make AHA feel useful, intelligent, and quietly responsive. It should keep the trust and clarity of the current homepage work, but loosen the page into a more flexible tile system that can adapt around place and interest.

It should still feel curated by AHA. The point is not to become a feed or a topic wall. The point is to show a small number of meaningful options with enough space that the page feels calm and intentional.

## Core Behavior
- The homepage opens with a curated default mix.
- That mix still mirrors the same broad content structure already approved for the homepage:
  - mission and role
  - guidance
  - habits or support
  - stories
  - proof or community impact
  - action paths
- The content is arranged as a sparse tile tapestry instead of permanent horizontal sections.
- Keep the tapestry to two columns max.
- Keep the number of tiles low.
- Tile size and placement should suggest priority:
  - one hero tile
  - one smaller supporting tile beside it
  - three to five hanging support tiles below
- The user can lightly configure the mix through one small persistent selector.
- Personalization should reshape emphasis, hero content, and local relevance without rebuilding the page.
- Geolocation can be used to surface nearby events, support, and community activity once the user opts in or the signal is available.

## Default Viewport
### 1. Floating navigation
- Keep the floating detached nav.
- Keep Route B labels concise and direct.
- Keep search visible and ready.

### 2. Hero tile pair
- Replace the full-width hero with a large hero tile on the left and one smaller support tile on the right.
- In the default state, the hero tile should be mission-led:
  - AHA helps people live longer, healthier lives
  - AHA shows up in communities
- The smaller tile should suggest a secondary route such as how to help, where AHA shows up locally, or a simple getting-started prompt.

### 3. Hanging support tiles
- Use a sparse hanging arrangement below the hero pair.
- Keep two columns max.
- Stagger tiles vertically so the page feels suspended rather than row-based.
- Default support mix:
  - one broad guidance tile
  - one support or habits tile
  - one human story tile
  - one community or impact tile
  - one action tile
- Supporting tiles should show variety, but the page should stay light on information.

### 4. Persistent floating selector
- Remove the large in-page finder bar.
- Use one small floating control near the bottom center of the viewport.
- Show only one chosen value at a time.
- The control should feel always available, but secondary to the content itself.

## Customization Model
- Keep the interaction lightweight.
- Use one selection only in the visible control.
- Let the homepage adapt around one clear interest signal.
- Use geolocation as a supporting signal once available.
- Allow the homepage tapestry to update in place.
- Make the change visible through tile swaps, size changes, local cues, and hero adjustment.
- Keep one broad AHA mission or support tile anchored so the page still feels edited by AHA.

## Personalization Scenario
- Example selected interest: `Volunteering near me`
- Default state:
  - hero tile is mission-led and broad
  - supporting tiles cover guidance, support, story, impact, and ways to help
- Configured state:
  - hero tile becomes local volunteering near the user
  - small top-right tile becomes a nearby event or orientation cue
  - lower tiles rebalance toward volunteer stories, what to expect, family-friendly opportunities, local chapter activity, and community impact
- The page should feel more relevant and local, not dramatically rebuilt.

## Lower-Page Structure
After the first viewport, the page can stay sparse. It does not need to resolve into many explicit sections. It should still feel like an adaptive continuation of the tapestry logic.

### Suggested sequence
1. One broader support or proof tile.
2. One local or community tile if configured.
3. One story or impact tile.
4. One simple action tile.
5. Quiet footer or lower-page continuation.

The difference from Route A is that these moments should still feel like parts of one adaptive field rather than fixed editorial chapters.

## Wireframe Notes
- Use tile size as hierarchy before using more copy.
- Keep the layout asymmetrical but controlled.
- Keep to two columns max.
- Preserve generous white space and tactile card edges.
- Make the tiles feel floaty and separated from each other.
- Use internal detail sparingly.
- Use grayscale photography in only a few tiles.
- The floating selector should be small, centered, and understated.

## Annotation Notes
- `edited default mix`
- `hero shifts with interest`
- `local cue when configured`
- `one visible selection`
- `two-column hanging rhythm`
- `one anchored mission tile`

## Image-Generation Prompt
```text
Use case: ui-mockup
Asset type: low-fidelity homepage wireframe comparison, Route B
Route name: Adaptive Tapestry
Primary request: Create a side-by-side desktop homepage wireframe showing two states of the American Heart Association Route B homepage: unconfigured default and configured personalized.
Design goal: this route should feel smarter, more local, and more responsive than the curated-section homepage, while staying sparse, calm, and edited.
Style: white-first, grayscale low-fidelity wireframe, floating navigation, soft shadows, rounded cards, minimal internal detail, no strong color.
Header: floating pill navigation in grayscale only.
Main viewport: use a hero tile on the left and one smaller support tile on the right. Do not use a full-width hero banner.
Layout: below the hero pair, use a sparse two-column hanging tile arrangement with only a few large tiles and lots of white space.
Default state: mission-led hero tile about AHA's role in helping people live longer, healthier lives. Support tiles should imply broad guidance, support, stories, community impact, and ways to help.
Configured state: geolocation active and one selected interest: `Volunteering near me`. Hero tile becomes local volunteering. Small top-right tile becomes a nearby event or orientation cue. Lower tiles rebalance toward local opportunities, volunteer stories, family-friendly ways to help, community activity, and impact.
Selector: no large in-page bar. Use one small floating bottom-center selector with one visible chosen value only.
Tile behavior: make the tiles feel floaty, sparse, and intentionally staggered. Keep alignment calm and controlled, not chaotic and not row-based.
Avoid: dense feed behavior, full-width hero banners, giant bottom bars, more than two columns, strong red, gradients, decorative blobs, heavy annotations, or polished final UI.
```
