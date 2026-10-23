# Release verification — 23 October 2026

Version 2 calculation: `prepare()` then `solve()`. All 24 existing examples retained. Card designs are fixtures, not the integration contract.

## Contrast and behaviour

- **432 rendered checks passed:** all 24 examples × targets 4.5, 7 and 7.1 × DPR 1 and 2 × Chromium, Firefox and WebKit.
- Minimum measured margin above the selected target: Chromium 0.0588; WebKit 0.0592; Firefox 0.0428.
- Screenshots hide text and inspect every background pixel in padded text-line rectangles. Reported model ratios are not used as screenshot pass evidence.
- **199 browser behaviour checks passed:** coverage extremes, all four contrast targets, override, sample edge, long copy, broken-image recovery, nested unsupported text effects and the calculation-only example. No script errors.
- Responsive checks passed at 320, 390, 768, 1121 and 1440 CSS pixels. Fractional DPR 2.5 checks passed, including a shifted component. No horizontal page overflow.
- A stalled replacement image still reaches the readable fixture fallback after its eight-second deadline, even when fonts finish meanwhile.
- **16 Node suites passed:** seven v2 public-API suites, including 400 independent exhaustive shade comparisons; nine retained legacy/config/bundle checks. The legacy tests are not counted as v2 algorithm evidence.
- Generated deliveries match maintained source; JavaScript syntax and scoped diff whitespace checks pass.

The browser matrix caught a CSS-image/Canvas resampling difference in one detailed photograph at 7.1. A tested one-step upward allowance per composited 8-bit channel fixed it. The core also keeps its explicit 0.02 numerical allowance. This is a bounded tested paint model, not a proof for every image, rendering effect or browser.

## Performance

Same desktop Chromium harness, 1440×1000, DPR 2, 24 examples; six target changes per run. These are measured calculation/controller durations, not network time or a physical-phone benchmark.

| Measure | Previous published version | Version 2 |
| --- | ---: | ---: |
| Median combined duration for a target update across 24 examples | 50.65 ms | 35.65 ms |
| Median per-example update | 2.00 ms | 1.40 ms |
| Recorded cold combined render duration | 142.20 ms | 246.10 ms |

Version 2 target updates made **zero new sample or photo-pixel reads**. No long tasks were observed during the final six warm updates. Cold load still produced long tasks and its measured render cost increased; image decoding, preparation and JIT warm-up remain real work. Do not describe the whole 24-image load as instant. Prepare components when needed and test target phones during integration.

The calculation-only minified file is 7,906 bytes (3,585 bytes gzip). Gzip is a size measurement, not a claim about server compression. The gallery controller is a separate delivery and is not required by the calculation-only integration.

## Review and limits

Three senior reviewers covered maths, runtime and integration. Their findings led to exact RGB-state search, explicit failures, full final measurements, overlap union, revision-aware caches, shared normalised gradient stops and nested-style rejection. A floating-point inverse-threshold edge case has a regression test.

Supported inputs: opaque sRGB static images, opaque white text, normal compositing, matching cover crop and returned sRGB gradient. Missing geometry, CORS-denied pixels and unsupported inputs never become an automatic passing result. A manual starting-colour override remains checked.

Physical iOS/Android devices and unrestricted P3/animated/transparent assets were not verified. Correct text measurement, input invalidation, pending/error design and whole-component accessibility remain integration responsibilities.

Root design-brain lint/test was checked separately. It is blocked by four existing unrelated `.DS_Store` files; these were preserved. Feature-specific checks above and public export verification run independently.
