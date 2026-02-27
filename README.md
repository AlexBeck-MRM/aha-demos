# Organic Vessel Heartbeat Background

Two versions are available:
- `css.html`: lightweight CSS-only organic animation.
- `shader.html`: WebGL2 shader version optimized for smoother depth and flow.

Layout defaults to a white page with an inset shader panel (`5vh` margin and `5vh` radius).

## Run

```bash
python3 -m http.server 4173
```

Open:

```bash
open http://localhost:4173
```

Then open either:
- `http://localhost:4173/css.html`
- `http://localhost:4173/shader.html`

## One-command launch (Codex Play)

```bash
npm run play
```

This starts a local server on `4173` if needed and opens:
- chooser page
- CSS variation
- shader variation

Stop the managed server:

```bash
npm run stop
```

## Controls

- Controls are hidden by default.
- Press `H` to show/hide the control panel.
- Panel UX is overhauled with a CHADCDN-style layout:
  - sticky header
  - sticky top `Core Defaults` block
  - grouped advanced controls
  - split standard vs extreme preset buckets
- Controls are grouped by physiology-style sections:
  - `Rhythm Timing`
  - `Beat Shape`
  - `Center Illumination`
  - `Flow Field`
  - `Color Response`
- Parameter ranges are intentionally expanded for edge testing (for example, `Heartbeat Light` up to `3.60`, `Pulse Bloom` up to `3.20`, `Flow Kick` up to `3.20`, `Vibrance` up to `3.20`).

## Presets

- `Clinical Subtle`: softer beat light, wide/soft pulse profile.
- `Vivid Arterial`: stronger heartbeat light and bloom.
- `Calm Resting Rhythm`: slow cadence, broad gentle pulse.
- `Oxygen Surge`: brightest oxygen glow with controlled pulse.
- `Deep Vessel`: deeper red mood with tighter second beat.
- `Pulse Beacon Extreme`: aggressive center illumination stress test.
- `Flow Entrainment Extreme`: strong beat-driven advection.
- `Wide Chamber Extreme`: broad heartbeat radius/falloff.
- `Core Ignition Extreme`: concentrated central pulse energy.
- `Edge Stress Test`: maximum-range full-system test.

Default rhythm target is normal sinus cadence (`72 BPM`, `1.00` heartbeat speed) with energetic beat entry, smooth decay, and center-focused organic exposure/vibrance lift.

## Public API

`js/main.js` exports:

```js
createVesselBackground(canvas, options)
```

`options`:

- `bpm?: number`
- `pulseStrength?: number`
- `heartbeatSpeed?: number`
- `heartbeatLight?: number`
- `heartbeatWidth?: number`
- `heartbeatSoftness?: number`
- `dubStrength?: number`
- `pulseBloom?: number`
- `flowKick?: number`
- `heartbeatRadius?: number`
- `heartbeatFalloff?: number`
- `quality?: "auto" | "low" | "high"`
- `seed?: number`
- `palette?: string[]`
- `moodBlend?: number`
- `oxygenGlow?: number`

Returns:

- `set(name, value)`
- `getState()`
- `setPalette(hexArray)`
- `dispose()`

## Notes

- If WebGL2 is unavailable, the app falls back to an animated red CSS gradient.
- Palette defaults (mood-calibrated):
  - `#990000`
  - `#B80A23`
  - `#CF223B`
  - `#ED1E4A`
  - `#FF6A7A`
