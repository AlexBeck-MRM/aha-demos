/* Component lifecycle. Gallery fixture only; combines with gradient-colour.js for the examples. */
(function (root) {
  "use strict";
  const colour = root.GradientColour;
  const hex = (rgb) => `#${rgb.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
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
          // Clip only the additional safety padding; never discard actual text.
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
        coverage: stacked ? (options.stackedCoverage ?? options.coverage) : options.coverage,
        opacity: options.opacity,
        direction: stacked ? null : options.direction,
        stacked,
      };
      const density = Math.max(2, window.devicePixelRatio || 1);
      const regions = stacked ? undefined : readRegions(bounds);
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
        toneSource: source, sampleTone: hex(sample), autoTone: hex(result.rgb),
        contrast: verified ? String(result.contrast) : "", verification: verified ? "verified" : "unverified", targetContrast: String(options.targetContrast),
        fallbackReason: reason, sampleEdge: stacked || !options.direction ? "bottom" : options.direction,
        error, calculationVersion: "2", calculationRevision: String(result.revision), overlayFailure,
      });
      observed = fingerprint();
      const metrics = { ...measured.analysis.metrics, reused: !measured.preparedNow };
      if (!measured.preparedNow) { metrics.sampleReads = 0; metrics.pixelReads = 0; metrics.prepareMs = 0; }
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
        analysis = null;
        analysisKey = "";
      },
    };
  }
  root.attachAdaptiveColour = attachAdaptiveColour;
})(window);
