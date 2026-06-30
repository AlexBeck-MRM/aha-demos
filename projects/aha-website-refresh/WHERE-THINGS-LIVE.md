# Where Things Live

## Job
- Use this file for fast human lookup.
- Use `projects/aha-website-refresh/artifact-index.yaml` for machine-readable lookup.
- Read this before searching UUID output folders.

## Current Project
- Active project: `aha-website-refresh`.
- Project state: `projects/aha-website-refresh/`.
- Routing contract: `brain/router.yaml`.
- Retrieval index: `projects/aha-website-refresh/retrieval-index.yaml`.
- Daily stewardship contract: `brain/daily-stewardship-loop.md`.

## Current Prototypes
- High Blood Pressure condition guide prototype:
  - `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/index.html`
  - `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/styles.css`
  - `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/script.js`
  - `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/high-blood-pressure-condition-guide-content.md`
- AHA living gradient lab:
  - `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html`
  - `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/styles.css`
  - `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`
  - `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/assets/`
  - mode API: `flame`; presets `A`, `B`, `C`, and `D` drive the same flame shader sliders
  - preset cards and flame-specific parameter groups are generated from `reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/script.js`; the panel only shows controls that affect the flame simulation, including simplified plume shape, texture, colour, logo mapping, and optional blur controls
  - use Save Settings to persist the current panel state for reload, Copy CSS for reusable custom properties, Copy Config for the current parameter state, Export Background MP4 for a seamless 16:9 shader-matched loop, or Export Logo MP4 for the animated AHA logo mask on a white 16:9 canvas when the browser supports MP4 MediaRecorder
  - v30 schema/storage keeps the gradient artwork on an opaque deep-red base, then builds a red plume around a smaller orange plume; legacy `v29`, `v28`, `v27`, and `v26` settings are migrated on read with logo mapping reset to the shared shader window and side sway scaled into the stronger range; flame rotation is adjustable, scale controls can reach `5x`, side sway reaches `4x` and drives both whole-plume drift and spine bend, logo mapping can still be adjusted independently when needed, shader blur defaults to `0px` and can be raised up to `180px` using an oversized blur plane; the flame shader uses the included no-dependency WebGL renderer and falls back to a static three-colour flame composition when WebGL or motion is unavailable
- AHA living UI cards and tabs lab:
  - `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/index.html`
  - `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/styles.css`
  - `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js`
  - `reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/assets/`
  - uses Figma file key `3qEMU5hYtAJ3S7vWGijJhQ` and node `7140:440002` as the source reference for the corrected living-UI layout
  - shows two medium image-card components above the seven-tab journey bar, matching the linked frame instead of using a perspective card field
  - the Women’s Heart Health card is matched to Figma component node `7140:440045` with a fixed `320px x 471px` frame, `16px` radius, `20px` horizontal padding, `24px` vertical padding, `24px` content gap, `14px` title/body gap, and Body 2 outer/inner shadows
  - the Women’s Heart Health image stack uses the Figma layers exactly: `#f5f5f4` fill, full-cover portrait image, a cropped landscape image at `left: -75.86%`, `width: 209.23%`, `height: 99.99%`, then the final full-cover image layer
  - the card image treatment follows the Figma frame: a bottom-to-middle tone gradient with `7px` backdrop blur and a masked fade so the image reveals progressively toward the middle
  - the card chevron uses the Figma SVG directly with viewBox 0 0 6.66667 11.6667, white 0.94 stroke opacity, 1.66667 stroke width, and round caps/joins inside the `20px` icon box
  - default hover scales the body layer to 1.01, lifts it `6px`, moves content up `2px`, nudges the chevron forward, and opens the shadow to 1.1; pressed scales the body to 0.992, drops it `2px`, moves content down `1px`, subtly tucks the chevron back, and tightens the shadow to 0.7
  - default copy translates but never scales; Anchored copy keeps text unscaled while moving it with the surface lift/drop, while diagnostic copy modes can follow `25%` of surface scale or the full surface scale to expose text-blur tradeoffs for a later React implementation
  - the right panel groups controls by Presets, Surface, Copy, Depth, and Timing, with denser sliders and expanded ranges for scale, lift, tilt, text movement, shadow weight, media drift, chevron nudge, timing, and overshoot
  - the four parameter presets are Quiet, Default, Anchored, and Expressive, plus Reset back to Default
  - the default timing/easing contract is hover `510ms cubic-bezier(.18,.72,.18,1.14)`, press `80ms cubic-bezier(.3,0,.18,1)`, release `720ms cubic-bezier(.16,1,.24,1)`; reduced motion removes scale, lift, tilt, copy scale, media drift, chevron nudge, animated shadows, and transforms
