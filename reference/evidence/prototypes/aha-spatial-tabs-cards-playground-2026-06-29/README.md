# Adaptive image colour

Eight unchanged source photographs appear in twelve views on the gray page. The preview and control panel have exactly two families, with matching titles and divider lines:

| Family | Use | Photo peak | Vertical coverage | Horizontal coverage |
| --- | --- | --- | --- | --- |
| Overlay A | Cards and compact images | 90% | Lower 60% | 80% at photo mid-height |
| Overlay B | Backgrounds and large heroes | 80% | Lower 40% | 80% at photo mid-height |

A/B is a use choice. Vertical and horizontal are directions within either family. Left and right mirror the same gradient; photographs are never mirrored. The six original numbered portraits remain, including dark tones, saturated reds and mixed lighting. Example 7 reuses the warm photograph as a horizontal A card. Existing B photographs remain; the former portrait header now uses the shared stacked composition.

## Controls and saved settings

Each family has two controls: **Vertical height** and **Horizontal width**. Photo peaks are fixed at A90% and B80%, shown as read-only values in the family headings. Vertical coverage ranges from 30–80%; horizontal coverage from 50–100%. The 30% minimum leaves room for the fixed 8px boundary join at the smallest possible stacked photo in the three-column grid. It does not add height outside the selected coverage.

Vertical height changes that family's vertical and stacked examples. Horizontal width changes that family's horizontal examples; the chosen width resumes when a narrow stack returns to a horizontal layout. No control affects the other family. Defaults restores the table above. The former Softer preset is removed because it only changed opacity. Broader uses A70%/B50% vertical and 90% horizontal coverage for both.

Save writes `config.json` through the existing local server. Revert restores the last saved values, including after reload. The static Pages site cannot write files: Save selects the JSON for copying and explains this. Copy Config includes the four coverage settings and preset label. Copy CSS exports the actual gradients, finite photo heights and derived tones at the current dimensions; responsive integration still requires the matching config, stylesheet and runtime checks.

`settings.js` is the shared browser/server normalization and migration contract. Schema is `aha-adaptive-colour/v4`. The save endpoint remains `/__adaptive-card-lab/save-settings`. No browser storage is read or cleared. Config requests use `no-store`; versioned script, settings and stylesheet URLs update returning visitors.

### Migration

- Current A/B keys take precedence and are clamped to their family ranges.
- All earlier opacity settings are discarded. A and B always use their fixed 90% and 80% photo peaks. Custom card height is retained where representable; A horizontal width starts at 80%.
- Old side widths of 85%, or legacy `horizontalGradientWidth:60`, become B80%. Other custom widths are retained within range; the newer side-width key takes precedence.
- B combines landscape and mobile vertical height. Previous defaults become 40%. One custom value, or agreeing custom values, survives. Conflicting custom values use the new family default and produce a visible migration notice.
- The former portrait height, per-context angle and shared contrast/sampling/saturation controls are retired. Both families use the fixed shared settings below. These fields are not retained as hidden exceptions.
- Only four numeric coverage values are saved. Invalid input uses defaults; unsupported fields are discarded. The same migration runs on config load and local save. A notice identifies migration, conflicts and clamping until the new config is saved.

## One shared curve

The following ramp positions are measured **inside the selected coverage**, including the transparent start, rising opacity and peak portion. No extra protective height is added.

| Ramp position | 0% | 20% | 40% | 80% | 100% |
| --- | --- | --- | --- | --- | --- |
| Peak multiplier | 0 | 0.15 | 0.80 | 1 | 1 |
| A default alpha | 0% | 13.5% | 72% | 90% | 90% |
| B default alpha | 0% | 12% | 64% | 80% | 80% |

A vertical fade starts at 40% down the photo; its peak starts at 88%. B starts at 60%; its peak starts at 92%. The curve and family photo peaks are fixed. Coverage scales the curve without changing its shape.

Horizontal gradients use a fixed 60° angle from vertical, with CSS directions 120° right and 240° left. Coverage is measured at **photo mid-height**, not across the full CSS gradient line. For rendered photo width W, height H, coverage C and angle θ:

- Physical gradient-line start: `(1−C)W sinθ + H cosθ/2`.
- Ramp length: `CW sinθ`.
- Each stop: `start + rampPosition × length` pixels.

This conversion uses the actual rendered aspect ratio. A normalized Figma transform cannot be copied unchanged across different image ratios.

## One shared stacked composition

