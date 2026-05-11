---
status: working
project_id: aha-website-refresh
owner: design-brain
last_reviewed: 2026-05-08
source_refs:
  - knowledge/sources/current-site-audit/healthy-living-guide-system-high-fidelity-2026-04-28.md
  - knowledge/sources/current-site-audit/healthy-living-detailed-page-structure-2026-04-30.md
  - knowledge/sources/current-site-audit/healthy-living-navigation-approaches-2026-04-30.md
  - knowledge/sources/current-site-audit/health-condition-authority-structure-2026-04-27.md
  - design/routes/homepage-route-b-adaptive-tapestry-wireframe.md
  - knowledge/distilled/canonical-brief.md
decision_refs:
  - ROUTE-006
  - ROUTE-007
  - ROUTE-008
---

# Healthy Living Adaptive Super Hub

## Direction
Apply the adaptive tapestry pattern to `Healthy Living`, not to `Conditions`.

`Conditions` should stay fixed, chapter-led, and authority-first. `Healthy Living` can support a more alive exploration surface because it already mixes evergreen guides, supporting content, and lighter editorial material.

The `Healthy Living` hub should become a directional Super Hub that still routes people into the six canonical guides, but also feels selective, current, and customizable.

Remove the bottom interest selector. The six Healthy Living themes should become the visible chooser on the page itself.

## Six-Guide Framework
Keep these six guide areas as the stable model:

- `Eat better`
- `Move more`
- `Sleep better`
- `Manage stress`
- `Quit tobacco or vaping`
- `Manage weight`

Map them directly to the current evergreen guides:

- `Healthy Eating`
- `Exercise and Fitness`
- `Sleep`
- `Mental Wellbeing`
- `Quit Smoking and Vaping`
- `Weight Management`

These six guides should stay legible in every variant, even when the page becomes more customized.

## Shared Behavior
- `Healthy Living` is a Super Hub, not the guide itself.
- Primary job: route the user into the right guide.
- Secondary job: surface featured content that is not relevant to everybody, but is worth highlighting.
- The page should feel broad and exploratory on arrival.
- A user can choose one theme directly from the six visible theme tiles.
- The page should rebalance in place after that click.
- The chosen theme should promote one guide, two or three chapter starting points, and a small set of supporting content.
- Location stays secondary and passive in this pass.

## Content Layers
Use one chosen direction built from the earlier middle variant.

### 1. Broad Healthy Living lead
- The top of the page should feel welcoming and exploratory on arrival.
- It should explain Healthy Living as a broad AHA framework, not as a single topic.

### 2. Six visible theme tiles
- The six themes become the primary interactive layer.
- Present them as featured tiles or cards, not tabs and not a bottom control.
- Use iconography and short labels so they feel like `six ways to better health`.
- The six tiles should act as both framework and chooser.

### 3. Featured content layer
- A small number of promoted items can sit around or below the six theme tiles.
- Examples:
  - heart-healthy recipe
  - stress explainer
  - meal-planning article
  - infographic
  - quiz
  - support tool

### 4. Theme-driven rebalance
- One clicked theme changes emphasis.
- The page does not route away immediately.
- The selected theme becomes the top-most lead guide area.
- Supporting content underneath rebalances around that theme.

## Configured Example
Use one configured example for the selected-state board:

- selected interest: `Eat better`

Configured-state behavior should show:

- `Healthy Eating` guide promoted
- two or three chapter starting points surfaced
- supporting content highlighted:
  - recipes
  - label-reading
  - meal-planning
  - one lifestyle or editorial feature
- non-selected themes still visible, but quieter

## Location Model
Do not make location a co-equal control.

Treat it as a secondary layer:

- default off or passive
- `Use my location`
- `Enter city or postcode`
- optional radius later

In this pass, location can appear only as a subtle secondary cue in one variant if useful. It should not become a major interaction.

## Selected-State Behavior
- Default state:
  - broader Healthy Living framing at the top
  - six theme tiles visible as the chooser
  - supporting content exploratory and mixed
- Selected state:
  - clicked theme becomes the top-most lead guide area
  - two or three chapter starts appear within or immediately around that lead area
  - content underneath rebalances to one practical guide tile, one supporting article or explainer, one lighter editorial tile, and one utility tile where useful
- The page should still feel like a hub, not like a full jump into the guide page.

## Conditions Rule
Do not apply this adaptive model to the `Conditions` hub as the main structure.

Conditions should continue to use the fixed authority model:

1. `Overview`
2. `Symptoms`
3. `Causes`
4. `Diagnosis`
5. `Treatment`
6. `Living with it`

## Image-Generation Prompt
```text
Create one large grayscale wireframe board showing two desktop states of the revised Healthy Living Super Hub: default and selected.
Use the earlier middle variant as the structural base, but remove the bottom selector entirely.
At the top, show a broader Healthy Living lead area. Beneath or integrated with it, show the six Healthy Living themes as visible featured tiles that act as the chooser. These tiles should feel like a branded framework, not a utility control.
Selected-state example: `Eat better`.
When `Eat better` is selected, make that theme become the top-most lead guide area. Show two or three chapter starting points within or immediately around it. Rebalance the supporting tiles underneath toward recipes, label-reading, meal-planning, and one lifestyle/editorial feature. Keep the non-selected themes visible but quieter.
Style: white-first, grayscale low-fidelity wireframe, floating navigation, soft shadows, rounded cards, calm spacing, very limited readable text, no bottom picker, no strong color.
```
