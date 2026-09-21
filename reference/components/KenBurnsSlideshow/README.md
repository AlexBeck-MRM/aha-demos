# KenBurnsSlideshow

Lightweight React reference component for a slow, accessible Ken Burns image slideshow.

This lives in `reference/components/` because the AHA Design Brain repo does not currently include a React app, shared component package, Vite setup, Next.js setup, or CSS Modules build target. Copy the folder into the consumer React project and import it from `index.ts`.

## Usage

```tsx
import { KenBurnsSlideshow } from "./KenBurnsSlideshow";

<div className="heroMedia">
  <KenBurnsSlideshow
    images={[
      { src: "/images/slide-1.jpg", alt: "Slide 1" },
      { src: "/images/slide-2.jpg", alt: "Slide 2" },
      { src: "/images/slide-3.jpg", alt: "Slide 3" },
    ]}
    durationMs={22000}
    fadeMs={750}
    overscan={0.12}
    panStrength={0.65}
    mode="cinematic"
  />
</div>
```

```css
.heroMedia {
  width: 100%;
  height: 70vh;
}
```

## Decorative background example

```tsx
<KenBurnsSlideshow
  images={[
    { src: "/images/ambient-1.jpg" },
    { src: "/images/ambient-2.jpg" },
    { src: "/images/ambient-3.jpg" },
  ]}
  decorative
  showPauseControl
/>
```

## API

```ts
export type KenBurnsImage = {
  src: string;
  alt?: string;
  focalPoint?: {
    x: number;
    y: number;
  };
};

export type KenBurnsSlideshowProps = {
  images: KenBurnsImage[];
  durationMs?: number;
  fadeMs?: number;
  overscan?: number;
  minZoom?: number;
  maxZoom?: number;
  panStrength?: number;
  mode?: "gentle" | "cinematic" | "focal" | "random";
  seed?: number;
  className?: string;
  pauseWhenHidden?: boolean;
  pauseWhenOffscreen?: boolean;
  respectReducedMotion?: boolean;
  showPauseControl?: boolean;
  pauseControlLabel?: string;
  playControlLabel?: string;
  decorative?: boolean;
};
```

## Implementation notes

This component prevents image peeking by making each slide layer larger than the visible frame. The image covers that oversized layer with object-fit: cover. The Ken Burns motion is clamped to the available overscan space, so the visible container remains covered throughout pan, zoom and crossfade.

- The root clips overflow and fills the parent size. It does not set its own height.
- Each slide layer is inset outward by `--kb-bleed-x` and `--kb-bleed-y`.
- Motion is transform-based and generated from named routes, not per-frame React state.
- The two-layer crossfade keeps the outgoing slide moving while the incoming slide starts moving immediately.
- `ResizeObserver` updates the measured frame and regenerates clamped motion values.
- The component preloads current, next, and next-plus-one images only.
- Broken image URLs are removed from the usable image list after an `img` error event.

## Accessibility

- `decorative` defaults to `true`, so images use empty alt text and `aria-hidden`.
- The pause/play control is always a real `button` when animation is running.
- The button uses `aria-pressed`, an accessible label, a visible focus style, and a 44px minimum target.
- Slide changes are not announced with `aria-live`.
- `prefers-reduced-motion: reduce` disables automatic movement and crossfade when `respectReducedMotion` is true.
- User pause, hidden-tab pause, offscreen pause, and reduced-motion pause stay separate so system resume does not override a user pause.

Meaningful content should not rely solely on an auto-playing background slideshow. If the images carry critical content, place the same content in real page copy or use a full carousel pattern.

## Defaults

```ts
const DEFAULTS = {
  durationMs: 22000,
  fadeMs: 750,
  overscan: 0.12,
  minZoom: 1,
  maxZoom: 1.08,
  panStrength: 0.65,
  mode: "cinematic",
  pauseWhenHidden: true,
  pauseWhenOffscreen: true,
  respectReducedMotion: true,
  showPauseControl: true,
  pauseControlLabel: "Pause background animation",
  playControlLabel: "Play background animation",
  decorative: true,
};
```