- High Blood Pressure detail page:
  - `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/medicines-that-can-affect-blood-pressure.html`
- Condition guide navigation boards:
  - `reference/evidence/mockups/aha-condition-guide-navigation-boards-2026-05-07/`
- Condition guide narrative presentation:
  - `reference/slides/condition-guide-six-section-narrative/`

## Source Notes
- Canonical brief:
  - `knowledge/distilled/canonical-brief.md`
- Source index:
  - `knowledge/sources/index.yaml`
- Health condition authority structure:
  - `knowledge/sources/current-site-audit/health-condition-authority-structure-2026-04-27.md`
- High Blood Pressure final condition-guide decision note:
  - `knowledge/sources/current-site-audit/high-blood-pressure-condition-guide-final-2026-05-07.md`
- High Blood Pressure authority proposal:
  - `knowledge/sources/current-site-audit/high-blood-pressure-authority-page-proposal-2026-04-20.md`
- High Blood Pressure topic network:
  - `knowledge/sources/current-site-audit/high-blood-pressure-topic-network-2026-04-20.md`
- Healthy Eating topic network:
  - `knowledge/sources/current-site-audit/healthy-eating-topic-network-2026-04-29.md`
- Healthy Living guide and navigation notes:
  - `knowledge/sources/current-site-audit/healthy-living-guide-system-high-fidelity-2026-04-28.md`
  - `knowledge/sources/current-site-audit/healthy-living-detailed-page-structure-2026-04-30.md`
  - `knowledge/sources/current-site-audit/healthy-living-navigation-approaches-2026-04-30.md`
  - `knowledge/sources/current-site-audit/healthy-living-nav-a-b-vertical-2026-04-30.md`
  - `knowledge/sources/current-site-audit/healthy-living-adaptive-super-hub-2026-05-07.md`

## Design Direction
- Route comparison:
  - `design/routes/route-comparison.md`
- Route A:
  - `design/routes/route-a.md`
- Route B:
  - `design/routes/route-b.md`
- Route deltas:
  - `design/routes/route-deltas.md`
- Homepage structure and wireframes:
  - `design/routes/homepage-structure.md`
  - `design/routes/homepage-route-wireframes.md`
  - `design/routes/homepage-annotated-wireframe-v2.md`
  - `design/routes/homepage-route-b-adaptive-tapestry-wireframe.md`
- Healthy Living adaptive hub wireframes:
  - `design/routes/healthy-living-adaptive-super-hub-wireframes.md`
- Styleframes:
  - `design/styleframes/01-brand-presence.md`
  - `design/styleframes/02-website-ecosystem.md`

## UI Inventory
- Inventory home:
  - `design/ui-style-inventory/README.md`
- Board-linked inventory files:
  - `design/ui-style-inventory/`
- Figma section map:
  - `design/figma/workbench-section-map.yaml`
- Figma source note:
  - `knowledge/sources/figma-design-workbench/index.md`

