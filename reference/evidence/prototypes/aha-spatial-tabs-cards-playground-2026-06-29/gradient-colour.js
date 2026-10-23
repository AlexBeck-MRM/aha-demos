/* Image-gradient calculation v2. No component styles, layout changes or observers. */
(function (root) {
  "use strict";
  const MARGIN = 0.02;
  const SAMPLE_WIDTH = 80;
  const MAX_PIXELS = 4000000;
  const samples = new WeakMap();
  const linear = Array.from({ length: 256 }, (_, channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const now = () => typeof performance === "undefined" ? Date.now() : performance.now();
  const finite = (value) => Number.isFinite(value);
  const clamp = (value, low, high) => Math.min(high, Math.max(low, value));

  function validateRGB(rgb) {
    if (!Array.isArray(rgb) || rgb.length !== 3 || !rgb.every((value) => Number.isInteger(value) && value >= 0 && value <= 255)) {
      throw new TypeError("Use three integer RGB channels between 0 and 255.");
    }
  }
  function unavailable(reason, revision) {
    return Object.freeze({ ok: false, reason, revision, version: 2 });
  }
  function fail(reason) {
    const error = new Error(reason);
    error.reason = reason;
    throw error;
  }
  function context(canvas) {
    const result = canvas.getContext("2d", { willReadFrequently: true, colorSpace: "srgb" });
    if (!result) fail("pixel-access-unavailable");
    return result;
  }
  function draw(context2d, image, width, height, position) {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
    context2d.drawImage(image, (width - w) * position[0], (height - h) * position[1], w, h);
  }
  function sample(image, bounds, position, edge, imageRevision, metrics) {
    const width = SAMPLE_WIDTH;
    const height = Math.max(1, Math.round(width * bounds.height / bounds.width));
    if (width * height > MAX_PIXELS) fail("unsupported-image-area");
    const key = JSON.stringify([imageRevision, image.currentSrc || image.src, bounds.width / bounds.height, width, height, position, edge]);
    const cached = samples.get(image);
    if (cached?.key === key) return [...cached.rgb];
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    try {
      const ctx = context(canvas);
      draw(ctx, image, width, height, position);
      const x = edge === "right" ? Math.floor(width / 2) : 0;
      const y = edge === "bottom" ? Math.floor(height / 2) : 0;
      const w = edge === "left" ? Math.ceil(width / 2) : width - x;
      const pixels = ctx.getImageData(x, y, w, height - y).data;
      const rgb = [0, 0, 0];
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] !== 255) fail("unsupported-transparency");
        for (let c = 0; c < 3; c++) rgb[c] += pixels[i + c];
      }
      const result = rgb.map((value) => Math.round(value / (pixels.length / 4)));
      samples.set(image, { key, rgb: result });
      metrics.sampleReads++;
      return [...result];
    } finally { canvas.width = 0; canvas.height = 0; }
  }
  function gradientModel(width, height, settings) {
    if (!settings || !finite(settings.coverage) || settings.coverage <= 0 || settings.coverage > 1
      || !finite(settings.opacity) || settings.opacity < 0 || settings.opacity > 1
      || ![null, "left", "right"].includes(settings.direction ?? null)) {
      throw new RangeError("Use a supported gradient direction, coverage and opacity.");
    }
    const direction = settings.direction ?? null;
    const angle = direction ? (direction === "right" ? 120 : 240) : 180;
    const dx = Math.sin(angle * Math.PI / 180), dy = -Math.cos(angle * Math.PI / 180);
    const length = Math.abs(width * dx) + Math.abs(height * dy);
    const start = direction ? (1 - settings.coverage) * width * Math.abs(dx) + height * Math.abs(dy) / 2 : (1 - settings.coverage) * height;
    const span = direction ? settings.coverage * width * Math.abs(dx) : settings.coverage * height;
    let stops = [[0, 0], [0.2, 0.15], [0.4, 0.8], [0.8, 1], [1, 1]]
      .map(([position, alpha]) => [start + position * span, alpha * settings.opacity]);
    if (settings.stacked) stops = [...stops.slice(0, -1), [height - 8, settings.opacity], [height, 1]];
    let previous = -Infinity;
    stops = stops.map(([position, opacity]) => { previous = Math.max(previous, position); return [previous, opacity]; });
    const css = `linear-gradient(${angle}deg in srgb, ${stops.map(([position, alpha]) => `rgb(var(--image-tone-rgb) / ${alpha}) ${position}px`).join(", ")})`;
    return { width, height, dx, dy, length, stops, css };
  }
  function alpha(model, x, y) {
    const distance = (x - model.width / 2) * model.dx + (y - model.height / 2) * model.dy + model.length / 2;
    if (distance <= model.stops[0][0]) return model.stops[0][1];
    for (let i = 1; i < model.stops.length; i++) {
      const [end, endAlpha] = model.stops[i], [start, startAlpha] = model.stops[i - 1];
      if (distance <= end) return startAlpha + (endAlpha - startAlpha) * (distance - start) / (end - start);
    }
    return model.stops.at(-1)[1];
  }
  function prepareField(image, bounds, position, regions, density, model, metrics) {
    if (!Array.isArray(regions) || !regions.length) throw new TypeError("Supply every text-line rectangle.");
    for (const region of regions) {
      if (!region || ![region.left, region.top, region.right, region.bottom].every(finite)
        || region.right <= region.left || region.bottom <= region.top) throw new TypeError("Text rectangles must be finite and non-empty.");
      if (region.left < 0 || region.top < 0 || region.right > bounds.width || region.bottom > bounds.height) fail("unsupported-text-area");
    }
    const offsetX = bounds.left - Math.floor(bounds.left * density) / density;
    const offsetY = bounds.top - Math.floor(bounds.top * density) / density;
    const originX = Math.floor((Math.min(...regions.map((r) => r.left)) + offsetX) * density);
    const originY = Math.floor((Math.min(...regions.map((r) => r.top)) + offsetY) * density);
    const width = Math.ceil((Math.max(...regions.map((r) => r.right)) + offsetX) * density) - originX;
    const height = Math.ceil((Math.max(...regions.map((r) => r.bottom)) + offsetY) * density) - originY;
    if (width * height > MAX_PIXELS) fail("unsupported-image-area");
    const rows = Array.from({ length: height }, () => []);
    for (const region of regions) {
      const left = clamp(Math.floor((region.left + offsetX) * density) - originX, 0, width);
      const right = clamp(Math.ceil((region.right + offsetX) * density) - originX, 0, width);
      const top = clamp(Math.floor((region.top + offsetY) * density) - originY, 0, height);
      const bottom = clamp(Math.ceil((region.bottom + offsetY) * density) - originY, 0, height);
      for (let y = top; y < bottom; y++) rows[y].push([left, right]);
    }
    let count = 0;
    const merged = rows.map((spans) => {
      spans.sort((a, b) => a[0] - b[0]);
      const union = [];
      for (const span of spans) {
        const last = union.at(-1);
        if (last && span[0] <= last[1]) last[1] = Math.max(last[1], span[1]);
        else union.push([...span]);
      }
      for (const [left, right] of union) count += right - left;
      return union;
    });
    if (!count) fail("unsupported-text-area");
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    try {
      const ctx = context(canvas);
      ctx.setTransform(density, 0, 0, density, offsetX * density - originX, offsetY * density - originY);
      draw(ctx, image, bounds.width, bounds.height, position);
      const pixels = ctx.getImageData(0, 0, width, height).data;
      const field = new Float32Array(count * 4);
      let output = 0;
      for (let y = 0; y < height; y++) for (const [left, right] of merged[y]) for (let x = left; x < right; x++) {
        const index = (y * width + x) * 4;
        if (pixels[index + 3] !== 255) fail("unsupported-transparency");
        const a = alpha(model, (x + originX + 0.5) / density - offsetX, (y + originY + 0.5) / density - offsetY);
        field[output++] = pixels[index] * (1 - a);
        field[output++] = pixels[index + 1] * (1 - a);
        field[output++] = pixels[index + 2] * (1 - a);
        field[output++] = a;
      }
      metrics.pixelReads++;
      metrics.checkedPixels = count;
      metrics.fieldBytes = field.byteLength;
      metrics.readbackBytes = pixels.byteLength;
      return field;
    } finally { canvas.width = 0; canvas.height = 0; }
  }
  function whiteContrast(rgb) {
    return 1.05 / (linear[rgb[0]] * 0.2126 + linear[rgb[1]] * 0.7152 + linear[rgb[2]] * 0.0722 + 0.05);
  }
  function checkField(field, rgb, required = 0) {
    const limit = required ? 1.05 / required - 0.05 : Infinity;
    const r = rgb[0], g = rgb[1], b = rgb[2];
    let brightest = 0;
    for (let i = 0; i < field.length; i += 4) {
      const a = field[i + 3];
      // Round upward plus one 8-bit step for tested browser paint differences.
      // This is a small pixel allowance, not a larger arbitrary contrast target.
      const red = Math.ceil(field[i] + r * a) + 1;
      const green = Math.ceil(field[i + 1] + g * a) + 1;
      const blue = Math.ceil(field[i + 2] + b * a) + 1;
      const luminance = linear[red > 255 ? 255 : red] * 0.2126 + linear[green > 255 ? 255 : green] * 0.7152 + linear[blue > 255 ? 255 : blue] * 0.0722;
      if (luminance > brightest) brightest = luminance;
      // Confirm using the same ratio comparison as solve; inversion can differ by one ULP.
      if (brightest > limit && 1.05 / (brightest + 0.05) < required) break;
    }
    return 1.05 / (brightest + 0.05);
  }
  // Exact 8-bit states on round(startRGB * scale), using rational transition ordering.
  function shades(rgb) {
    const events = [];
    rgb.forEach((channel, index) => {
      for (let step = 0; step < channel; step++) events.push({ n: 2 * step + 1, d: 2 * channel, index });
    });
    events.sort((a, b) => a.n * b.d - b.n * a.d);
    const colour = [0, 0, 0], result = [[...colour]];
    for (let i = 0; i < events.length;) {
      const first = events[i];
      do { colour[events[i].index]++; i++; }
      while (i < events.length && first.n * events[i].d === events[i].n * first.d);
      result.push([...colour]);
    }
    return result;
  }
  function prepare(input) {
    if (!input || typeof input !== "object") throw new TypeError("Supply calculation inputs.");
    const { image, imageRect: bounds, revision, imageRevision = revision } = input;
    const mode = input.mode ?? "overlay";
    if (!["overlay", "solid"].includes(mode)) throw new TypeError("Mode must be overlay or explicitly solid.");
    if (!["string", "number"].includes(typeof revision) || (typeof revision === "number" && !finite(revision))) throw new TypeError("Supply a finite input revision.");
    let starting = input.colour;
    if (starting !== undefined) validateRGB(starting);
    if (mode === "overlay" && starting !== undefined) throw new TypeError("Pass an editor colour to solve, not overlay preparation.");
    const metrics = { sampleReads: 0, pixelReads: 0, checkedPixels: 0, fieldBytes: 0, readbackBytes: 0 };
    const started = now();
    let field, model;
    try {
      if (image) {
        if (!image.complete) return unavailable("image-not-ready", revision);
        if (!image.naturalWidth || !image.naturalHeight) return unavailable("image-load-failed", revision);
        if (!bounds || ![bounds.left, bounds.top, bounds.width, bounds.height].every(finite)
          || bounds.width <= 0 || bounds.height <= 0) throw new TypeError("Supply the displayed image rectangle.");
        const position = input.objectPosition ?? [0.5, 0.5];
        if (!Array.isArray(position) || position.length !== 2 || !position.every((value) => finite(value) && value >= 0 && value <= 1)) throw new TypeError("Use two focal-position fractions between 0 and 1.");
        const edge = input.sampleEdge ?? "bottom";
        if (!["bottom", "left", "right"].includes(edge)) throw new TypeError("Sample edge must be bottom, left or right.");
        starting = sample(image, bounds, position, edge, imageRevision, metrics);
        model = gradientModel(bounds.width, bounds.height, input.gradient);
        if (mode === "overlay") {
          const density = input.density ?? Math.max(2, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1);
          if (!finite(density) || density < 1) throw new RangeError("Analysis density must be at least one pixel per CSS pixel.");
          field = prepareField(image, bounds, position, input.textRects, density, model, metrics);
        }
      } else if (mode === "overlay") {
        throw new TypeError("Overlay calculation requires the loaded image and every text region.");
      } else if (!starting) throw new TypeError("An explicit solid calculation needs a starting colour.");
    } catch (error) {
      if (error instanceof TypeError || error instanceof RangeError) throw error;
      return unavailable(error.reason || (error.name === "SecurityError" ? "pixel-access-denied" : "pixel-access-unavailable"), revision);
    }
    const sampleRGB = Object.freeze([...starting]);
    let ramp, rampKey;
    metrics.prepareMs = now() - started;
    const measure = field ? (rgb, required) => checkField(field, rgb, required) : whiteContrast;
    function solve({ targetContrast = 4.5, startingColour } = {}) {
      if (!finite(targetContrast) || targetContrast < 4.5 || targetContrast > 7.1) throw new RangeError("Contrast must be between 4.5 and 7.1.");
      const original = startingColour === undefined || startingColour === null ? sampleRGB : startingColour;
      validateRGB(original);
      const requiredContrast = targetContrast + MARGIN;
      const details = { version: 2, mode, revision, targetContrast, requiredContrast, margin: MARGIN };
      function finish(rgb, contrast = measure(rgb)) {
        const ok = contrast >= requiredContrast;
        return Object.freeze({ ...details, ok, contrast, reason: ok ? "" : contrast >= targetContrast ? "insufficient-safety-margin" : "insufficient-contrast", ...(ok ? { rgb: Object.freeze([...rgb]) } : {}) });
      }
      const originalContrast = measure(original, requiredContrast);
      // Passing threshold scans already visited every pixel; reuse that complete measurement.
      if (originalContrast >= requiredContrast) return finish(original, originalContrast);
      const blackContrast = measure([0, 0, 0], requiredContrast);
      if (blackContrast < requiredContrast) return finish([0, 0, 0]);
      const key = original.join(",");
      if (key !== rampKey) { ramp = shades(original); rampKey = key; }
      let low = 0, high = ramp.length - 1, lowContrast = blackContrast;
      while (high - low > 1) {
        const middle = Math.floor((low + high) / 2);
        const contrast = measure(ramp[middle], requiredContrast);
        if (contrast >= requiredContrast) { low = middle; lowContrast = contrast; }
        else high = middle;
      }
      return finish(ramp[low], lowContrast);
    }
    return Object.freeze({ ok: true, version: 2, mode, revision, sample: sampleRGB, gradientCss: model?.css ?? null, metrics: Object.freeze(metrics), solve });
  }
  const api = Object.freeze({ version: 2, prepare });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.GradientColour = api;
})(typeof window === "undefined" ? this : window);
