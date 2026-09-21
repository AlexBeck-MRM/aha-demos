# SpatialScrollStory

Reusable React primitives for the AHA three-layer parallax contract, rounded foreground-sheet transitions, and scroll-linked title reveals.

## Layer contract

| Layer | Ownership | Entry | Centre | Exit |
| --- | --- | ---: | ---: | ---: |
| `−2 Backdrop` | Images, colour, texture, shader, and visual treatment | `−12vh` | `0vh` | `+12vh` |
| `−1 Backdrop Content` | Text and supporting graphics that belong with the Backdrop | `−6vh` | `0vh` | `+6vh` |
| `0 Page` | Page content, cards, navigation, and controls | `0vh` | `0vh` | `0vh` |

Layer −1 is always derived at 50% of Layer −2. It is not an independent setting. Layer −2 owns `12vh` bleed above and below the scene, plus a small pixel safety guard, and the scene clips the excess.

## Public API

- `SpatialScrollStory`: provider and CSS-variable bridge for one story.
- `ParallaxImageSection`: static focal-point-aware image on Layer −2; defaults to `90vh`.
- `ParallaxBackdropSection`: custom visual on Layer −2 for shaders, video, or other live media.
- `ForegroundSection`: Layer 0 surface; defaults to `90vh` with no pinned pause.
- `ScrollRevealTitle`: multi-line title with independently authored Backdrop and Page entrance lines.
- `ScrollRevealGroup`: supporting-copy/action reveal whose progress is independent of title controls.

`BACKDROP_CONTENT_RATIO` and `MIN_TITLE_REVEAL_SPAN_VH` expose the two derived motion invariants to diagnostic and configuration surfaces. `SPATIAL_MOTION_SETTING_KEYS` mirrors `SpatialMotionSettings` for JSON and API validation. `useScrollScene` remains internal.

## Minimal composition

```tsx
import {
  ForegroundSection,
  ParallaxImageSection,
  ScrollRevealTitle,
  SpatialScrollStory,
  type SpatialMotionSettings,
} from "./SpatialScrollStory";

const settings: SpatialMotionSettings = {
  backdropTravelVh: 12,
  sheetRadiusPx: 28,
  shadeOpacity: 0.22,
  backdropTitleStartVh: 90,
  backdropTitleFullVh: 70,
  pageTitleStartVh: 90,
  pageTitleFullVh: 70,
  titleTravelPx: 18,
  backdropTitleScaleIn: 0.96,
  pageTitleScaleIn: 0.96,
  titleBlurInPx: 6,
};

<SpatialScrollStory settings={settings} showLayerLabels>
  <ParallaxImageSection src="/images/story.jpg" focalPoint={{ x: 0.68, y: 0.42 }}>
    <ScrollRevealTitle as="h1" tone="image" lines={[{ text: "A stronger future" }]} />
  </ParallaxImageSection>

  <ForegroundSection>
    <ScrollRevealTitle
      tone="surface"
      lines={[{ text: "In your" }, { text: "community", accent: true }]}
    />
  </ForegroundSection>
</SpatialScrollStory>;
```

## Customisation boundaries

- `backdropTravelVh` is the authored Layer −2 travel. Bleed and Layer −1 travel are derived from it.
- Backdrop and Page titles each have independent Start and Full-in viewport coordinates. Full-in must remain at least `1vh` above Start. The default Backdrop title enters from `90vh` to `70vh`, then stays fully visible as it scrolls out at the top.
- `height`, `focalPoint`, `srcSet`, `sizes`, `priority`, `backdrop`, `shade`, `tone`, `accent`, and `delay` remain section or content decisions.
- `showLayerLabels` is an optional diagnostic prop. It is off by default for shared consumers.
- Ken Burns motion is not part of this component. Use the separate `KenBurnsSlideshow` component when that effect is required.

## Invariants worth preserving

- Layer −2 follows `−travel → 0 → +travel` from scene entry through centre to exit.
- Layer −1 follows exactly half the Layer −2 movement; Layer 0 never receives parallax.
- Title progress is measured from the title's untransformed layout position plus its layer movement. Title transforms cannot feed back into trigger measurement.
- Headings have no exit fade, blur or scale. Legacy exit settings are ignored.
- Supporting groups use their own fixed reveal progress. Changing a title Start or Full-in line cannot move or fade logos, supporting copy, or actions.
- Title paint guards remain derived from blur and scale settings. `.titleLine` keeps its font-relative paint space to protect ascenders and descenders.
- `prefers-reduced-motion` is automatic. `forceReducedMotion` is only a preview/test override and renders final visible states with no parallax, blur, or scale.

## Performance and accessibility

One passive scroll/resize scheduler updates active scenes through CSS variables. `IntersectionObserver` skips offscreen work, and `ResizeObserver` recalculates layout after responsive changes. Scroll does not set React state.

Decorative images should use `alt=""`; meaningful images should receive real alt text. Diagnostic layer labels are pointer-event-free and `aria-hidden`.

## Two reveal patterns (10 September 2026)

Both use each element's own untransformed top edge, plus outer parallax when present. The default entry is `90→70vh` measured from the viewport top. Full visibility is **30vh above the bottom**. Progress follows scroll position and reverses; there is no duration or once-only trigger.

| Pattern | Start at 90vh | Full at 70vh | Leaving the top |
| --- | --- | --- | --- |
| Scroll Reveal A — Spatial / `ScrollRevealTitle` | opacity 0, scale 0.96, blur 6px | opacity 1, scale 1, blur 0 | Backdrop only: 10→0vh fades to 0, scales to 0.96 and blurs to 6px. Page titles leave naturally. |
| Scroll Reveal B — Fade and move / `ScrollRevealGroup` | opacity 0, translateY 18px | opacity 1, translateY 0 | Stay visible and leave naturally. |

Spatial blur and opacity finish at 85% of the entry window (73vh at defaults), while scale settles at 70vh. Spatial titles add no translation. The outer `imageContent` owns parallax. Supporting groups use a fixed 90→70vh window independent of title sliders. Their optional `delay` is a fraction, normalized to finish at the same 70vh line; the default is zero. `titleTravelPx` now controls only Fade and move distance. `introOnMount` remains accepted for compatibility but is ignored.

Use `ForegroundSection` to demonstrate both patterns without parallax; use `ParallaxImageSection` or `ParallaxBackdropSection` to layer both over parallax. The demo includes supporting copy on the red backdrop. Resize observers also watch reveal elements so font loading and multiline changes refresh measurement.

Reduced motion exposes all content immediately with no parallax, blur, scale or translation. Keyboard focus makes a supporting group visible even before its entry completes.

[Scroll Reveals documentation](https://www.figma.com/design/DYhenSpnamlWoqLmszNKE3?node-id=19392-3732). Local review: `http://127.0.0.1:5192/`. This revision is not publicly deployed.