A finite 3:2 photo sits above all text. It uses the selected family's vertical coverage and photo peak. Only the final **8 CSS px** blend from that peak to **100% of the same derived colour**. The solid text area below grows with content. Captions distinguish the 90%/80% photo peak from the fully opaque boundary and text area. This is a composition helper available to A and B, not a third family.

Ordinary A portraits retain the 320:471 ratio and text over the photograph. A horizontal examples use a 2:1 photo; available width below 520px selects the stack. B landscape uses 16:9 and B sides 1600:618; available width below 720px selects the stack. Two explicit mobile B examples always use it at up to 390px width. Breakpoints measure the example's available width after the sidebar. The old 3:4 portrait / 62% fade / 48px join is removed.

Insufficient space or contrast selects this same stack for either family. It does not increase the opacity cap, extend the gradient, or stretch the photo to fit the copy. Once stacked, longer copy grows only the solid area. `ResizeObserver` rechecks wrapping and font changes. Words can wrap without horizontal overflow.

## Sampling and legibility

Both families sample the relevant **50% of the displayed photo crop**: bottom for vertical/stacked layouts, text-side edge for horizontal. An 80px-wide canvas matches `object-fit: cover` and percentage `object-position`. Original pixels only enter the sampler; overlays and text panels do not. Every fourth pixel is inspected, alpha below 128 is skipped, and weight is `0.55 + 0.9 × saturation`.

The weighted RGB mean converts to HSL. Saturation uses the shared 0.95 multiplier and is clamped to 0.18–0.78. Initial lightness is `clamp(sampleLightness × 0.68, 0.08, 0.32)`. Lightness falls in 0.005 steps until the relevant contrast check reaches **7.2:1**, protecting the displayed **7:1** white-text target with a common 0.2 numerical reserve. The target is a text check, not a full-page conformance claim.

For text over a photo, the check combines the actual crop with the physical gradient at each pixel behind wrapped heading/body fragments, including a 2px margin. Empty block width is excluded; spaces inside fragments remain included. The result is the minimum composited white-text contrast, not merely the solid-swatch contrast. Results cache by crop, dimensions, gradient and text regions. If even black cannot reach the reserve, all text moves below the photo and is checked against the solid colour.

Derived tones vary with crop, viewport and text. Figma RGB examples are reference results, not universal colour tokens. Keep full-white text and the same final tone for the gradient and solid continuation. New crops, copy, fonts, animation or tint layers require new checks.

## Photographs and failures

Examples 1–3 retain `assets/figma/card-habits-2.png`, `card-women-3.png` and `card-women-1.png`. Example 4 uses `assets/card-dark-tones.png`; Example 5 uses `assets/figma/card-women-2.png` at 70%/50%; Example 6 uses `assets/card-mixed-lighting.png`. Example 7 reuses `card-women-3.png` at 50%/20%. Header examples reuse `assets/header-women-outdoors.png`. B text-right/mobile reuse `assets/community-hands.png` at 30%/50%; text-left uses `card-women-2.png` at 70%/35%. This change adds no photographs and changes no asset bytes.

Successful and failed loads are cached until reload. An eight-second timeout, missing image, unreadable canvas or no usable pixels selects a safe authored tone family. Unreadable photo data is checked against a white underlay, since the visible photo may still load. Text moves below if required. Sampling uses anonymous CORS; use same-origin or permitted images. Reload retries failures. No continuous sampling, image filters, blur, hover effects, CTAs or decorative card elements are added.

## Verify

From the repository root:

```sh
node --check reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js
node --check reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/settings.js
node --check scripts/dev/play.js
npm run lint
npm test
git diff --check
```

This static lab has no separate typecheck or build. The public export and shared site's three production builds are also checked. Configuration tests exercise legacy defaults, custom choices, conflicts, current-key precedence, fixed peaks, invalid input, caps and boundary space.

Browser checks cover desktop, tablet, 390px/320px phones and the sidebar breakpoint; all twelve views; all four controls; presets; local save/reload/Revert; migration and exports; white/missing/unreadable images; longer and enlarged copy; family peaks, exact dimensions, angle and finite stacked photos.

Neutral black-gradient/white-photo fixtures verify physical geometry. At device scale 1, CSS background paint origins can round fractional layout coordinates to the nearest pixel; compare pixel centres to the painted origin, retaining the original tolerance. Separate translated fixtures verify that rounding rather than relaxing the error threshold. Clear-region gradient-on/off comparisons check unchanged pixels. Mac screenshot colours require calibration with held-out swatches and a conservative error allowance; raw screenshot bytes are not assumed to be sRGB.
