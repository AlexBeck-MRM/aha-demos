/* Adaptive image colour. Source SHA256: 007e3256f89b93e03594d87d38e06a29345fa33b562ee527b465ebd5f0cc95c4 */
/**
 * Adaptive gradient colour, version 2.
 *
 * prepare() reads the visible image crop and the pixels behind the text.
 * The returned solve() method finds a passing colour without reading pixels again.
 *
 * Supported paint: opaque sRGB image, opaque white text, normal compositing,
 * object-fit: cover and the same focal position/gradient as the rendered image.
 * The calling component owns text measurement, loading and readable fallbacks.
 */
(function (root) {
  "use strict";

  const CONTRAST_MARGIN = 0.02;
  const SAMPLE_WIDTH = 80;
  const AUTOMATIC_SATURATION = 1.12;
  const MAX_ANALYSIS_PIXELS = 4000000;
  const sampleCache = new WeakMap();

  // Convert encoded 8-bit sRGB to linear-light values for relative luminance.
  const linearChannels = Array.from({ length: 256 }, (_, channel) => {
    const value = channel / 255;
    if (value <= 0.04045) {
      return value / 12.92;
    }
    return ((value + 0.055) / 1.055) ** 2.4;
  });

  /**
   * Public entry point: validate -> read image/text pixels -> return a reusable solver.
   * Bad arguments throw. Unavailable image data returns { ok: false, reason }.
   * Rectangles use CSS pixels relative to the displayed image's top-left.
   */
  function prepare(input) {
    const mode = validatePreparationInput(input);
    const metrics = {
      sampleReads: 0,
      pixelReads: 0,
      checkedPixels: 0,
      fieldBytes: 0,
      readbackBytes: 0,
    };
    const started = now();
    let data;
    try {
      data = readPreparationData(input, mode, metrics);
    } catch (error) {
      if (error instanceof TypeError || error instanceof RangeError) {
        throw error;
      }
      const pixelFailure = error.name === "SecurityError"
        ? "pixel-access-denied"
        : "pixel-access-unavailable";
      return unavailable(error.reason || pixelFailure, input.revision);
    }
    if (data.ok === false) {
      return data;
    }

    const sample = Object.freeze([...data.startingColour]);
    const defaultColour = input.image ? increaseSaturation(sample) : sample;
    metrics.prepareMs = now() - started;
    return Object.freeze({
      ok: true,
      version: 2,
      mode,
      revision: input.revision,
      sample,
      gradientCss: data.gradient?.css ?? null,
      metrics: Object.freeze(metrics),
      solve: createSolver(defaultColour, data.field, mode, input.revision),
    });
  }

  // Add a little colour before contrast solving. This increases HSV saturation
  // at the same maximum channel value, preserving hue and avoiding channel clipping.
  // Neutral greys stay neutral; already fully saturated colours stay unchanged.
  function increaseSaturation(rgb) {
    const maximum = Math.max(...rgb);
    const spread = maximum - Math.min(...rgb);
    if (spread === 0) {
      return [...rgb];
    }
    const factor = Math.min(AUTOMATIC_SATURATION, maximum / spread);
    return rgb.map((channel) => Math.round(maximum - (maximum - channel) * factor));
  }

  function createSolver(defaultColour, field, mode, revision) {
    let cachedShades;
    let cachedStartingColour = "";
    const measure = field
      ? (rgb, required) => checkContrastField(field, rgb, required)
      : whiteContrast;

    return function solve({ targetContrast = 4.5, startingColour } = {}) {
      if (!Number.isFinite(targetContrast) || targetContrast < 4.5 || targetContrast > 7.1) {
        throw new RangeError("Contrast must be between 4.5 and 7.1.");
      }
      const original = startingColour ?? defaultColour;
      validateRGB(original);
      const requiredContrast = targetContrast + CONTRAST_MARGIN;

      function finish(rgb, contrast = measure(rgb)) {
        const ok = contrast >= requiredContrast;
        let reason = "";
        if (!ok) {
          reason = contrast >= targetContrast ? "insufficient-safety-margin" : "insufficient-contrast";
        }
        const result = {
          version: 2,
          mode,
          revision,
          targetContrast,
          requiredContrast,
          margin: CONTRAST_MARGIN,
          ok,
          contrast,
          reason,
        };
        if (ok) {
          result.rgb = Object.freeze([...rgb]);
        }
        return Object.freeze(result);
      }

      // A passing threshold scan visited every pixel, so its measurement is complete.
      const originalContrast = measure(original, requiredContrast);
      if (originalContrast >= requiredContrast) {
        return finish(original, originalContrast);
      }
      const blackContrast = measure([0, 0, 0], requiredContrast);
      if (blackContrast < requiredContrast) {
        // Even black cannot protect this text area. Report the full scan and no RGB.
        return finish([0, 0, 0]);
      }

      const startingKey = original.join(",");
      if (startingKey !== cachedStartingColour) {
        cachedShades = enumerateShades(original);
        cachedStartingColour = startingKey;
      }
      const passing = findLightestPassingShade(cachedShades, measure, requiredContrast, blackContrast);
      return finish(passing.rgb, passing.contrast);
    };
  }


  // The first shade (black) passes; the last (the original colour) fails.
  function findLightestPassingShade(shades, measure, requiredContrast, blackContrast) {
    let passingIndex = 0;
    let failingIndex = shades.length - 1;
    let passingContrast = blackContrast;
    while (failingIndex - passingIndex > 1) {
      const middle = Math.floor((passingIndex + failingIndex) / 2);
      const contrast = measure(shades[middle], requiredContrast);
      if (contrast >= requiredContrast) {
        passingIndex = middle;
        passingContrast = contrast;
      } else {
        failingIndex = middle;
      }
    }
    return { rgb: shades[passingIndex], contrast: passingContrast };
  }

  function now() {
    return typeof performance === "undefined" ? Date.now() : performance.now();
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function validatePreparationInput(input) {
    if (!input || typeof input !== "object") {
      throw new TypeError("Supply calculation inputs.");
    }
    const mode = input.mode ?? "overlay";
    if (!["overlay", "solid"].includes(mode)) {
      throw new TypeError("Mode must be overlay or explicitly solid.");
    }
    const { revision } = input;
    const validRevisionType = ["string", "number"].includes(typeof revision);
    if (!validRevisionType || (typeof revision === "number" && !Number.isFinite(revision))) {
      throw new TypeError("Supply a finite input revision.");
    }
    if (input.colour !== undefined) {
      validateRGB(input.colour);
      if (mode === "overlay") {
        throw new TypeError("Pass an editor colour to solve, not overlay preparation.");
      }
    }
    return mode;
  }

  function readPreparationData(input, mode, metrics) {
    const { image, imageRect: bounds, revision, imageRevision = revision } = input;
    if (!image) {
      if (mode === "overlay") {
        throw new TypeError("Overlay calculation requires the loaded image and every text region.");
      }
      if (!input.colour) {
        throw new TypeError("An explicit solid calculation needs a starting colour.");
      }
      return { startingColour: input.colour };
    }
    if (!image.complete) {
      return unavailable("image-not-ready", revision);
    }
    if (!image.naturalWidth || !image.naturalHeight) {
      return unavailable("image-load-failed", revision);
    }

    const validBounds = bounds
      && [bounds.left, bounds.top, bounds.width, bounds.height].every(Number.isFinite)
      && bounds.width > 0 && bounds.height > 0;
    if (!validBounds) {
      throw new TypeError("Supply the displayed image rectangle.");
    }
    const position = input.objectPosition ?? [0.5, 0.5];
    const validPosition = Array.isArray(position) && position.length === 2
      && position.every((value) => Number.isFinite(value) && value >= 0 && value <= 1);
    if (!validPosition) {
      throw new TypeError("Use two focal-position fractions between 0 and 1.");
    }
    const edge = input.sampleEdge ?? "bottom";
    if (!["bottom", "left", "right"].includes(edge)) {
      throw new TypeError("Sample edge must be bottom, left or right.");
    }

    const startingColour = sampleStartingColour(image, bounds, position, edge, imageRevision, metrics);
    const gradient = buildGradientModel(bounds.width, bounds.height, input.gradient);
    let field;
    if (mode === "overlay") {
      const deviceDensity = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
      const density = input.density ?? Math.max(2, deviceDensity);
      if (!Number.isFinite(density) || density < 1) {
        throw new RangeError("Analysis density must be at least one pixel per CSS pixel.");
      }
      field = prepareContrastField(image, bounds, position, input.textRects, density, gradient, metrics);
    }
    return { startingColour, gradient, field };
  }

  function validateRGB(rgb) {
    const validChannel = (value) => Number.isInteger(value) && value >= 0 && value <= 255;
    if (!Array.isArray(rgb) || rgb.length !== 3 || !rgb.every(validChannel)) {
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

  function getCanvasContext(canvas) {
    const context = canvas.getContext("2d", {
      willReadFrequently: true,
      colorSpace: "srgb",
    });
    if (!context) {
      fail("pixel-access-unavailable");
    }
    return context;
  }

  // Reproduce object-fit: cover, including the component's focal position.
  function drawCoverCrop(context, image, width, height, position) {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const drawnWidth = image.naturalWidth * scale;
    const drawnHeight = image.naturalHeight * scale;
    const left = (width - drawnWidth) * position[0];
    const top = (height - drawnHeight) * position[1];
    context.drawImage(image, left, top, drawnWidth, drawnHeight);
  }

  // This small average suggests a colour. It does not establish text contrast.
  function sampleStartingColour(image, bounds, position, edge, imageRevision, metrics) {
    const width = SAMPLE_WIDTH;
    const height = Math.max(1, Math.round(width * bounds.height / bounds.width));
    if (width * height > MAX_ANALYSIS_PIXELS) {
      fail("unsupported-image-area");
    }

    const cacheKey = JSON.stringify([
      imageRevision,
      image.currentSrc || image.src,
      bounds.width / bounds.height,
      width,
      height,
      position,
      edge,
    ]);
    const cached = sampleCache.get(image);
    if (cached?.key === cacheKey) {
      return [...cached.rgb];
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    try {
      const context = getCanvasContext(canvas);
      drawCoverCrop(context, image, width, height, position);

      // Read the bottom, left or right half nearest the text.
      const left = edge === "right" ? Math.floor(width / 2) : 0;
      const top = edge === "bottom" ? Math.floor(height / 2) : 0;
      const sampleWidth = edge === "left" ? Math.ceil(width / 2) : width - left;
      const pixels = context.getImageData(left, top, sampleWidth, height - top).data;
      const totals = [0, 0, 0];

      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index + 3] !== 255) {
          fail("unsupported-transparency");
        }
        for (let channel = 0; channel < 3; channel++) {
          totals[channel] += pixels[index + channel];
        }
      }

      const pixelCount = pixels.length / 4;
      const rgb = totals.map((total) => Math.round(total / pixelCount));
      sampleCache.set(image, { key: cacheKey, rgb });
      metrics.sampleReads++;
      return [...rgb];
    } finally {
      canvas.width = 0;
      canvas.height = 0;
    }
  }

  // The CSS paint and contrast calculation must use these same stops.
  function buildGradientModel(width, height, settings) {
    const validCoverage = settings && Number.isFinite(settings.coverage)
      && settings.coverage > 0 && settings.coverage <= 1;
    const validOpacity = settings && Number.isFinite(settings.opacity)
      && settings.opacity >= 0 && settings.opacity <= 1;
    const direction = settings?.direction ?? null;
    if (!validCoverage || !validOpacity || ![null, "left", "right"].includes(direction)) {
      throw new RangeError("Use a supported gradient direction, coverage and opacity.");
    }

    let angle = 180;
    if (direction === "right") {
      angle = 120;
    } else if (direction === "left") {
      angle = 240;
    }
    const radians = angle * Math.PI / 180;
    const directionX = Math.sin(radians);
    const directionY = -Math.cos(radians);
    const length = Math.abs(width * directionX) + Math.abs(height * directionY);

    let start = (1 - settings.coverage) * height;
    let span = settings.coverage * height;
    if (direction) {
      start = (1 - settings.coverage) * width * Math.abs(directionX)
        + height * Math.abs(directionY) / 2;
      span = settings.coverage * width * Math.abs(directionX);
    }

    const fadeStops = [[0, 0], [0.2, 0.15], [0.4, 0.8], [0.8, 1], [1, 1]];
    let stops = fadeStops.map(([position, opacity]) => [
      start + position * span,
      opacity * settings.opacity,
    ]);
    if (settings.stacked) {
      stops = [...stops.slice(0, -1), [height - 8, settings.opacity], [height, 1]];
    }

    // CSS clamps a stop that precedes its neighbour. Match that rule here.
    let previousPosition = -Infinity;
    stops = stops.map(([position, opacity]) => {
      previousPosition = Math.max(previousPosition, position);
      return [previousPosition, opacity];
    });
    const cssStops = stops.map(([position, opacity]) => {
      return `rgb(var(--image-tone-rgb) / ${opacity}) ${position}px`;
    });
    const css = `linear-gradient(${angle}deg in srgb, ${cssStops.join(", ")})`;
    return { width, height, directionX, directionY, length, stops, css };
  }

  function gradientOpacityAt(model, x, y) {
    const distance = (x - model.width / 2) * model.directionX
      + (y - model.height / 2) * model.directionY
      + model.length / 2;
    if (distance <= model.stops[0][0]) {
      return model.stops[0][1];
    }

    for (let index = 1; index < model.stops.length; index++) {
      const [end, endOpacity] = model.stops[index];
      const [start, startOpacity] = model.stops[index - 1];
      if (distance <= end) {
        return startOpacity + (endOpacity - startOpacity) * (distance - start) / (end - start);
      }
    }
    return model.stops[model.stops.length - 1][1];
  }

  function validateTextRegions(regions, bounds) {
    if (!Array.isArray(regions) || !regions.length) {
      throw new TypeError("Supply every text-line rectangle.");
    }
    for (const region of regions) {
      const finiteEdges = region
        && [region.left, region.top, region.right, region.bottom].every(Number.isFinite);
      if (!finiteEdges || region.right <= region.left || region.bottom <= region.top) {
        throw new TypeError("Text rectangles must be finite and non-empty.");
      }
      if (region.left < 0 || region.top < 0
        || region.right > bounds.width || region.bottom > bounds.height) {
        fail("unsupported-text-area");
      }
    }
  }

  function getReadbackArea(bounds, regions, density) {
    // Retain the image's fractional device-pixel alignment when reading a smaller area.
    const offsetX = bounds.left - Math.floor(bounds.left * density) / density;
    const offsetY = bounds.top - Math.floor(bounds.top * density) / density;
    const originX = Math.floor((Math.min(...regions.map((region) => region.left)) + offsetX) * density);
    const originY = Math.floor((Math.min(...regions.map((region) => region.top)) + offsetY) * density);
    const width = Math.ceil((Math.max(...regions.map((region) => region.right)) + offsetX) * density) - originX;
    const height = Math.ceil((Math.max(...regions.map((region) => region.bottom)) + offsetY) * density) - originY;
    if (width * height > MAX_ANALYSIS_PIXELS) {
      fail("unsupported-image-area");
    }
    return { offsetX, offsetY, originX, originY, width, height };
  }

  // Merge overlapping intervals on each row, so overlapping text is checked once.
  function mergeTextRows(regions, area, density) {
    const { offsetX, offsetY, originX, originY, width, height } = area;
    const rows = Array.from({ length: height }, () => []);
    for (const region of regions) {
      const left = clamp(Math.floor((region.left + offsetX) * density) - originX, 0, width);
      const right = clamp(Math.ceil((region.right + offsetX) * density) - originX, 0, width);
      const top = clamp(Math.floor((region.top + offsetY) * density) - originY, 0, height);
      const bottom = clamp(Math.ceil((region.bottom + offsetY) * density) - originY, 0, height);
      for (let y = top; y < bottom; y++) {
        rows[y].push([left, right]);
      }
    }

    let pixelCount = 0;
    const mergedRows = rows.map((spans) => {
      spans.sort((first, second) => first[0] - second[0]);
      const merged = [];
      for (const span of spans) {
        const previous = merged[merged.length - 1];
        if (previous && span[0] <= previous[1]) {
          previous[1] = Math.max(previous[1], span[1]);
        } else {
          merged.push([...span]);
        }
      }
      for (const [left, right] of merged) {
        pixelCount += right - left;
      }
      return merged;
    });
    if (!pixelCount) {
      fail("unsupported-text-area");
    }
    return { rows: mergedRows, pixelCount };
  }

  // Each packed pixel stores: red/green/blue image contributions, then gradient opacity.
  // Only the image part is fixed; solve() supplies the gradient colour later.
  function prepareContrastField(image, bounds, position, regions, density, model, metrics) {
    validateTextRegions(regions, bounds);
    const area = getReadbackArea(bounds, regions, density);
    const { rows, pixelCount } = mergeTextRows(regions, area, density);
    const { offsetX, offsetY, originX, originY, width, height } = area;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    try {
      const context = getCanvasContext(canvas);
      context.setTransform(
        density, 0, 0, density,
        offsetX * density - originX,
        offsetY * density - originY,
      );
      drawCoverCrop(context, image, bounds.width, bounds.height, position);
      const pixels = context.getImageData(0, 0, width, height).data;
      const field = new Float32Array(pixelCount * 4);
      let outputIndex = 0;

      for (let y = 0; y < height; y++) {
        for (const [left, right] of rows[y]) {
          for (let x = left; x < right; x++) {
            const pixelIndex = (y * width + x) * 4;
            if (pixels[pixelIndex + 3] !== 255) {
              fail("unsupported-transparency");
            }
            const imageX = (x + originX + 0.5) / density - offsetX;
            const imageY = (y + originY + 0.5) / density - offsetY;
            const opacity = gradientOpacityAt(model, imageX, imageY);
            field[outputIndex++] = pixels[pixelIndex] * (1 - opacity);
            field[outputIndex++] = pixels[pixelIndex + 1] * (1 - opacity);
            field[outputIndex++] = pixels[pixelIndex + 2] * (1 - opacity);
            field[outputIndex++] = opacity;
          }
        }
      }
      metrics.pixelReads++;
      metrics.checkedPixels = pixelCount;
      metrics.fieldBytes = field.byteLength;
      metrics.readbackBytes = pixels.byteLength;
      return field;
    } finally {
      canvas.width = 0;
      canvas.height = 0;
    }
  }

  // This simpler check applies only to an explicitly opaque solid text panel.
  function whiteContrast(rgb) {
    const luminance = linearChannels[rgb[0]] * 0.2126
      + linearChannels[rgb[1]] * 0.7152
      + linearChannels[rgb[2]] * 0.0722;
    return 1.05 / (luminance + 0.05);
  }

  function checkContrastField(field, rgb, requiredContrast = 0) {
    const luminanceLimit = requiredContrast ? 1.05 / requiredContrast - 0.05 : Infinity;
    const [redTone, greenTone, blueTone] = rgb;
    let brightestLuminance = 0;

    for (let index = 0; index < field.length; index += 4) {
      const opacity = field[index + 3];
      // Round upward, then allow one extra 8-bit step for tested paint differences.
      const red = Math.ceil(field[index] + redTone * opacity) + 1;
      const green = Math.ceil(field[index + 1] + greenTone * opacity) + 1;
      const blue = Math.ceil(field[index + 2] + blueTone * opacity) + 1;
      const luminance = linearChannels[red > 255 ? 255 : red] * 0.2126
        + linearChannels[green > 255 ? 255 : green] * 0.7152
        + linearChannels[blue > 255 ? 255 : blue] * 0.0722;
      if (luminance > brightestLuminance) {
        brightestLuminance = luminance;
      }
      // Confirm with the final ratio formula: inversion alone can differ by one ULP.
      if (brightestLuminance > luminanceLimit) {
        const contrast = 1.05 / (brightestLuminance + 0.05);
        if (contrast < requiredContrast) {
          break;
        }
      }
    }
    return 1.05 / (brightestLuminance + 0.05);
  }

  function compareShadeTransitions(first, second) {
    return first.numerator * second.denominator - second.numerator * first.denominator;
  }

  // Enumerate the exact 8-bit shades on round(startRGB * scale), from black to source.
  // RGB channels change at different half-step fractions. Cross products order those
  // fractions without introducing floating-point drift or skipping a possible shade.
  function enumerateShades(rgb) {
    const events = [];
    rgb.forEach((channel, channelIndex) => {
      for (let step = 0; step < channel; step++) {
        events.push({ numerator: 2 * step + 1, denominator: 2 * channel, channelIndex });
      }
    });
    events.sort(compareShadeTransitions);

    const colour = [0, 0, 0];
    const shades = [[...colour]];
    let eventIndex = 0;
    while (eventIndex < events.length) {
      const first = events[eventIndex];
      while (eventIndex < events.length && compareShadeTransitions(first, events[eventIndex]) === 0) {
        colour[events[eventIndex].channelIndex]++;
        eventIndex++;
      }
      shades.push([...colour]);
    }
    return shades;
  }


  const api = Object.freeze({ version: 2, prepare });
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.GradientColour = api;
  }
})(typeof window === "undefined" ? this : window);

