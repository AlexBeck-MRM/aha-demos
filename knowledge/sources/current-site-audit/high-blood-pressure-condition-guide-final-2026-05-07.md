---
title: High Blood Pressure Condition Guide Final Prototype
status: current prototype decision record
date: 2026-05-07
project_id: aha-website-refresh
artifact: reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/index.html
---

# High Blood Pressure Condition Guide Final Prototype

## Decision
- Use the May 7 prototype as the current condition-guide page model.
- Keep one long parent guide page for orientation, scanning, tools, and section-to-section movement.
- Keep one tested article detail page for deeper nested content.
- Use five guide sections:
  - Overview
  - Signs
  - Causes
  - Care
  - Support
- Use the side rail for in-page section movement only.
- Use grouped detail links inside each section narrative.
- Remove generic "More detail" parent wrappers.
- Remove redirect stubs, preview screenshots, Figma transfer captures, and unused icon assets from the final prototype folder.

## Why
- AHA needs condition pages to feel canonical, useful, and human.
- The structure follows how people arrive with health questions:
  - understand the condition
  - check readings and warning signs
  - review what may contribute
  - understand care options
  - find tools and support
- The page supports patients, caregivers, health-conscious consumers, and professionals without turning the guide into separate audience pages.
- The long parent page gives a clear overview and enough detail to be useful in one visit.
- Detail links preserve depth without forcing every subtopic into the main page.
- The tested article detail page shows how nested content can read like an article, not another condition landing page.
- The pattern supports the canonical brief:
  - build trust through medically verified language and clear emergency guidance
  - operate intelligently through tools, section tracking, and grouped links
  - be human through direct patient-facing language
  - use less by reducing boxed fragments, generic wrappers, and redundant navigation
  - act as the number-one guide for heart health by connecting condition content, tools, healthy living, and support

## Final Pattern
- Parent page:
  - floating top bar
  - compact hero
  - one-line medical verification metadata
  - urgent guidance
  - sticky section rail
  - blood pressure reading helper
  - plain editorial content for core explanations
  - cards only for tools, tables, urgent callouts, questions, media, and grouped detail links
  - tooltip terms for medical vocabulary
  - page-end links grouped by user intent
- Detail page:
  - article-style header
  - sticky back-to-guide affordance
  - no sidebar
  - longer prose
  - fewer bullets
  - clear relation back to the parent guide

## Content Decisions
- Use `Signs` instead of `Symptoms` because readings, observed changes, and emergency warning signs matter even when people feel well.
- Fold tests and diagnosis-like content into signs, readings, monitoring, and care.
- Use `Care` as the section that covers treatment, monitoring, routines, follow-up, medicines, and barriers.
- Use `Support` for tools, caregivers, visit preparation, peer support, and healthy-living connections.
- Keep "What care may include" as a plain bullet list, not clickable chips.
- Keep grouped links under meaningful parent topics, not under a generic "More detail" heading.
- Use direct, medically careful language.
- Avoid self-referential copy and AI-like contrastive phrasing.

## Navigation Decisions
- Use a floating global bar that hides on downward scroll and returns on upward scroll.
- Keep global navigation minimal in this prototype.
- Keep the condition side rail as the main within-page navigation.
- On mobile, let the section rail scroll horizontally and keep the active section in view.
- On detail pages, do not repeat the condition side rail.
- Use one clear back-to-guide path on detail pages.

## Visual Decisions
- Use Helvetica for a generic wireframe feel.
- Use black, white, and very light grey.
- Use fewer card boxes and more editorial text on the page background.
- Use rounded white cards only when the content has a module function.
- Use greyscale raster illustrations, not inline SVG illustrations.
- Avoid three-column stacks.
- Keep detailed links smaller, less cramped, and grouped by topic.

## Final Files
- `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/index.html`
- `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/medicines-that-can-affect-blood-pressure.html`
- `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/styles.css`
- `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/script.js`
- `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/high-blood-pressure-condition-guide-content.md`
- `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/assets/`

## Verification
- `git diff --check`
- `node --check reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/script.js`
- Headless browser checks for:
  - desktop overflow
  - mobile overflow
  - floating header hide/show behavior
  - section rail active state
  - reading helper behavior

## Open
- Medical copy still requires AHA clinical review before publication.
- Placeholder links need real IA targets before production.
- Figma transfer should use this cleaned final folder only.
