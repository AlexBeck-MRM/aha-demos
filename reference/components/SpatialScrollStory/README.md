# SpatialScrollStory

Reusable React primitives for media-depth parallax, ambient Ken Burns motion, rounded foreground-sheet transitions, and scroll-linked title reveals.

## Public API

The barrel exports six components and their prop types:

- `SpatialScrollStory`: provider and CSS-variable bridge for one story.
- `ParallaxImageSection`: full-bleed depth image; defaults to `90vh`.
- `ParallaxBackdropSection`: full-bleed custom visual at the same depth; use it for shaders, video, or other live media.
- `ForegroundSection`: raised surface with rounded top and bottom transitions; defaults to `100vh` with no pinned pause.
- `ScrollRevealTitle`: multi-line display title with image blur/scale motion and crisp surface scale motion.
- `ScrollRevealGroup`: delayed supporting-copy/action reveal.

It also exports `SPATIAL_MOTION_SETTING_KEYS`, the runtime mirror of `SpatialMotionSettings`, for validation at JSON or API boundaries.

`useScrollScene` is intentionally internal. Consumers should compose sections rather than depend on scroll math that may change.

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
  imageDepthPx: 506,
  titleDepthRatio: 0.5,
  sheetRadiusPx: 28,
  shadeOpacity: 0.22,
  kenBurnsZoom: 0.045,
  kenBurnsPan: 0.45,
  kenBurnsDurationMs: 28000,
  backgroundTitleEntryLineVh: 100,
  backgroundTitleExitLineVh: 58,
  surfaceTitleEntryLineVh: 80,
  titleTravelPx: 28,
  titleScaleIn: 0.94,
  titleScaleOut: 0.94,
  surfaceTitleScaleIn: 1.16,
  titleBlurInPx: 12,
  titleBlurOutPx: 18,
  titleRevealSpanVh: 50,
};

<SpatialScrollStory settings={settings}>
  <ParallaxImageSection
    src="/images/story.jpg"
    focalPoint={{ x: 0.68, y: 0.42 }}
  >
    <ScrollRevealTitle
      as="h1"
      tone="image"
      lines={[{ text: "A stronger future" }]}
    />
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

Use `settings` for system-wide motion and surface tuning. Use section props for content-specific decisions:

- `height` changes an individual section's scroll rhythm.
- `focalPoint` uses normalised `x`/`y` coordinates from `0` to `1`.
- `srcSet` and `sizes` connect the scene to a responsive image pipeline without coupling it to one CMS.
- `motionIndex` selects a deterministic Ken Burns path so scenes do not all drift alike.
- `priority` eagerly loads only the first important image.
- `backdrop` accepts a live visual while `shade={false}` lets a self-contrasting shader bypass the global image shade.
- `tone`, `accent`, and `delay` tune title/support behavior without changing the scroll engine.

The component inherits `--aha-white`, `--aha-ink`, `--aha-red`, `--aha-deep-red`, and the optional `--body-3` depth effect, plus the consuming page's typography. Consumers can use `className` to alternate approved surface colours without changing the shared scroll behavior. It does not introduce a second token system.

## Invariants worth preserving

- The outer media layer owns depth translation; the nested layer owns Ken Burns motion. Combining both transforms on one element makes them overwrite each other.
- The fixed 12% ambient overscan and calculated depth bleed prevent image edges appearing during either motion. Change that constant only after crop QA at narrow and wide viewports.
- The 1400px camera perspective is shared across scenes so equal depth values have equal meaning.
- Image-title depth is expressed as a ratio between foreground speed (`0`) and media speed (`1`).
- Image titles scale up from blur and return to the smaller blurred state; their entry and exit trigger lines are authored independently. Surface titles use their own entry line and 60% of the authored reveal span so they scale down out of blur promptly.
- Title paint guards are derived from blur/scale settings. They are not separate controls because independent values could reintroduce clipped glyphs.
- `.titleLine` keeps `0.22em` block padding and offsets adjacent lines with a negative margin. That render space is what protects Lub Dub ascenders and descenders at tight line-height.
- `prefers-reduced-motion` is automatic. `forceReducedMotion` exists only for previews and automated tests.

## Performance and accessibility

One passive scroll/resize scheduler updates all active scenes through CSS variables. `IntersectionObserver` skips offscreen scene work, and `ResizeObserver` recalculates crop-safe image motion when a scene changes size. Scroll does not set React state.

Decorative images should use `alt=""`; meaningful images should receive real alt text. Reduced motion removes parallax, blur, scale, gradient animation, and ambient motion while leaving all content visible.
