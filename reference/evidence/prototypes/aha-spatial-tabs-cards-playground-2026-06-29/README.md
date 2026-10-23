# Adaptive image colour

A browser demo of automatic photo-derived colour with white-text contrast checks. All twelve original examples, source photos, copy and focal positions are retained. Six Healthy Living still-life photographs created on 22 October and six labelled synthetic extreme-image tests bring the gallery to 24 examples. The synthetic tests cover pure white, near-black, neutral grey, black/white detail, bright colours and a small white hotspot. Optimised WebP derivatives reduce the eight photo downloads from 27.9 MB to 4.3 MB; original PNGs are kept. Default: **4.5:1 (AA)**. Live control: **4.5–7.1:1**. AAA normal-text contrast begins at **7:1**.

## Developer handover

Open `integration.html` for a runnable, one-card implementation. Copy **adaptive-colour.min.js** and **surface.css**. The readable **adaptive-colour.js** is included for inspection; **engine.js** and **adapter.js** are maintained source files, not separate browser requests. The gallery, controls, example data, config migration and local server are demo utilities; a product does not need them.

```html
<link rel="stylesheet" href="surface.css">
<div class="image-surface is-pending" id="card" style="--photo-position:50% 50%">
  <img class="image-photo" src="photo.jpg" alt="">
  <div class="image-gradient" aria-hidden="true"></div>
  <div class="image-content">
    <div class="image-copy">
      <h2 class="image-title">Heading</h2>
      <p class="image-body">Supporting text.</p>
    </div>
  </div>
</div>
<script src="adaptive-colour.min.js"></script>
```

```js
const controller = attachAdaptiveColour(document.querySelector('#card'), {
  targetContrast: 4.5,
  // Defaults: bottom half, portrait crop, 60% fade coverage, 90% peak.
  onResult(result) {
    // result.source: automatic | override | fallback
    // result.contrast: unrounded worst-case ratio
    // result.error: actual image-reading error, if present
  },
});
controller.update({ targetContrast: 7.1 });
controller.update({ override: [130, 90, 60] }); // Still contrast-checked.
controller.update({ override: null }); // Resume automatic colour.
controller.refresh(); // After changing object-position or other crop CSS.
controller.destroy(); // On component unmount.
```

## What the engine does

1. Read the displayed `<img>` and its current source. Reproduce its actual `object-fit: cover` crop and two percentage `object-position` values.
2. Average the bottom 50%, or the left/right 50% nearest the text. A small 80px-wide copy is sufficient for this representative colour. Alpha weights exclude transparent pixels. There is no saturation boost or minimum saturation that could tint a grey image.
3. Read only the union of the text areas at a minimum analysis density of 2 pixels per CSS pixel, or the device pixel ratio when higher. Preserve the full-photo cover transform and device-pixel phase when drawing this bounded area. The small colour sample never substitutes for this check. Solid text panels skip photo contrast readback entirely.
4. Measure each wrapped heading/body line, including a 2px safety boundary. One physical gradient-stop model drives the CSS fade and pixel analysis.
5. Check composited photo and fade pixels against white. If the sampled colour already passes, use it. Otherwise binary-search the lightest passing colour along its RGB path towards black. Reject a failing candidate immediately; scan the final rounded colour completely to report its actual worst contrast. The selected target has a disclosed 0.02 numerical margin.
6. If even black cannot make the existing fade pass, or the copy does not fit, put all text on a fully opaque colour below the photo. If image reading fails, also use this solid fallback and report the actual error.

The pending state immediately reserves the image space and keeps text on a solid dark background until checked. Colour sampling is cached separately from contrast, so target changes never resample the image. Pixel fields use one typed allocation and do not retain canvas backing stores.

The process darkens only as much as needed. It does not lighten a naturally dark sampled colour, so some examples need no change between AA and AAA. Contrast is conservative over text-line rectangles, including spaces, rather than individual glyph outlines. It is a browser-paint model, independently checked against screenshots; it does not claim full accessibility conformance.

## Integration limits

- Use **white text**, `object-fit: cover`, and two percentage positions such as `70% 35%`. This small adapter deliberately does not parse every CSS crop syntax.
- Use same-origin images, or CORS-enabled images with the image's `crossorigin` attribute configured **before loading**. The engine creates no second image request. `srcset`/`currentSrc`, image loading, font changes, copy changes and resizes trigger refreshes. Call `refresh()` after other style changes that do not alter dimensions.
- Keep text free of independent opacity and keep photo filters, extra tint layers, blend modes and motion outside this contract. Those change the pixels and need corresponding checks.
- Options `aspect`, `direction` (`left`/`right`/null), `stacked`, `coverage`, `stackedCoverage`, and `opacity` describe the existing layout. The demo's A/B mapping is outside the engine. Every stacked layout uses vertical coverage; its final 8px join reaches the solid colour.
- Manual override sets a starting colour, not a bypass of the contrast guard. Keep automatic selection as the editor default.

## Files

| File | Responsibility |
| --- | --- |
| `adaptive-colour.min.js` | One browser request; no runtime dependencies |
| `adaptive-colour.js` | Readable version of the same delivery |
| `engine.js` | Maintained sampling, crop, gradient and contrast source |
| `adapter.js` | One component controller; image, text, resize and font lifecycle |
| `surface.css` | Required component styling; no demo dependencies |
| `integration.html` | Minimal runnable developer example |
| `examples.js` | The 24 examples (12 original, 6 Healthy Living, 6 synthetic tests) |
| `script.js` | Gallery and side controls, diagnostics, save/export |
| `settings.js` | Validated demo config and migration to v5 |
| `verify.cjs` | Behavioural checks, final contrast, bounded coordinates and bundle checksum |
| `verify-standalone.cjs` | Independent stylesheet, one-script delivery and fractional-DPR paint checks |
| `build.cjs` | Development-only deterministic delivery generation |

## Saving and verification

The managed local runner supports Save. GitHub Pages is static; Save selects config for copying and says so. Config v5 retains the four A/B coverage values, adds the target, and optionally stores validated overrides. Earlier configs adopt AA by default. Copy CSS is a snapshot at the current dimensions; it does not replace the responsive engine.

```sh
# Only for maintainers; consumers need no build step:
node reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/build.cjs --check
node --test reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/verify.cjs
node --check reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/engine.js
node --check reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/adapter.js
node --check reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/script.js
# Optional browser checks from the design-brain repo (Playwright + pngjs installed):
node reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/verify-browser.cjs
node reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/verify-render.cjs
node reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/verify-standalone.cjs
git diff --check
```

Standards: [W3C AA contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [W3C AAA contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html). These are text-contrast thresholds, not whole-component accessibility certification.

## Additional image provenance

The six Healthy Living images are delivery derivatives of the original 22 October image-generation outputs. Their source checksums and dimensions are recorded in `assets/healthy-living/provenance.json`. No gradients or text from the Figma cards are baked into these images; the live component applies its own sampled colour and contrast check. Synthetic SVG calibration fields are labelled separately from photographs.
