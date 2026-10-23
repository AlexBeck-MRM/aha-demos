/* Component lifecycle. Production delivery combines this file with engine.js. */
(function (root) {
  "use strict";
  const colour = root.AdaptiveColour;
  const IMAGE_TIMEOUT_MS = 8000;

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
      if (!Number.isFinite(value) || value < 0 || value > 1 || (key !== "opacity" && value === 0)) {
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
      ...settings,
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
          bottom: Math.min(bounds.height, rect.bottom - bounds.top + 2),
        })).filter((rect) => rect.right > rect.left && rect.bottom > rect.top);
      });
    }

    function gradientFor(bounds, stacked) {
      return colour.gradientModel({
        width: bounds.width,
        height: bounds.height,
        coverage: stacked ? (options.stackedCoverage ?? options.coverage) : options.coverage,
        opacity: options.opacity,
        direction: stacked ? null : options.direction,
        stacked,
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
        // Solid text has no photograph behind it; retain no high-density pixel data.
        fieldCache = null;
      } else {
        const density = Math.max(2, window.devicePixelRatio || 1);
        const regions = readRegions(bounds);
        const phase = [bounds.left, bounds.top].map((position) => position * density - Math.floor(position * density));
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
      return text.scrollWidth <= text.clientWidth && (options.direction
        ? content.getBoundingClientRect().height <= height
        : verticalHeight <= height * options.coverage);
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
          throw new Error(loadingExpired && !image.complete
            ? "Image loading timed out. Reload the page to retry."
            : "The photograph could not be loaded. Reload the page to retry.");
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
        error,
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
        const changed = Object.entries(next).some(([key, value]) => Array.isArray(value)
          ? !Array.isArray(options[key]) || value.some((channel, index) => channel !== options[key][index])
          : value !== options[key]);
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
      },
    };
  }
  root.attachAdaptiveColour = attachAdaptiveColour;
})(window);
