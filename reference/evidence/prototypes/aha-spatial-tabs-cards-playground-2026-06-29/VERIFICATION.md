# Adaptive colour verification — 27 October 2026

## Current behaviour

Automatic image-derived colours receive a modest 12% increase in HSV saturation
before the existing contrast solve. The maximum RGB channel value is retained,
the increase is capped to avoid clipping, and neutral greys stay neutral. Raw
samples remain available separately. Explicit editor overrides and authored solid
fallback colours are not boosted; all chosen colours still pass through the
contrast check.

The two-call `prepare()` / `solve()` interface, approved gradient geometry,
responsive layouts and fallback rules remain in place. The readable delivery
keeps the maintained source and comments. Production files use the existing build.

## Verification

- 13 source tests, including 400 independent exhaustive shade comparisons and the new saturation/override regression check.
- 205 Chromium behaviour checks across all 24 examples, with zero script errors.
- 432 rendered contrast cases across Chromium, WebKit and Firefox: 24 examples × three contrast targets × two display densities × three engines.
- Responsive checks at widths 320, 390, 768, 1121 and 1440 with DPR 1/2.
- Standalone component checks, including rendered contrast at DPR 2.5.
- Before/after desktop and mobile visual inspection, source/build checksum checks, JavaScript syntax and scoped whitespace checks.

The retained 24 examples include twelve original treatments, six Healthy Living
photographs and six labelled synthetic stress tests. The previous local refactor
also passed 1,200 differential calculations and 288 same-image comparisons before
this intentional colour change. The obsolete engine, outdated ZIP and unused assets have been removed. The PNG
shared with the parallax demo is retained. Current tests exercise the public
calculation directly.

## Reproduce

Run from this folder with the existing esbuild, Playwright and pngjs development
dependencies available:

```sh
node --test verify-gradient.cjs verify.cjs
node build.cjs --check
node verify-browser.cjs http://127.0.0.1:4179/reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/
node verify-render.cjs http://127.0.0.1:4179/reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/
node verify-standalone.cjs http://127.0.0.1:4179/reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/
```

Set `BROWSER_ENGINE=webkit` or `BROWSER_ENGINE=firefox` for the other render engines.
The default is Chromium. Module-path environment variables can point to an existing
installation; there are no new production runtime dependencies.

## Limits

These are text-contrast and browser checks, not whole-component WCAG certification
or physical-phone benchmarks. Product integration still needs its real fonts,
content, supported browsers and image CDN/CORS configuration. The rendering
contract is opaque sRGB images, opaque white text and matching normal compositing.

The private authoring repository's root lint/test remains blocked by unrelated
Finder metadata files; feature verification is recorded separately above.