## AHA Design System Figma Library
- Live design-system file:
  - [AHA Design System WIP](https://www.figma.com/design/DYhenSpnamlWoqLmszNKE3/AHA---Design-System--WIP-?node-id=1-1183&t=xIdbppZWlLAihoHF-1&view=variables)
  - Figma file key: `DYhenSpnamlWoqLmszNKE3`
  - Reference node: `1:1183`
- Variable documentation:
  - /Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/README.md
  - /Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-final-variable-library-guide.md
  - /Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-current-token-table.md
  - /Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/docs/aha-design-system-james-handoff-variable-structure.md
- Access note:
  - Native remote connector expected account: alexander.beck@mrm.com
  - 2026-06-22 responsive spacing remap was applied live through the native Figma MCP connector as alexander.beck@mrm.com.
  - 2026-06-22 follow-up cleanup added missing inset code syntax, added icon-size descriptions, replaced two raw component color cells with primitive aliases, removed deprecated static-font shims, and exposed the responsive spacing primitives for publishing.
  - 2026-06-22 first responsive typography pass added the initial display primitives, published numeric typography primitives, kept body typography stable, and scoped paragraph-width/toggle-border tokens to the right picker surfaces.
  - 2026-06-22 granular typography pass added nine intermediate display primitives, kept body typography stable, and verified the Typography page binding sample.
  - 2026-06-22 final token cleanup published the approved spacing primitives through the 1600 step, added exact alpha/border/shadow primitives, removed raw values from `Color`, `Layout`, `Typography`, and `Components`, re-aliased layout width xxs to the 320 layout-size primitive, moved Regular text styles under the compatibility text group, and removed 81 zero-consumer legacy paint styles.
  - 2026-06-22 live type-scale and button-spacing fix rebuilt visible scale ordering largest-to-smallest, applied the approved display/text responsive type matrix, added public button spacing aliases in the Components collection, and rebound button component root padding/gap fields away from deprecated layout spacing and raw non-zero values.
  - 2026-06-22 button-spacing standard-spacer correction removed all component button spacing primitives; button spacing aliases now resolve through standard Primitives / space values only.
  - Final live validation found 913 local variables, no duplicate variable names, no unresolved aliases, no missing mode values, no missing WEB code syntax, no temporary replacement variables, and all planned spacing/type/button aliases resolving correctly.
  - Numeric text-style paragraph spacing still needs a manual Figma desktop pass because the MCP runtime cannot load Lub Dub.
  - Run the Figma check script with the WIP URL before future live token edits, then confirm identity with native Figma `whoami`.

## Evidence And Mockups
- Condition authority boards:
  - `reference/evidence/mockups/aha-health-condition-authority-structure-2026-04-27/`
- Early HBP authority page concept:
  - `reference/evidence/mockups/aha-high-blood-pressure-authority-page-2026-04/`
- HBP topic network:
  - `reference/evidence/mockups/aha-high-blood-pressure-topic-network-2026-04-20/`
  - `reference/evidence/screenshots/aha-high-blood-pressure-topic-network-2026-04-20/`
- Healthy Eating topic network:
  - `reference/evidence/mockups/aha-healthy-eating-topic-network-2026-04-29/`
  - `reference/evidence/screenshots/aha-healthy-eating-topic-network-2026-04-29/`
- Healthy Living boards:
  - `reference/evidence/mockups/aha-healthy-living-guide-system-high-fidelity-2026-04-28/`
  - `reference/evidence/mockups/aha-healthy-living-detailed-page-structure-2026-04-30/`
  - `reference/evidence/mockups/aha-healthy-living-navigation-approaches-2026-04-30/`
  - `reference/evidence/mockups/aha-healthy-living-nav-a-b-vertical-2026-04-30/`
  - `reference/evidence/mockups/aha-healthy-living-adaptive-super-hub-2026-05-07/`

## Generated Assets
- Generated asset rules:
  - `design/generated/README.md`
- Accepted icon style:
  - `design/ui-style-inventory/icons.md`
  - `design/generated/icons/medical-soft-spatial-colour-block/manifest.md`
  - `design/generated/icons/medical-soft-spatial-colour-block/aha-medical-soft-spatial-colour-block-12-sheet-v4.png`
  - `prompts/image-generation/medical-soft-spatial-colour-block-full-sheet.md`
- Medical Soft Spatial iteration review:
  - `design/generated/review/2026-06-17-medical-soft-spatial-iteration/manifest.md`
  - `design/generated/review/2026-06-17-medical-soft-spatial-iteration/`
- Current spatial icon stress test:
  - `design/generated/review/2026-06-17-medical-soft-spatial-stress-test/manifest.md`
  - `design/generated/review/2026-06-17-medical-soft-spatial-stress-test/aha-medical-soft-spatial-colour-block-stress-test-v1.png`
  - `design/generated/review/2026-06-17-medical-soft-spatial-stress-test/aha-medical-soft-spatial-colour-block-stress-test-v2.png`
  - `prompts/image-generation/medical-soft-spatial-colour-block-stress-test.md`
- Flat line icon candidate:
  - `design/generated/review/2026-06-23-flat-clinical-line/manifest.md`
  - `design/generated/review/2026-06-23-flat-clinical-line/aha-flat-clinical-line-12-sheet-v1.png`
  - `design/generated/review/2026-06-23-flat-clinical-line/aha-flat-clinical-line-12-sheet-v2.png`
  - `design/generated/review/2026-06-23-flat-clinical-line/aha-flat-clinical-line-12-sheet-v3-no-backgrounds.png`
  - `design/generated/review/2026-06-23-flat-clinical-line/aha-flat-clinical-line-12-sheet-v4-duo-colour.png`
  - `design/generated/review/2026-06-23-flat-clinical-line/aha-flat-clinical-line-12-sheet-v5-warm-grey.png`
  - `prompts/image-generation/flat-clinical-line-icon-sheet.md`
- One-colour topic icon cutout sheet:
  - `design/generated/review/2026-06-24-one-colour-topic-icons/manifest.md`
  - `design/generated/review/2026-06-24-one-colour-topic-icons/aha-one-colour-topic-icons-v2-alpha-cutout-grid.png`
  - `design/generated/review/2026-06-24-one-colour-topic-icons/cutouts-v2/`
  - `design/generated/review/2026-06-24-one-colour-topic-icons/aha-one-colour-topic-icons-v1-alpha-cutout-grid.png`
  - `prompts/image-generation/one-colour-topic-icon-sheet.md`
  - Processing trail stays in the manifest; current lookup points at the review pick and cutouts.
- Current icon style exploration review:
  - `design/generated/review/2026-06-17-icon-style-exploration/manifest.md`
  - `design/generated/review/2026-06-17-icon-style-exploration/aha-icon-style-evolution-sheet.png`
  - `design/generated/review/2026-06-17-icon-style-exploration/aha-icon-style-evolution-sheet-v2.png`
  - `design/generated/review/2026-06-17-icon-style-exploration/aha-icon-style-evolution-sheet-v3.png`
  - `design/generated/review/2026-06-17-icon-style-exploration/aha-restrained-solid-icon-preview.png`
  - `design/generated/review/2026-06-17-icon-style-exploration/aha-restrained-solid-icon-preview-v2.png`
  - `design/generated/review/2026-06-17-icon-style-exploration/aha-spatial-icon-style-exploration.png`
  - `design/generated/review/2026-06-17-icon-style-exploration/aha-spatial-icon-style-exploration-lava.png`
- Local generated scratch:
  - `output/`

## Presentations
- Current slide system:
  - `reference/slides/aha-slide-system-v1.6.md`
  - `reference/slides/deck-v1.6-all-layouts.html`
  - `reference/slides/tokens-v1.6.json`
- Proposal and matrix decks:
  - `reference/slides/aha-rebrand-workstream-proposal/`
  - `reference/slides/aha-competitor-brand-appeal-matrix/`
- Generated condition-guide narrative:
  - `reference/slides/condition-guide-six-section-narrative/`

## Reference Sites
- Current token-system guide:
  - /Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/README.md
  - /Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/
  - /Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/index.html
  - /Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/README.md
- Current external-reference note for that guide:
  - /Users/alexanderbeck/Projects-code/cm-internal-design-tokens/docs/aha-design-system/site/aha-token-system-guide/design.md

## Language
- Messaging:
  - `language/messaging-framework.md`
- Voice:
  - `language/voice-and-tone.md`
- Taxonomy:
  - `language/content-taxonomy.md`
- CTA and microcopy:
  - `language/cta-logic.md`
  - `language/microcopy-patterns.md`

## Prompts
- Image generation systems:
  - `prompts/image-generation/`
- Image generation prompt map:
  - `prompts/image-generation/board-to-prompt-map.yaml`
- Icon prompt assets:
  - `prompts/image-generation/icon-style-evolution-sheet.md`
  - `prompts/image-generation/restrained-solid-icon-preview.md`
  - `prompts/image-generation/spatial-icon-style-exploration.md`
  - `prompts/image-generation/medical-soft-spatial-icon-preview.md`
  - `prompts/image-generation/medical-soft-spatial-natural-colour-preview.md`
  - `prompts/image-generation/medical-soft-spatial-colour-block-pilot.md`
  - `prompts/image-generation/medical-soft-spatial-colour-block-full-sheet.md`
  - `prompts/image-generation/medical-soft-spatial-colour-block-stress-test.md`
  - `prompts/image-generation/flat-clinical-line-icon-sheet.md`
  - `prompts/image-generation/one-colour-topic-icon-sheet.md`
- Wireframe inputs:
  - `prompts/wireframes/`

## Scripts
- Design-brain verification:
  - `scripts/docs/verify-design-brain.mjs`
- Project bootstrap:
  - `scripts/docs/init-project.mjs`
- Figma check:
  - `scripts/dev/figma-check.mjs`
- Slide and PPT scripts:
  - `scripts/slides/`
  - `scripts/ppt/`
- Brand capture scripts:
  - `scripts/brand/`

## Cleanup Flags
- Housekeeping route:
  - `repo-housekeeping` is for rare structural cleanup across root docs, ignore rules, package scripts, verifier policy, and lookup docs.
- Relocated on 2026-05-07:
  - `reference/evidence/prototypes/aha-high-blood-pressure-condition-guide-2026-05-07/`
  - `reference/evidence/mockups/aha-condition-guide-navigation-boards-2026-05-07/`
  - `reference/slides/condition-guide-six-section-narrative/`
- Superseded but useful:
  - `reference/evidence/mockups/aha-high-blood-pressure-authority-page-2026-04/`
- Disposable local roots covered by `.gitignore` and `npm run clean`:
  - `.artifacts/`
  - `.playwright-cli/`
  - `.playwright-mcp/`
  - `.tmp/`
  - `output/`
  - `tmp/`
  - `.aha-server.pid`

## Rule
- Do not delete cleanup-flagged files from this file alone.
- Check `projects/aha-website-refresh/cleanup-candidates.md`.
- Check references with `rg`.
- Move or remove only after owner confirmation.
- Keep `output/` disposable after generated assets are copied to `design/generated/`.