/**
 * Gallery adapter: choose layout -> measure -> calculate -> paint.
 * gradient-colour.js owns the calculation. This file owns the DOM and lifecycle.
 * Product components can keep their own layout and approved fallback.
 */
(function (root) {
  "use strict";

  const colourEngine = root.GradientColour;
  const IMAGE_TIMEOUT_MS = 8000;
  const TEXT_PADDING = 2;

  function toHex(rgb) {
    return `#${rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
  }

  function validateOptions(options) {
    if (!Number.isFinite(options.targetContrast) || options.targetContrast < 4.5 || options.targetContrast > 7.1) {
      throw new RangeError("Contrast must be between 4.5 and 7.1.");
    }
    if (!Number.isFinite(options.aspect) || options.aspect <= 0) {
      throw new RangeError("The image aspect ratio must be positive.");
    }
    for (const key of ["coverage", "stackedCoverage", "opacity"]) {
      const value = options[key];
      if (key === "stackedCoverage" && value === undefined) {
        continue;
      }
      const validFraction = Number.isFinite(value) && value >= 0 && value <= 1;
      const emptyCoverage = key !== "opacity" && value === 0;
      if (!validFraction || emptyCoverage) {
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
      const validChannel = (channel) => Number.isInteger(channel) && channel >= 0 && channel <= 255;
      if (!Array.isArray(rgb) || rgb.length !== 3 || !rgb.every(validChannel)) {
        throw new TypeError("Colours must contain three integer RGB channels between 0 and 255.");
      }
    }
  }

  function assertNormalPaint(element, reason) {
    const style = getComputedStyle(element);
    if (style.filter !== "none" || style.mixBlendMode !== "normal"
      || Number(style.opacity) !== 1 || style.transform !== "none") {
      throw new Error(reason);
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
      ...settings,
    };
    validateOptions(options);

    let frame = 0;
    let destroyed = false;
    let prepared;
    let preparedKey = "";
    let layoutRevision = 0;
    let imageRevision = 0;
    let lastLayout = "";
    let loadingExpired = false;
    let loadTimeout;
    surface.classList.add("is-pending");

    // Start here: choose the layout, calculate its colour, then paint the result.
    // Measurement and lifecycle details are kept below this update flow.
    function render() {
      frame = 0;
      if (destroyed || !surface.clientWidth) {
        return;
      }
      const started = performance.now();
      let stacked = options.stacked;
      let reason = stacked ? "layout" : "";
      setLayout(stacked);
      if (!stacked && !textFitsOverlay()) {
        stacked = true;
        reason = "space";
        setLayout(true);
      }
      if (!image.complete && !loadingExpired) {
        lastLayout = layoutFingerprint();
        return;
      }
      paintResult(calculateColour(stacked, reason), started);
    }

    function calculateColour(stacked, reason) {
      let sample = options.fallback;
      let source = "automatic";
      let error = "";
      let overlayFailure = "";
      let result;
      let measured;

      try {
        if (!image.complete || !image.naturalWidth) {
          const timedOut = loadingExpired && !image.complete;
          throw new Error(timedOut ? "image-loading-timeout" : "image-load-failed");
        }
        ({ measured, result, sample } = solveLayout(stacked));
        if (!result.ok) {
          overlayFailure = result.reason;
          reason = result.reason === "insufficient-safety-margin" ? "margin" : "contrast";
          stacked = true;
          setLayout(true);
          ({ measured, result, sample } = solveLayout(true));
        }
      } catch (failure) {
        error = failure.message;
        // Image failure does not remove the need to validate the foreground paint.
        try {
          readTextRegions(null);
        } catch (paintFailure) {
          error = paintFailure.message;
        }
        source = "fallback";
        stacked = true;
        reason = "image";
        prepared = null;
        setLayout(true);

        const safePanel = colourEngine.prepare({
          mode: "solid",
          colour: options.override || sample,
          revision: ++layoutRevision,
        });
        result = safePanel.solve({ targetContrast: options.targetContrast });
        measured = { analysis: safePanel, preparedNow: true };
      }
      if (options.override) {
        source = "override";
      }
      const verified = !["unsupported-text-style", "unsupported-rendering"].includes(error);
      return { result, measured, sample, source, stacked, reason, error, overlayFailure, verified };
    }

    function paintResult(outcome, started) {
      const { result, measured, sample, source, stacked, reason, error, overlayFailure, verified } = outcome;
      surface.style.setProperty("--image-tone", toHex(result.rgb));
      surface.style.setProperty("--image-tone-rgb", result.rgb.join(" "));
      surface.classList.remove("is-pending");
      Object.assign(surface.dataset, {
        toneSource: source,
        sampleTone: toHex(sample),
        autoTone: toHex(result.rgb),
        contrast: verified ? String(result.contrast) : "",
        verification: verified ? "verified" : "unverified",
        targetContrast: String(options.targetContrast),
        fallbackReason: reason,
        sampleEdge: stacked || !options.direction ? "bottom" : options.direction,
        error,
        calculationVersion: "2",
        calculationRevision: String(result.revision),
        overlayFailure,
      });
      lastLayout = layoutFingerprint();

      const metrics = { ...measured.analysis.metrics, reused: !measured.preparedNow };
      if (!measured.preparedNow) {
        metrics.sampleReads = 0;
        metrics.pixelReads = 0;
        metrics.prepareMs = 0;
      }
      options.onResult?.({
        ...result,
        ok: verified && result.ok,
        passes: verified && result.ok,
        verified,
        sample,
        source,
        stacked,
        reason,
        error,
        overlayFailure,
        metrics,
        duration: performance.now() - started,
      });
    }

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

    function layoutFingerprint() {
      return [surface, image, text].flatMap((element) => {
        const rect = element.getBoundingClientRect();
        return [rect.left, rect.top, rect.width, rect.height];
      }).join(":");
    }

    function setLayout(stacked) {
      let layout = "vertical";
      if (stacked) {
        layout = "mobile";
      } else if (options.direction) {
        layout = "horizontal";
      }
      surface.classList.toggle("is-stacked", stacked);
      surface.dataset.layout = layout;
      surface.dataset.horizontalDirection = options.direction || "";
      surface.dataset.contentPlacement = stacked ? "below" : "overlay";

      const width = surface.getBoundingClientRect().width;
      const height = stacked ? width * 2 / 3 : width / options.aspect;
      surface.style.setProperty("--image-photo-height", `${height}px`);
    }

    function readFocalPosition() {
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

    function validateTextPaint(element) {
      if (getComputedStyle(element).color !== "rgb(255, 255, 255)") {
        throw new Error("unsupported-text-style");
      }
      for (let parent = element; parent; parent = parent.parentElement) {
        assertNormalPaint(parent, "unsupported-text-style");
        if (parent === surface) {
          break;
        }
      }
    }

    function paddedTextRectangle(rect, bounds) {
      const left = rect.left - bounds.left;
      const top = rect.top - bounds.top;
      const right = rect.right - bounds.left;
      const bottom = rect.bottom - bounds.top;
      if (left < 0 || top < 0 || right > bounds.width || bottom > bounds.height) {
        throw new Error("unsupported-text-area");
      }
      // Clip the extra padding only. Never discard actual text to make a check pass.
      return {
        left: Math.max(0, left - TEXT_PADDING),
        top: Math.max(0, top - TEXT_PADDING),
        right: Math.min(bounds.width, right + TEXT_PADDING),
        bottom: Math.min(bounds.height, bottom + TEXT_PADDING),
      };
    }

    // A null bounds value validates paint only, for text below the photograph.
    // A solid panel still requires opaque white text for this calculation.
    function readTextRegions(bounds) {
      const range = document.createRange();
      const walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT);
      const regions = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent.trim()) {
          continue;
        }
        validateTextPaint(node.parentElement);
        if (!bounds) {
          continue;
        }
        range.selectNodeContents(node);
        for (const rect of range.getClientRects()) {
          if (rect.width && rect.height) {
            regions.push(paddedTextRectangle(rect, bounds));
          }
        }
      }
      return regions;
    }

    function prepareForLayout(stacked) {
      const bounds = image.getBoundingClientRect();
      const position = readFocalPosition();
      for (const element of [surface, image, text, content]) {
        assertNormalPaint(element, "unsupported-rendering");
      }

      const edge = !stacked && options.direction ? options.direction : "bottom";
      const gradient = {
        coverage: stacked ? (options.stackedCoverage ?? options.coverage) : options.coverage,
        opacity: options.opacity,
        direction: stacked ? null : options.direction,
        stacked,
      };
      const density = Math.max(2, window.devicePixelRatio || 1);
      const regions = readTextRegions(stacked ? null : bounds);
      const pixelPhase = [bounds.left, bounds.top].map((value) => {
        return value * density - Math.floor(value * density);
      });
      // Changing only the target or override reuses the existing pixel field.
      const key = JSON.stringify([
        imageRevision, image.currentSrc || image.src,
        bounds.width, bounds.height, pixelPhase,
        position, edge, gradient, regions, density, stacked,
      ]);
      const preparedNow = !prepared || key !== preparedKey;
      if (preparedNow) {
        prepared = colourEngine.prepare({
          image,
          imageRect: bounds,
          objectPosition: position,
          sampleEdge: edge,
          gradient,
          textRects: regions,
          density,
          mode: stacked ? "solid" : "overlay",
          revision: ++layoutRevision,
          imageRevision,
        });
        preparedKey = key;
      }
      if (!prepared.ok) {
        throw new Error(prepared.reason);
      }
      surface.style.setProperty("--adaptive-gradient", prepared.gradientCss);
      return { analysis: prepared, preparedNow };
    }

    function textFitsOverlay() {
      if (text.scrollWidth > text.clientWidth) {
        return false;
      }
      const imageHeight = image.getBoundingClientRect().height;
      if (options.direction) {
        return content.getBoundingClientRect().height <= imageHeight;
      }
      const bottomPadding = parseFloat(getComputedStyle(content).paddingBottom);
      const requiredHeight = text.offsetHeight + bottomPadding + 8;
      return requiredHeight <= imageHeight * options.coverage;
    }

    function solveLayout(stacked) {
      const measured = prepareForLayout(stacked);
      const result = measured.analysis.solve({
        targetContrast: options.targetContrast,
        startingColour: options.override,
      });
      return { measured, result, sample: measured.analysis.sample };
    }

    // Batch image, text, font and resize notifications into one animation frame.
    function refresh({ retry = false } = {}) {
      if (retry) {
        prepared = null;
        preparedKey = "";
      }
      if (!destroyed && !frame) {
        frame = requestAnimationFrame(render);
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      if (layoutFingerprint() !== lastLayout) {
        refresh();
      }
    });
    resizeObserver.observe(surface);
    resizeObserver.observe(text);
    resizeObserver.observe(image);

    const mutationObserver = new MutationObserver((mutations) => {
      const sourceChanged = mutations.some((mutation) => {
        return mutation.target === image && ["src", "srcset", "sizes"].includes(mutation.attributeName);
      });
      if (sourceChanged) {
        imageRevision++;
        surface.classList.add("is-pending");
        startLoadingDeadline();
      }
      refresh({ retry: true });
    });
    mutationObserver.observe(text, { childList: true, characterData: true, subtree: true, attributes: true });
    mutationObserver.observe(image, { attributes: true, attributeFilter: ["src", "srcset", "sizes", "class", "style"] });

    function imageSettled() {
      imageRevision++;
      clearTimeout(loadTimeout);
      loadingExpired = false;
      refresh({ retry: true });
    }
    const fontsChanged = () => refresh({ retry: true });
    image.addEventListener("load", imageSettled);
    image.addEventListener("error", imageSettled);
    window.addEventListener("resize", refresh);
    document.fonts?.addEventListener("loadingdone", fontsChanged);
    document.fonts?.ready.then(() => refresh());
    setLayout(options.stacked);
    startLoadingDeadline();
    refresh();

    function update(next) {
      if (destroyed) {
        return;
      }
      const merged = { ...options, ...next };
      validateOptions(merged);
      const changed = Object.entries(next).some(([key, value]) => {
        if (Array.isArray(value)) {
          return !Array.isArray(options[key])
            || value.some((channel, index) => channel !== options[key][index]);
        }
        return value !== options[key];
      });
      options = merged;
      if (changed || layoutFingerprint() !== lastLayout) {
        refresh();
      }
    }

    // Call on unmount to release observers, timers and the retained pixel field.
    function destroy() {
      destroyed = true;
      clearTimeout(loadTimeout);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      image.removeEventListener("load", imageSettled);
      image.removeEventListener("error", imageSettled);
      window.removeEventListener("resize", refresh);
      document.fonts?.removeEventListener("loadingdone", fontsChanged);
      prepared = null;
      preparedKey = "";
    }

    return { update, refresh, destroy };
  }

  root.attachAdaptiveColour = attachAdaptiveColour;
})(window);
