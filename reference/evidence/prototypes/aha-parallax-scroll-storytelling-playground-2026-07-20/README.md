# AHA Parallax Scroll Storytelling Lab

A working handoff demo for alternating `90vh` photo/live-shader scenes and viewport-height foreground sheets, with continuous Lenis scrolling, controllable depth, crop-safe Ken Burns motion, and spatial title reveals.

## Run it

From the repository root:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:4173/reference/evidence/prototypes/aha-parallax-scroll-storytelling-playground-2026-07-20/
```

For an isolated frontend build:

```bash
npm --prefix reference/evidence/prototypes/aha-parallax-scroll-storytelling-playground-2026-07-20 run build
```

## Where to make changes

| Need | Source |
| --- | --- |
| Change authored parameter values | `reference/evidence/prototypes/aha-parallax-scroll-storytelling-playground-2026-07-20/src/config/parallax-story.json` |
| Add/rename/re-range a durable control | `reference/evidence/prototypes/aha-parallax-scroll-storytelling-playground-2026-07-20/src/config/parallax-story-controls.json`; for a new key, also update `SPATIAL_MOTION_SETTING_KEYS` and its application in `reference/components/SpatialScrollStory/` |
| Change demo content, images, focal points, or scene order | `reference/evidence/prototypes/aha-parallax-scroll-storytelling-playground-2026-07-20/src/components/StoryDemo.tsx` |
| Change the live shader scene wrapper | `reference/evidence/prototypes/aha-parallax-scroll-storytelling-playground-2026-07-20/src/components/LivingShaderBackdrop.tsx` |
| Change continuous page-scroll behavior | `reference/evidence/prototypes/aha-parallax-scroll-storytelling-playground-2026-07-20/src/hooks/useSmoothPageScroll.ts` |
| Change reusable component behavior | `reference/components/SpatialScrollStory/` |
| Change demo layout/typography | `reference/evidence/prototypes/aha-parallax-scroll-storytelling-playground-2026-07-20/src/styles.css` |
| Change shared panel chrome | `reference/assets/playground-system/parameterizer.css` |
| Change managed source-save behavior | `scripts/dev/play.js` |

## Parameter lifecycle

```text
parallax-story.json
        ↓ initial state
useParallaxSettings
        ↓ live edits
SpatialScrollStory settings → CSS variables / crop-safe motion math
        ↓ Save
localStorage + managed dev endpoint → parallax-story.json
```

- Slider changes apply immediately to every scene.
- `Save` always persists in the current browser. Under `npm run dev`, it also validates and rewrites the authored JSON.
- On static GitHub Pages, source files cannot be written, so the browser copy is the durable preview state.
- Existing browser saves at the former authored `420px` media depth or `1.08x` surface-title entry scale migrate those values to the current authored defaults while leaving every other saved control intact.
- `Copy Config` exports the same schema consumed by the demo.
- `Revert` returns to the last authored baseline known in the current session.

The control panel and server both read `parallax-story-controls.json`. There is no second list of ranges to keep in sync.

## Durable settings versus preview tools

The 14 sliders are design decisions and are saved. `Play`, `Pause`, and `Reduce motion` are preview/QA tools and are intentionally not written to config. Production reduced-motion behavior comes from the user's OS preference; the preview override only makes that state easy to inspect. Wheel and trackpad input use one `0.07` Lenis interpolation instead of restarting a duration curve for each input burst. Touch stays native, and the parameter panel keeps its own wheel/trackpad scroll context.

## Handoff contract

The reusable component accepts one `SpatialMotionSettings` object and explicit section props. The demo keeps content in readable JSX because scenes have different actions and semantics; adding a content-schema renderer here would add indirection without improving reuse.

Keep these derived decisions out of the parameter panel unless a real design question emerges:

- camera perspective;
- ambient overscan;
- depth bleed;
- title blur/scale paint guards;
- title-line descender/ascender paint space;
- observer root margin and frame scheduling.

Those values protect crop, type rendering, consistency, or performance. The component README explains each invariant.

## Overengineering audit

The following were deliberately removed during handoff cleanup:

- a browser-global debug API with no consumer;
- public export of the internal scroll hook;
- reduced-motion preview state inside the authored design config;
- duplicated slider bounds in the dev server;
- individual prop plumbing for every settings-controller method.

The shared animation-frame scheduler and per-scene observers remain. They are the minimum split that avoids React rerenders during scroll, skips offscreen work, and recalculates crop safety after responsive layout changes.

## Production follow-up

The demo deliberately reuses two existing repository PNG specimens (roughly 2.1–2.3 MB each) and the shared living-gradient WebGL runtime to avoid duplicating assets or shader logic. Production should supply responsive image-service derivatives through the component's `src`, `srcSet`, and `sizes` props; the motion component should not own the CMS or image pipeline.

## Verification checklist

```bash
npm --prefix reference/evidence/prototypes/aha-parallax-scroll-storytelling-playground-2026-07-20 run build
npm run verify:brain
```

In the browser, verify:

1. A slider updates the preview and config output.
2. Save survives reload; Revert restores the baseline.
3. Reduce motion leaves all content visible and disables spatial/ambient movement.
4. Wheel and trackpad scrolling interpolate continuously without a pinned foreground pause; touch stays native.
5. No image boundary appears at the start, middle, or end of any scene.
6. No title glyph—including `y`, `g`, `p`, `q`, or `j`—is clipped at desktop or mobile widths.
7. The shader section has one ready canvas, no shade layer, and falls back to a static branded gradient if WebGL is unavailable.
