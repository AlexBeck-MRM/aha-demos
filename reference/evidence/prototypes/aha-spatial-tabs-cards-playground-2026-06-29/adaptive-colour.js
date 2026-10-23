/* Adaptive image colour. Source SHA256: 1c6571ae97b0557b0171906421c444612ba4362d1ea91e1fb11604e0a4f868e8 */
(function(root) {
  "use strict";
  const MARGIN = 0.02;
  const SAMPLE_WIDTH = 80;
  const MAX_PIXELS = 4e6;
  const samples = /* @__PURE__ */ new WeakMap();
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
    canvas.width = width;
    canvas.height = height;
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
    } finally {
      canvas.width = 0;
      canvas.height = 0;
    }
  }
  function gradientModel(width, height, settings) {
    if (!settings || !finite(settings.coverage) || settings.coverage <= 0 || settings.coverage > 1 || !finite(settings.opacity) || settings.opacity < 0 || settings.opacity > 1 || ![null, "left", "right"].includes(settings.direction ?? null)) {
      throw new RangeError("Use a supported gradient direction, coverage and opacity.");
    }
    const direction = settings.direction ?? null;
    const angle = direction ? direction === "right" ? 120 : 240 : 180;
    const dx = Math.sin(angle * Math.PI / 180), dy = -Math.cos(angle * Math.PI / 180);
    const length = Math.abs(width * dx) + Math.abs(height * dy);
    const start = direction ? (1 - settings.coverage) * width * Math.abs(dx) + height * Math.abs(dy) / 2 : (1 - settings.coverage) * height;
    const span = direction ? settings.coverage * width * Math.abs(dx) : settings.coverage * height;
    let stops = [[0, 0], [0.2, 0.15], [0.4, 0.8], [0.8, 1], [1, 1]].map(([position, alpha2]) => [start + position * span, alpha2 * settings.opacity]);
    if (settings.stacked) stops = [...stops.slice(0, -1), [height - 8, settings.opacity], [height, 1]];
    let previous = -Infinity;
    stops = stops.map(([position, opacity]) => {
      previous = Math.max(previous, position);
      return [previous, opacity];
    });
    const css = `linear-gradient(${angle}deg in srgb, ${stops.map(([position, alpha2]) => `rgb(var(--image-tone-rgb) / ${alpha2}) ${position}px`).join(", ")})`;
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
      if (!region || ![region.left, region.top, region.right, region.bottom].every(finite) || region.right <= region.left || region.bottom <= region.top) throw new TypeError("Text rectangles must be finite and non-empty.");
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
    canvas.width = width;
    canvas.height = height;
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
    } finally {
      canvas.width = 0;
      canvas.height = 0;
    }
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
      const red = Math.ceil(field[i] + r * a) + 1;
      const green = Math.ceil(field[i + 1] + g * a) + 1;
      const blue = Math.ceil(field[i + 2] + b * a) + 1;
      const luminance = linear[red > 255 ? 255 : red] * 0.2126 + linear[green > 255 ? 255 : green] * 0.7152 + linear[blue > 255 ? 255 : blue] * 0.0722;
      if (luminance > brightest) brightest = luminance;
      if (brightest > limit && 1.05 / (brightest + 0.05) < required) break;
    }
    return 1.05 / (brightest + 0.05);
  }
  function shades(rgb) {
    const events = [];
    rgb.forEach((channel, index) => {
      for (let step = 0; step < channel; step++) events.push({ n: 2 * step + 1, d: 2 * channel, index });
    });
    events.sort((a, b) => a.n * b.d - b.n * a.d);
    const colour = [0, 0, 0], result = [[...colour]];
    for (let i = 0; i < events.length; ) {
      const first = events[i];
      do {
        colour[events[i].index]++;
        i++;
      } while (i < events.length && first.n * events[i].d === events[i].n * first.d);
      result.push([...colour]);
    }
    return result;
  }
  function prepare(input) {
    if (!input || typeof input !== "object") throw new TypeError("Supply calculation inputs.");
    const { image, imageRect: bounds, revision, imageRevision = revision } = input;
    const mode = input.mode ?? "overlay";
    if (!["overlay", "solid"].includes(mode)) throw new TypeError("Mode must be overlay or explicitly solid.");
    if (!["string", "number"].includes(typeof revision) || typeof revision === "number" && !finite(revision)) throw new TypeError("Supply a finite input revision.");
    let starting = input.colour;
    if (starting !== void 0) validateRGB(starting);
    if (mode === "overlay" && starting !== void 0) throw new TypeError("Pass an editor colour to solve, not overlay preparation.");
    const metrics = { sampleReads: 0, pixelReads: 0, checkedPixels: 0, fieldBytes: 0, readbackBytes: 0 };
    const started = now();
    let field, model;
    try {
      if (image) {
        if (!image.complete) return unavailable("image-not-ready", revision);
        if (!image.naturalWidth || !image.naturalHeight) return unavailable("image-load-failed", revision);
        if (!bounds || ![bounds.left, bounds.top, bounds.width, bounds.height].every(finite) || bounds.width <= 0 || bounds.height <= 0) throw new TypeError("Supply the displayed image rectangle.");
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
      const original = startingColour === void 0 || startingColour === null ? sampleRGB : startingColour;
      validateRGB(original);
      const requiredContrast = targetContrast + MARGIN;
      const details = { version: 2, mode, revision, targetContrast, requiredContrast, margin: MARGIN };
      function finish(rgb, contrast = measure(rgb)) {
        const ok = contrast >= requiredContrast;
        return Object.freeze({ ...details, ok, contrast, reason: ok ? "" : contrast >= targetContrast ? "insufficient-safety-margin" : "insufficient-contrast", ...ok ? { rgb: Object.freeze([...rgb]) } : {} });
      }
      const originalContrast = measure(original, requiredContrast);
      if (originalContrast >= requiredContrast) return finish(original, originalContrast);
      const blackContrast = measure([0, 0, 0], requiredContrast);
      if (blackContrast < requiredContrast) return finish([0, 0, 0]);
      const key = original.join(",");
      if (key !== rampKey) {
        ramp = shades(original);
        rampKey = key;
      }
      let low = 0, high = ramp.length - 1, lowContrast = blackContrast;
      while (high - low > 1) {
        const middle = Math.floor((low + high) / 2);
        const contrast = measure(ramp[middle], requiredContrast);
        if (contrast >= requiredContrast) {
          low = middle;
          lowContrast = contrast;
        } else high = middle;
      }
      return finish(ramp[low], lowContrast);
    }
    return Object.freeze({ ok: true, version: 2, mode, revision, sample: sampleRGB, gradientCss: model?.css ?? null, metrics: Object.freeze(metrics), solve });
  }
  const api = Object.freeze({ version: 2, prepare });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.GradientColour = api;
})(typeof window === "undefined" ? this : window);
(function(root) {
  "use strict";
  const colour = root.GradientColour;
  const hex = (rgb) => `#${rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
  const IMAGE_TIMEOUT_MS = 8e3;
  function validateOptions(options) {
    if (!Number.isFinite(options.targetContrast) || options.targetContrast < 4.5 || options.targetContrast > 7.1) {
      throw new RangeError("Contrast must be between 4.5 and 7.1.");
    }
    if (!Number.isFinite(options.aspect) || options.aspect <= 0) {
      throw new RangeError("The image aspect ratio must be positive.");
    }
    for (const key of ["coverage", "stackedCoverage", "opacity"]) {
      const value = options[key];
      if (key === "stackedCoverage" && value === void 0) {
        continue;
      }
      if (!Number.isFinite(value) || value < 0 || value > 1 || key !== "opacity" && value === 0) {
        throw new RangeError(`${key} must be between 0 and 1.`);
      }
    }
    if (![null, "left", "right"].includes(options.direction)) {
      throw new TypeError("Direction must be left, right or null.");
    }
    for (const key of ["fallback", "override"]) {
      const rgb = options[key];
      if (key === "override" && rgb === null) {
        continue;
      }
      if (!Array.isArray(rgb) || rgb.length !== 3 || !rgb.every((channel) => Number.isInteger(channel) && channel >= 0 && channel <= 255)) {
        throw new TypeError("Colours must contain three integer RGB channels between 0 and 255.");
      }
    }
  }
  function attachAdaptiveColour(surface, settings = {}) {
    const image = settings.image || surface?.querySelector(".image-photo");
    const text = settings.text || surface?.querySelector(".image-copy");
    const content = surface?.querySelector(".image-content");
    if (!surface || !image || !text || !content) {
      throw new TypeError("The component needs a surface, image, content wrapper and text wrapper.");
    }
    let options = {
      targetContrast: 4.5,
      coverage: 0.6,
      opacity: 0.9,
      aspect: 320 / 471,
      direction: null,
      stacked: false,
      override: null,
      fallback: [50, 50, 50],
      ...settings
    };
    validateOptions(options);
    let frame = 0;
    let destroyed = false;
    let analysis;
    let analysisKey = "";
    let revision = 0;
    let imageRevision = 0;
    let observed = "";
    let loadingExpired = false;
    let loadTimeout;
    surface.classList.add("is-pending");
    function startLoadingDeadline() {
      clearTimeout(loadTimeout);
      loadingExpired = false;
      if (!image.complete) {
        loadTimeout = setTimeout(() => {
          loadingExpired = true;
          refresh();
        }, IMAGE_TIMEOUT_MS);
      }
    }
    function fingerprint() {
      return [surface, image, text].flatMap((node) => {
        const rect = node.getBoundingClientRect();
        return [rect.left, rect.top, rect.width, rect.height];
      }).join(":");
    }
    function setLayout(stacked) {
      surface.classList.toggle("is-stacked", stacked);
      surface.dataset.layout = stacked ? "mobile" : options.direction ? "horizontal" : "vertical";
      surface.dataset.horizontalDirection = options.direction || "";
      surface.dataset.contentPlacement = stacked ? "below" : "overlay";
      const width = surface.getBoundingClientRect().width;
      const height = stacked ? width * 2 / 3 : width / options.aspect;
      surface.style.setProperty("--image-photo-height", `${height}px`);
    }
    function readPosition() {
      const style = getComputedStyle(image);
      const parts = style.objectPosition.split(/\s+/);
      if (style.objectFit !== "cover") {
        throw new Error("This component requires object-fit: cover.");
      }
      if (parts.length !== 2 || !parts.every((part) => /^-?[\d.]+%$/.test(part))) {
        throw new Error("Use two percentage values for object-position, for example 50% 50%.");
      }
      return parts.map((part) => parseFloat(part) / 100);
    }
    function readRegions(bounds) {
      const range = document.createRange();
      const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
      const regions = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent.trim()) continue;
        const style = getComputedStyle(node.parentElement);
        if (style.color !== "rgb(255, 255, 255)") throw new Error("unsupported-text-style");
        for (let parent = node.parentElement; parent; parent = parent.parentElement) {
          const paint = getComputedStyle(parent);
          if (Number(paint.opacity) !== 1 || paint.filter !== "none" || paint.mixBlendMode !== "normal" || paint.transform !== "none") throw new Error("unsupported-text-style");
          if (parent === surface) break;
        }
        range.selectNodeContents(node);
        for (const rect of range.getClientRects()) {
          if (!rect.width || !rect.height) continue;
          const left = rect.left - bounds.left, top = rect.top - bounds.top;
          const right = rect.right - bounds.left, bottom = rect.bottom - bounds.top;
          if (left < 0 || top < 0 || right > bounds.width || bottom > bounds.height) throw new Error("unsupported-text-area");
          regions.push({ left: Math.max(0, left - 2), top: Math.max(0, top - 2), right: Math.min(bounds.width, right + 2), bottom: Math.min(bounds.height, bottom + 2) });
        }
      }
      return regions;
    }
    function measure(stacked) {
      const bounds = image.getBoundingClientRect();
      const position = readPosition();
      for (const node of [surface, image, text, content]) {
        const style = getComputedStyle(node);
        if (style.filter !== "none" || style.mixBlendMode !== "normal" || Number(style.opacity) !== 1 || style.transform !== "none") throw new Error("unsupported-rendering");
      }
      const edge = !stacked && options.direction ? options.direction : "bottom";
      const gradient = {
        coverage: stacked ? options.stackedCoverage ?? options.coverage : options.coverage,
        opacity: options.opacity,
        direction: stacked ? null : options.direction,
        stacked
      };
      const density = Math.max(2, window.devicePixelRatio || 1);
      const regions = stacked ? void 0 : readRegions(bounds);
      const phase = [bounds.left, bounds.top].map((value) => value * density - Math.floor(value * density));
      const key = JSON.stringify([imageRevision, image.currentSrc || image.src, bounds.width, bounds.height, phase, position, edge, gradient, regions, density, stacked]);
      let preparedNow = false;
      if (!analysis || key !== analysisKey) {
        analysis = colour.prepare({ image, imageRect: bounds, objectPosition: position, sampleEdge: edge, gradient, textRects: regions, density, mode: stacked ? "solid" : "overlay", revision: ++revision, imageRevision });
        analysisKey = key;
        preparedNow = true;
      }
      if (!analysis.ok) throw new Error(analysis.reason);
      surface.style.setProperty("--adaptive-gradient", analysis.gradientCss);
      return { analysis, preparedNow };
    }
    function fits() {
      const height = image.getBoundingClientRect().height;
      const verticalHeight = text.offsetHeight + parseFloat(getComputedStyle(content).paddingBottom) + 8;
      return text.scrollWidth <= text.clientWidth && (options.direction ? content.getBoundingClientRect().height <= height : verticalHeight <= height * options.coverage);
    }
    function render() {
      frame = 0;
      if (destroyed || !surface.clientWidth) {
        return;
      }
      const started = performance.now();
      let stacked = options.stacked;
      let reason = stacked ? "layout" : "";
      let error = "";
      setLayout(stacked);
      if (!stacked && !fits()) {
        stacked = true;
        reason = "space";
        setLayout(true);
      }
      if (!image.complete && !loadingExpired) {
        observed = fingerprint();
        return;
      }
      let sample = options.fallback;
      let source = "automatic";
      let result, measured;
      let overlayFailure = "";
      try {
        if (!image.complete || !image.naturalWidth) throw new Error(loadingExpired && !image.complete ? "image-loading-timeout" : "image-load-failed");
        measured = measure(stacked);
        sample = measured.analysis.sample;
        result = measured.analysis.solve({ targetContrast: options.targetContrast, startingColour: options.override });
        if (!result.ok) {
          overlayFailure = result.reason;
          stacked = true;
          reason = result.reason === "insufficient-safety-margin" ? "margin" : "contrast";
          setLayout(true);
          measured = measure(true);
          sample = measured.analysis.sample;
          result = measured.analysis.solve({ targetContrast: options.targetContrast, startingColour: options.override });
        }
      } catch (failure) {
        error = failure.message;
        source = "fallback";
        stacked = true;
        reason = "image";
        analysis = null;
        setLayout(true);
        const safe = colour.prepare({ mode: "solid", colour: options.override || sample, revision: ++revision });
        result = safe.solve({ targetContrast: options.targetContrast });
        measured = { analysis: safe, preparedNow: true };
      }
      if (options.override) source = "override";
      const verified = !["unsupported-text-style", "unsupported-rendering"].includes(error);
      surface.style.setProperty("--image-tone", hex(result.rgb));
      surface.style.setProperty("--image-tone-rgb", result.rgb.join(" "));
      surface.classList.remove("is-pending");
      Object.assign(surface.dataset, {
        toneSource: source,
        sampleTone: hex(sample),
        autoTone: hex(result.rgb),
        contrast: verified ? String(result.contrast) : "",
        verification: verified ? "verified" : "unverified",
        targetContrast: String(options.targetContrast),
        fallbackReason: reason,
        sampleEdge: stacked || !options.direction ? "bottom" : options.direction,
        error,
        calculationVersion: "2",
        calculationRevision: String(result.revision),
        overlayFailure
      });
      observed = fingerprint();
      const metrics = { ...measured.analysis.metrics, reused: !measured.preparedNow };
      if (!measured.preparedNow) {
        metrics.sampleReads = 0;
        metrics.pixelReads = 0;
        metrics.prepareMs = 0;
      }
      options.onResult?.({ ...result, ok: verified && result.ok, passes: verified && result.ok, verified, sample, source, stacked, reason, error, overlayFailure, metrics, duration: performance.now() - started });
    }
    function refresh({ retry = false } = {}) {
      if (retry) {
        analysis = null;
        analysisKey = "";
      }
      if (!destroyed && !frame) {
        frame = requestAnimationFrame(render);
      }
    }
    const resized = new ResizeObserver(() => {
      if (fingerprint() !== observed) {
        refresh();
      }
    });
    resized.observe(surface);
    resized.observe(text);
    resized.observe(image);
    const edited = new MutationObserver((mutations) => {
      const sourceChanged = mutations.some((mutation) => mutation.target === image && ["src", "srcset", "sizes"].includes(mutation.attributeName));
      if (sourceChanged) {
        imageRevision++;
        surface.classList.add("is-pending");
        startLoadingDeadline();
      }
      refresh({ retry: true });
    });
    edited.observe(text, { childList: true, characterData: true, subtree: true, attributes: true });
    edited.observe(image, { attributes: true, attributeFilter: ["src", "srcset", "sizes", "class", "style"] });
    const imageSettled = () => {
      imageRevision++;
      clearTimeout(loadTimeout);
      loadingExpired = false;
      refresh({ retry: true });
    };
    const fontsChanged = () => refresh({ retry: true });
    image.addEventListener("load", imageSettled);
    image.addEventListener("error", imageSettled);
    window.addEventListener("resize", refresh);
    document.fonts?.addEventListener("loadingdone", fontsChanged);
    document.fonts?.ready.then(() => refresh());
    setLayout(options.stacked);
    startLoadingDeadline();
    refresh();
    return {
      update(next) {
        if (destroyed) {
          return;
        }
        const merged = { ...options, ...next };
        validateOptions(merged);
        const changed = Object.entries(next).some(([key, value]) => Array.isArray(value) ? !Array.isArray(options[key]) || value.some((channel, index) => channel !== options[key][index]) : value !== options[key]);
        options = merged;
        if (changed || fingerprint() !== observed) {
          refresh();
        }
      },
      refresh,
      destroy() {
        destroyed = true;
        clearTimeout(loadTimeout);
        cancelAnimationFrame(frame);
        resized.disconnect();
        edited.disconnect();
        image.removeEventListener("load", imageSettled);
        image.removeEventListener("error", imageSettled);
        window.removeEventListener("resize", refresh);
        document.fonts?.removeEventListener("loadingdone", fontsChanged);
        analysis = null;
        analysisKey = "";
      }
    };
  }
  root.attachAdaptiveColour = attachAdaptiveColour;
})(window);
