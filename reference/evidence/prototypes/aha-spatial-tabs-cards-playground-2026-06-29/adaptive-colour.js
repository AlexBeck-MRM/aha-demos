/* Adaptive image colour. Source SHA256: 45f4d46351465cd78c9762c34fd26095c51e35e2fc029e6aa42af0e9ae86d82a */
(function(root) {
  "use strict";
  const CONTRAST_MARGIN = 0.02;
  const SEARCH_STEPS = 12;
  const SAMPLE_WIDTH = 80;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const linearChannels = Array.from({ length: 256 }, (_, channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  function whiteContrast([red, green, blue]) {
    const luminance = linearChannels[red] * 0.2126 + linearChannels[green] * 0.7152 + linearChannels[blue] * 0.0722;
    return 1.05 / (luminance + 0.05);
  }
  function hex(rgb) {
    return `#${rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
  }
  function fromHex(value) {
    return [1, 3, 5].map((start) => parseInt(value.slice(start, start + 2), 16));
  }
  function cropGeometry(imageWidth, imageHeight, width, height, position = [0.5, 0.5]) {
    const dimensions = [imageWidth, imageHeight, width, height];
    if (!dimensions.every((value) => Number.isFinite(value) && value > 0)) {
      throw new Error("The image or its visible area has no usable dimensions.");
    }
    const scale = Math.max(width / imageWidth, height / imageHeight);
    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;
    return {
      x: (width - drawWidth) * position[0],
      y: (height - drawHeight) * position[1],
      width: drawWidth,
      height: drawHeight
    };
  }
  function canvasContext(canvas) {
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) {
      throw new Error("Canvas image reading is unavailable.");
    }
    return context;
  }
  function averageColour(pixels) {
    const sum = [0, 0, 0];
    let weight = 0;
    for (let index = 0; index < pixels.length; index += 4) {
      const alpha = pixels[index + 3] / 255;
      if (!alpha) {
        continue;
      }
      weight += alpha;
      for (let channel = 0; channel < 3; channel++) {
        sum[channel] += pixels[index + channel] * alpha;
      }
    }
    if (!weight) {
      throw new Error("The sampled area contains no visible image pixels.");
    }
    return sum.map((channel) => Math.round(channel / weight));
  }
  function sampleColour(image, bounds, position, edge) {
    const canvas = document.createElement("canvas");
    canvas.width = SAMPLE_WIDTH;
    canvas.height = Math.max(1, Math.round(SAMPLE_WIDTH * bounds.height / bounds.width));
    const context = canvasContext(canvas);
    const crop = cropGeometry(image.naturalWidth, image.naturalHeight, canvas.width, canvas.height, position);
    context.drawImage(image, crop.x, crop.y, crop.width, crop.height);
    const x = edge === "right" ? Math.floor(canvas.width / 2) : 0;
    const y = edge === "bottom" ? Math.floor(canvas.height / 2) : 0;
    const width = edge === "left" ? Math.ceil(canvas.width / 2) : canvas.width - x;
    return averageColour(context.getImageData(x, y, width, canvas.height - y).data);
  }
  function readTextPixels(image, bounds, position, regions, density) {
    if (!regions.length) {
      throw new Error("No visible text area was found inside the image.");
    }
    const offsetX = bounds.left - Math.floor(bounds.left * density) / density;
    const offsetY = bounds.top - Math.floor(bounds.top * density) / density;
    const originX = Math.max(0, Math.floor((Math.min(...regions.map((r) => r.left)) + offsetX) * density));
    const originY = Math.max(0, Math.floor((Math.min(...regions.map((r) => r.top)) + offsetY) * density));
    const right = Math.ceil((Math.max(...regions.map((r) => r.right)) + offsetX) * density);
    const bottom = Math.ceil((Math.max(...regions.map((r) => r.bottom)) + offsetY) * density);
    const canvas = document.createElement("canvas");
    const width = right - originX;
    const height = bottom - originY;
    if (width <= 0 || height <= 0) {
      throw new Error("No visible text area was found inside the image.");
    }
    canvas.width = width;
    canvas.height = height;
    const context = canvasContext(canvas);
    const crop = cropGeometry(image.naturalWidth, image.naturalHeight, bounds.width, bounds.height, position);
    context.setTransform(density, 0, 0, density, offsetX * density - originX, offsetY * density - originY);
    context.drawImage(image, crop.x, crop.y, crop.width, crop.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    const result = { pixels, width: canvas.width, height: canvas.height, density, offsetX, offsetY, originX, originY };
    canvas.width = 0;
    canvas.height = 0;
    return result;
  }
  function gradientModel({ width, height, coverage, opacity, direction, stacked = false }) {
    const angle = direction ? direction === "right" ? 120 : 240 : 180;
    const radians = angle * Math.PI / 180;
    const dx = Math.sin(radians);
    const dy = -Math.cos(radians);
    const length = Math.abs(width * dx) + Math.abs(height * dy);
    const start = direction ? (1 - coverage) * width * Math.abs(dx) + height * Math.abs(dy) / 2 : (1 - coverage) * height;
    const span = direction ? coverage * width * Math.abs(dx) : coverage * height;
    let stops = [[0, 0], [0.2, 0.15], [0.4, 0.8], [0.8, 1], [1, 1]].map(([position, alpha]) => [start + position * span, alpha * opacity]);
    if (stacked) {
      stops = [...stops.slice(0, -1), [height - 8, opacity], [height, 1]];
    }
    return { width, height, angle, dx, dy, length, stops };
  }
  function gradientCss(model) {
    const stops = model.stops.map(([position, alpha]) => `rgb(var(--image-tone-rgb) / ${alpha}) ${position}px`);
    return `linear-gradient(${model.angle}deg in srgb, ${stops.join(", ")})`;
  }
  function gradientAlpha(model, x, y) {
    const distance = (x - model.width / 2) * model.dx + (y - model.height / 2) * model.dy + model.length / 2;
    if (distance <= model.stops[0][0]) {
      return model.stops[0][1];
    }
    for (let index = 1; index < model.stops.length; index++) {
      const [end, endAlpha] = model.stops[index];
      const [start, startAlpha] = model.stops[index - 1];
      if (distance <= end) {
        return startAlpha + (endAlpha - startAlpha) * (distance - start) / (end - start);
      }
    }
    return model.stops.at(-1)[1];
  }
  function contrastField(crop, regions, model) {
    const rectangles = regions.map((region) => ({
      left: clamp(Math.floor((region.left + crop.offsetX) * crop.density) - crop.originX, 0, crop.width),
      top: clamp(Math.floor((region.top + crop.offsetY) * crop.density) - crop.originY, 0, crop.height),
      right: clamp(Math.ceil((region.right + crop.offsetX) * crop.density) - crop.originX, 0, crop.width),
      bottom: clamp(Math.ceil((region.bottom + crop.offsetY) * crop.density) - crop.originY, 0, crop.height)
    }));
    const pixelCount = rectangles.reduce((sum, rect) => sum + (rect.right - rect.left) * (rect.bottom - rect.top), 0);
    if (!pixelCount) {
      throw new Error("No visible text area was found inside the image.");
    }
    const field = new Float32Array(pixelCount * 4);
    let output = 0;
    for (const region of rectangles) {
      for (let y = region.top; y < region.bottom; y++) {
        for (let x = region.left; x < region.right; x++) {
          const index = (y * crop.width + x) * 4;
          const localX = (x + crop.originX + 0.5) / crop.density - crop.offsetX;
          const localY = (y + crop.originY + 0.5) / crop.density - crop.offsetY;
          const photoWeight = (1 - gradientAlpha(model, localX, localY)) * crop.pixels[index + 3] / 255;
          field[output++] = crop.pixels[index] * photoWeight;
          field[output++] = crop.pixels[index + 1] * photoWeight;
          field[output++] = crop.pixels[index + 2] * photoWeight;
          field[output++] = 1 - photoWeight;
        }
      }
    }
    return field;
  }
  function contrastAgainstPhoto(field, rgb, minimumContrast = 0) {
    const maximumLuminance = minimumContrast ? 1.05 / minimumContrast - 0.05 : Infinity;
    let brightest = 0;
    for (let index = 0; index < field.length; index += 4) {
      const weight = field[index + 3];
      const red = clamp(Math.ceil(field[index] + rgb[0] * weight), 0, 255);
      const green = clamp(Math.ceil(field[index + 1] + rgb[1] * weight), 0, 255);
      const blue = clamp(Math.ceil(field[index + 2] + rgb[2] * weight), 0, 255);
      const luminance = linearChannels[red] * 0.2126 + linearChannels[green] * 0.7152 + linearChannels[blue] * 0.0722;
      brightest = Math.max(brightest, luminance);
      if (brightest > maximumLuminance) {
        break;
      }
    }
    return 1.05 / (brightest + 0.05);
  }
  function solveTone(sample, targetContrast, check = whiteContrast) {
    if (!Number.isFinite(targetContrast) || targetContrast < 4.5 || targetContrast > 7.1) {
      throw new Error("Contrast must be between 4.5 and 7.1.");
    }
    const required = targetContrast + CONTRAST_MARGIN;
    const originalContrast = check(sample, required);
    if (originalContrast >= required) {
      return { rgb: [...sample], contrast: originalContrast, passes: true };
    }
    let rgb = [0, 0, 0];
    const darkestContrast = check(rgb, required);
    if (darkestContrast < required) {
      return { rgb, contrast: darkestContrast, passes: false };
    }
    let low = 0;
    let high = 1;
    for (let step = 0; step < SEARCH_STEPS; step++) {
      const scale = (low + high) / 2;
      const candidate = sample.map((channel) => Math.round(channel * scale));
      if (check(candidate, required) >= required) {
        low = scale;
        rgb = candidate;
      } else {
        high = scale;
      }
    }
    const contrast = check(rgb);
    return { rgb, contrast, passes: contrast >= targetContrast };
  }
  const api = {
    cropGeometry,
    averageColour,
    sampleColour,
    readTextPixels,
    gradientModel,
    gradientCss,
    gradientAlpha,
    contrastField,
    contrastAgainstPhoto,
    solveTone,
    whiteContrast,
    hex,
    fromHex
  };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.AdaptiveColour = api;
  }
})(typeof window === "undefined" ? this : window);
(function(root) {
  "use strict";
  const colour = root.AdaptiveColour;
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
    let sampleCache;
    let fieldCache;
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
      return [...text.children].flatMap((node) => {
        range.selectNodeContents(node);
        return [...range.getClientRects()].map((rect) => ({
          left: Math.max(0, rect.left - bounds.left - 2),
          top: Math.max(0, rect.top - bounds.top - 2),
          right: Math.min(bounds.width, rect.right - bounds.left + 2),
          bottom: Math.min(bounds.height, rect.bottom - bounds.top + 2)
        })).filter((rect) => rect.right > rect.left && rect.bottom > rect.top);
      });
    }
    function gradientFor(bounds, stacked) {
      return colour.gradientModel({
        width: bounds.width,
        height: bounds.height,
        coverage: stacked ? options.stackedCoverage ?? options.coverage : options.coverage,
        opacity: options.opacity,
        direction: stacked ? null : options.direction,
        stacked
      });
    }
    function measure(stacked) {
      const bounds = image.getBoundingClientRect();
      const position = readPosition();
      const edge = !stacked && options.direction ? options.direction : "bottom";
      const sampleKey = JSON.stringify([image.currentSrc || image.src, bounds.width, bounds.height, position, edge]);
      if (sampleCache?.key !== sampleKey) {
        sampleCache = { key: sampleKey, rgb: colour.sampleColour(image, bounds, position, edge) };
      }
      const model = gradientFor(bounds, stacked);
      surface.style.setProperty("--adaptive-gradient", colour.gradientCss(model));
      let check = colour.whiteContrast;
      if (stacked) {
        fieldCache = null;
      } else {
        const density = Math.max(2, window.devicePixelRatio || 1);
        const regions = readRegions(bounds);
        const phase = [bounds.left, bounds.top].map((position2) => position2 * density - Math.floor(position2 * density));
        const fieldKey = JSON.stringify([sampleKey, phase, regions, model, density]);
        if (fieldCache?.key !== fieldKey) {
          const crop = colour.readTextPixels(image, bounds, position, regions, density);
          fieldCache = { key: fieldKey, field: colour.contrastField(crop, regions, model) };
        }
        check = (rgb, minimum) => colour.contrastAgainstPhoto(fieldCache.field, rgb, minimum);
      }
      return { sample: sampleCache.rgb, check };
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
      let result;
      try {
        if (!image.complete || !image.naturalWidth) {
          throw new Error(loadingExpired && !image.complete ? "Image loading timed out. Reload the page to retry." : "The photograph could not be loaded. Reload the page to retry.");
        }
        let measured = measure(stacked);
        sample = measured.sample;
        result = colour.solveTone(options.override || sample, options.targetContrast, measured.check);
        if (!result.passes) {
          stacked = true;
          reason = "contrast";
          setLayout(true);
          measured = measure(true);
          sample = measured.sample;
          result = colour.solveTone(options.override || sample, options.targetContrast);
        }
      } catch (failure) {
        error = `${failure.name}: ${failure.message}`;
        source = "fallback";
        stacked = true;
        reason = "image";
        fieldCache = null;
        setLayout(true);
        surface.style.setProperty("--adaptive-gradient", colour.gradientCss(gradientFor(image.getBoundingClientRect(), true)));
        result = colour.solveTone(options.override || sample, options.targetContrast);
      }
      if (options.override) {
        source = "override";
      }
      surface.style.setProperty("--image-tone", colour.hex(result.rgb));
      surface.style.setProperty("--image-tone-rgb", result.rgb.join(" "));
      surface.classList.remove("is-pending");
      Object.assign(surface.dataset, {
        toneSource: source,
        sampleTone: colour.hex(sample),
        autoTone: colour.hex(result.rgb),
        contrast: String(result.contrast),
        targetContrast: String(options.targetContrast),
        fallbackReason: reason,
        sampleEdge: stacked || !options.direction ? "bottom" : options.direction,
        error
      });
      observed = fingerprint();
      options.onResult?.({ ...result, sample, source, stacked, reason, error, duration: performance.now() - started });
    }
    function refresh({ retry = false } = {}) {
      if (retry) {
        sampleCache = null;
        fieldCache = null;
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
      const sourceChanged = mutations.some((mutation) => mutation.target === image);
      if (sourceChanged) {
        surface.classList.add("is-pending");
        startLoadingDeadline();
      }
      refresh({ retry: sourceChanged });
    });
    edited.observe(text, { childList: true, characterData: true, subtree: true });
    edited.observe(image, { attributes: true, attributeFilter: ["src", "srcset", "sizes"] });
    const imageSettled = () => {
      clearTimeout(loadTimeout);
      loadingExpired = false;
      refresh({ retry: true });
    };
    const fontsChanged = () => refresh();
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
        sampleCache = null;
        fieldCache = null;
      }
    };
  }
  root.attachAdaptiveColour = attachAdaptiveColour;
})(window);
