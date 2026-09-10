# AHA Parallax Scroll Storytelling Lab

A React handoff demo for alternating `90vh` Backdrop scenes and viewport-height Page sheets. It implements the AHA Design System three-layer parallax contract, independent title entrance positions, continuous Lenis scrolling, and static focal-point-aware photography.

## Run it

From the repository root:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:4173/reference/evidence/prototypes/aha-parallax-scroll-storytelling-playground-2026-07-20/
```

For an isolated build:

```bash
npm --prefix reference/evidence/prototypes/aha-parallax-scroll-storytelling-playground-2026-07-20 run build
```

## Source map

| Need | Source |
| --- | --- |
| Change authored values | `src/config/parallax-story.json` |
| Add, rename, or re-range a durable control | `src/config/parallax-story-controls.json`, the shared settings keys, and their application in `reference/components/SpatialScrollStory/` |
| Change content, image focal points, or scene order | `src/components/StoryDemo.tsx` |
| Change the live shader wrapper | `src/components/LivingShaderBackdrop.tsx` |
| Change the compact panel content | `src/components/ParameterPanel.tsx` |
| Change reusable parallax or title behavior | `reference/components/SpatialScrollStory/` |
| Change demo typography or diagnostic styling | `src/styles.css` |
| Change shared panel chrome | `reference/assets/playground-system/parameterizer.css` |
| Change managed source-save behavior | `scripts/dev/play.js` |

## Layer and title contract

- Layer −2 · Backdrop moves `−12vh → 0vh → +12vh` and owns `12vh` bleed per edge.
- Layer −1 · Backdrop Content is derived at 50%, so it moves `−6vh → 0vh → +6vh`.
- Layer 0 · Page remains in normal document flow at `0vh`.
- Backdrop titles default to Start `90vh`, Full-in `70vh`, with no exit animation.
- Page titles default to Start `90vh` and Full-in `70vh`.
- Start and Full-in are measured from the title's real layer position. Supporting groups use separate progress and do not change when title controls move.
- Scroll-story photographs do not use Ken Burns pan or zoom. The separate Ken Burns lab remains the reference for that effect.

## Parameter lifecycle

```text
parallax-story.json
        ↓ initial state
useParallaxSettings
        ↓ live edits
SpatialScrollStory settings → scroll math and CSS variables
        ↓ Save
localStorage + managed dev endpoint → parallax-story.json
```

- The 11 sliders are durable design settings and use schema `aha-parallax-scroll-storytelling/v5`.
- The control panel and server read the same `parallax-story-controls.json` ranges.
- Backdrop/Page Start and Full-in controls enforce a minimum `1vh` span in the panel, runtime normalisation, and save endpoint.
- Stored v1, v2, v3 and v4 configs retain compatible parallax, sheet and shade settings. Reveal styling and windows migrate to the v5 defaults: both titles and groups enter over `90→70vh`; headings remain fully visible at the top.
- `Save` persists in the browser and, under `npm run dev`, rewrites the authored JSON.
- `Copy Config` exports the same v5 envelope consumed by the demo. `Revert` returns to the authored session baseline.

## Panel and diagnostic tools

- The read-only Layer Map displays live Layer −2 travel/bleed, the derived 50% Layer −1 relationship, and fixed Layer 0.
- Shader Play/Pause affects only the living shader.
- Reduced Motion is a session-only preview of the automatic OS preference.
- Triggers is session-only and off by default. It shows live Start and Full-in `vh` lines.
- Layer Labels is session-only and on by default. It adds small magenta `−2 Backdrop`, `−1 Backdrop Content`, and `0 Page` annotations without changing layout or accessibility.
- The shared 360px panel shell, row rhythm, Save, Copy Config, and Revert behavior remain unchanged.

## Derived and hardcoded values

The 50% Backdrop Content ratio, depth bleed safety pixels, title paint guards, observer margin, group reveal lines, and frame scheduler are hardcoded by design. They protect the documented relationship, crop safety, type rendering, or performance and are not independent design choices.

## Verification

```bash
npm --prefix reference/evidence/prototypes/aha-parallax-scroll-storytelling-playground-2026-07-20 run build
npm run verify:brain
npm run demos:export-public
npm run demos:verify-public
git diff --check
```

In a real browser, verify desktop and mobile states, exact layer travel, title Start/Full-in positions, no exposed image edges, no Ken Burns transforms, shader pause, reduced motion, layer/trigger toggles, save/reload/revert parity, fixed panel width, internal panel scrolling, no clipped title glyphs, no horizontal overflow, and a clean console.

## Current reveal review

- Scroll Reveal A (Spatial): opacity 0→1, scale 0.96→1, blur 6→0px, no reveal translation. Blur clears near 73vh; scale reaches 1 at 70vh.
- Scroll Reveal B (Fade and move): opacity 0→1, translateY 18→0px. Its own anchor reaches full visibility at 70vh. No blur, scale or exit fade.
- Both patterns are scroll-linked, reversible and measured per element. No timed mount animation.
- Red and image content retain the separate outer parallax transform. Foreground examples use the same two patterns without parallax.
- Reduced motion removes parallax and both reveals; all content remains visible.
- Local preview: `npm run dev -- --port 5192 --strictPort` from this directory, then open `http://127.0.0.1:5192/`.
- Figma: [Scroll Reveals](https://www.figma.com/design/DYhenSpnamlWoqLmszNKE3?node-id=19392-3732).
- [Public demo](https://alexbeck-mrm.github.io/aha-demos/reference/evidence/prototypes/aha-parallax-scroll-storytelling-playground-2026-07-20/).

## Entry only (10 September 2026)

Headings stay at full opacity, scale 1 and blur 0 after entry. They scroll naturally out of the top. Exit controls are removed; saved exit settings are ignored. The 90→70vh bottom entry still reverses with scroll.
