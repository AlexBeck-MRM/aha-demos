# Image gradient colour — developer handover

This is a test of the colour calculation over an image. The cards already have their own design. You do not need to copy their markup, layout or stylesheet.

The bit to take is **gradient-colour.min.js**. It is one dependency-free browser file. **gradient-colour.js** is its readable source. Its API has two calls: `prepare()` and `solve()`.

## What actually happens

1. **Pick a starting colour.** The script makes a small copy of the visible image crop. It averages the bottom half, or the left/right half nearest the text. This is an average, not a median.
2. **Check where the text sits.** The component supplies the rectangles for every text line. The script reads the image pixels behind those rectangles and works out how the supplied gradient mixes with them. It checks the brightest resulting background against opaque white text.
3. **Darken only as far as needed.** If the starting colour passes, it stays. Otherwise the script searches the RGB shades between that colour and black. It returns the lightest shade on that path that passes the conservative check, including a 0.02 numerical allowance and one extra 8-bit step per composited channel for tested browser paint differences. The returned ratio comes from a complete scan of that final shade.

The small image copy picks the colour. The more detailed text-area pixels check contrast. They have different jobs.

## The two calls

```js
const ready = GradientColour.prepare({
  image,                         // Loaded HTMLImageElement; use its current source.
  imageRect: image.getBoundingClientRect(),
  objectPosition: [0.5, 0.5],     // The same cover crop as the component.
  sampleEdge: "bottom",          // Or "left" / "right".
  textRects: measuredLines,       // {left, top, right, bottom}, relative to the image.
  gradient: { coverage: 0.6, opacity: 0.9, direction: null },
  revision: layoutRevision,
  imageRevision: sourceRevision,
});

if (ready.ok) {
  const result = ready.solve({ targetContrast: 4.5 });
  if (result.ok) {
    gradientLayer.style.backgroundImage = ready.gradientCss;
    gradientLayer.style.setProperty("--image-tone-rgb", result.rgb.join(" "));
  } else {
    showApprovedFallback(result.reason);
  }
} else {
  showApprovedFallback(ready.reason);
}
```

`measuredLines`, the revision counters, the layer and `showApprovedFallback` belong to your component. They are integration inputs, not hidden services. See `integration.html` for a small working example.

Only the target changed? Reuse `ready.solve({targetContrast: 7})`. An optional editor override is `startingColour: [130, 90, 60]`; it goes through the same contrast check. Editors should get automatic colour by default, with an override only when needed.

## Your component owns these things

- Measure all visible text lines after fonts and layout settle. The gallery adds 2px around each line. Do not omit a heading, label or link that needs checking.
- Prepare again when the image, crop, image size, text, fonts, text positions, device-pixel ratio or gradient settings change. Increment `imageRevision` when the source pixels change, even if the URL is reused. Revision is returned so stale asynchronous work can be discarded.
- Keep only the latest prepared result per component; it retains the text-area pixel field. Release it on unmount.
- Keep an approved readable pending/error state. If even black cannot make the chosen fade pass, `solve()` returns `ok:false` and no RGB. Your component chooses its approved fallback. The engine does not move text, redesign a card or change the fade to hide a failure.

Invalid arguments throw `TypeError` or `RangeError`. Image loading, denied pixel access and unsupported image/text areas return `ok:false` with a reason. A miss of the 0.02 allowance is labelled separately from a miss of the requested contrast.

## Supported rendering

Use opaque **sRGB** images, opaque white text, normal compositing, `object-fit:cover`, and matching percentage focal positions. Use the returned `gradientCss` so the calculation and painted fade share the same stops. Extra tint layers, filters, blend modes, opacity, transparent images, animated images and unrestricted wide-gamut assets need separate support and tests. Normalise production assets to sRGB before expanding this contract.

Use same-origin images or correctly configured CORS. Set `crossorigin` before loading. A canvas cannot read an image when the image server refuses access. No second image request is made.

Default density is at least two analysis pixels per CSS pixel, or device density when higher. Overlapping line rectangles are checked once. Reads are bounded to the text area, with a 4-million-pixel guard. Target-only changes read no new image pixels. The calculation is synchronous: test it in the actual component on target phones before making a performance claim.

The default target is **4.5:1** for AA normal text. **7:1** is AAA normal text; the demo also allows **7.1:1**. These are text-contrast checks, not certification of the whole component. Rectangle checks include spaces; the result is the lightest passing shade on this RGB path under this conservative model, not a universal optical minimum.

For an existing approved solid text panel, use explicit `mode:"solid"` with `colour:[r,g,b]`. Never substitute that check for text over a photograph.

## What is just the demo?

The gallery keeps all **24 examples**: 12 original, six Healthy Living photographs and six synthetic stress tests. `adapter.js`, `surface.css`, `script.js`, `settings.js` and `examples.js` run those fixtures and controls. Their existing stacked/solid fallback demonstrates one option. It is not a card design instruction.

`adaptive-colour.min.js` combines the engine with that gallery controller. Products that need only the calculation should use the smaller `gradient-colour.min.js`. `engine.js` remains a legacy reference; it is not the v2 source.

## Build and check

Consumers can use the supplied minified file without a build step. Maintainers need Node, esbuild, Playwright and pngjs. Commands below run from this folder; module-path environment variables can point to an existing installation.

```sh
node build.cjs --check
node --test verify-gradient.cjs verify.cjs
node verify-browser.cjs http://127.0.0.1:4179/reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/
node verify-render.cjs http://127.0.0.1:4179/reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/
node verify-standalone.cjs http://127.0.0.1:4179/reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/
```

`verify-gradient.cjs` checks the v2 public contract, independent exhaustive shade comparisons, failure states, overlap union, cache invalidation and gradient stop order. `verify.cjs` retains legacy/config regression checks and the bundle checksum. Screenshot checks measure the painted background with text hidden, rather than trusting the engine's own reported ratio. See `VERIFICATION.md` for this release's results and limits.

Healthy Living source provenance is in `assets/healthy-living/provenance.json`. The synthetic calibration fields are labelled separately from photographs.

Standards: [W3C AA normal-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [W3C AAA normal-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html). Compare unrounded ratios.
