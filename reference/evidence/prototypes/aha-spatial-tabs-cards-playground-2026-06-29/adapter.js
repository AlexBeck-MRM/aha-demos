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
