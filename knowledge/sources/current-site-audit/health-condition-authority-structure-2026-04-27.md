# Health Condition Authority Structure 2026-04-27

## Scope
- define a repeatable condition-page structure for health-topic pages
- use high blood pressure as the worked example
- produce local image boards instead of Figma sections

## Evidence
- high blood pressure topic network: `knowledge/sources/current-site-audit/high-blood-pressure-topic-network-2026-04-20.md`
- high blood pressure authority-page proposal: `knowledge/sources/current-site-audit/high-blood-pressure-authority-page-proposal-2026-04-20.md`
- cross-topic taxonomy audit: `tmp/health-topic-taxonomy-audit.md`
- image board source: `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/board.html`
- image board renderer: `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/render.mjs`
- IA and sitemap board: `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/condition-authority-ia-sitemap.png`
- desktop states board: `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/condition-authority-desktop-states.png`
- mobile states board: `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/condition-authority-mobile-states.png`
- subpage navigation board: `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/condition-authority-subpage-navigation.png`

## Direction
Move condition pages toward one fixed health-reference structure:

1. `Overview`
2. `Symptoms`
3. `Causes`
4. `Diagnosis`
5. `Treatment`
6. `Living with it`

The six labels should stay fixed across condition pages. They should be short enough for sticky navigation and broad enough to absorb condition-specific content without inventing new top-level buckets.

## Structural rules
- The parent condition page is the complete guide.
- Sticky navigation shows only the six fixed chapters.
- Tools, PDFs, videos, lessons, and trackers appear inside the relevant chapter.
- Professional resources appear as contextual support, not as a patient-facing chapter.
- Complications appear as `why it matters` content in `Overview` or as related links from the relevant chapter.
- Population-specific and edge-case pages appear as contextual cards or subpage links inside the relevant chapter.
- Subpages remain available, but they should feel like deeper rooms reached from the parent guide, not a second navigation tree.

## High blood pressure card sort

### Overview
- `What is High Blood Pressure?`
- `High BP Top 10`
- `Common High BP Myths`
- `All About Heart Rate`
- short summary of why uncontrolled blood pressure matters

### Symptoms
- `Symptoms of High Blood Pressure`
- `When To Call 911`
- emergency-threshold panel

### Causes
- `Know Your Risk Factors`
- `High Blood Pressure Among Black Adults`
- `High Blood Pressure in Children and Teens`
- risk-related notes from diet, alcohol, activity, stress, weight, and smoking

### Diagnosis
- `Understanding Blood Pressure Readings`
- `Home Blood Pressure Monitoring`
- blood pressure number chart
- tracker/tool panel

### Treatment
- `Managing Medications`
- `Types of Medications`
- `Your Health Care Team`
- `Resistant Hypertension` as a specialist page
- `Pulmonary Hypertension` as a specialist page where clinically appropriate

### Living with it
- `Healthy Diet`
- `Shaking the Salt Habit`
- `Potassium Benefits`
- `Getting Active`
- `Limiting or Avoiding Alcohol`
- `Managing Stress`
- `Managing Weight`
- `Smoking`
- `Blood Pressure Health Lesson`
- related exits: `Eat Smart`, `Getting Active`

## Sitemap pattern

```text
/health-topics/{condition}
  #overview
  #symptoms
  #causes
  #diagnosis
  #treatment
  #living-with-it

  Contextual subpages
    /{specialist-topic}
    /{population-specific-topic}
    /{tool-or-guided-lesson}
    /{related-clinical-detail}

  Related topics
    /health-topics/{related-condition}
    /healthy-living/{related-lifestyle-topic}
    /professional/{professional-resource}
```

## High blood pressure sitemap example

```text
/health-topics/high-blood-pressure
  #overview
  #symptoms
  #causes
  #diagnosis
  #treatment
  #living-with-it

  Contextual subpages
    /low-blood-pressure
    /resistant-hypertension
    /pulmonary-hypertension
    /high-blood-pressure-in-children
    /high-blood-pressure-among-black-adults
    /blood-pressure-health-lesson

  Related topics
    /health-topics/heart-attack
    /health-topics/stroke
    /health-topics/heart-failure
    /health-topics/cholesterol/about-cholesterol/atherosclerosis
    /healthy-living/healthy-eating/eat-smart
    /healthy-living/fitness/getting-active
```

## Board read
- The IA/sitemap board shows the fixed chapters, card-sort logic, contextual subpage set, and related-topic exits.
- The desktop board shows three states:
  - parent page at top
  - parent page scrolled to `Living with it`
  - specialist subpage reached from `Treatment`
- The mobile board shows the same three states with a sticky topic bar and `Sections` bottom sheet.
- The subpage navigation board clarifies that specialist pages should be visible without becoming a full nested sitemap.

## Subpage navigation pattern
- Do not nest every subpage under the six fixed chapters in the main sidebar.
- On the parent guide, the sidebar can show a separated `Deeper in [chapter]` module below the active chapter list.
- Keep that module contextual and limited to the specialist pages that matter for the active chapter.
- On specialist pages, the sidebar should switch to local page navigation:
  - parent guide return
  - parent chapter context
  - local page sections
  - a small set of related links back into the parent guide
- On mobile, keep the `Sections` sheet limited to the six fixed chapters. Specialist pages should use a parent return plus local page sections.
- The principle is: chapter nav stays stable; subpage links are contextual, separated, and limited.

## Retrieval note
- Use this note when discussing condition-page IA, health-topic consolidation, high blood pressure card sorting, or the six-chapter authority-page model.
