/* Crop-aware colour sampling and white-text contrast. No demo or lifecycle code. */
(function (root) {
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
    const luminance = linearChannels[red] * 0.2126
      + linearChannels[green] * 0.7152
      + linearChannels[blue] * 0.0722;
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
      height: drawHeight,
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

  // Preserve the full-photo cover transform, but allocate/read only the text-area union.
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

  // CSS and analysis use the same physical stop positions and sRGB colour interpolation.
  function gradientModel({ width, height, coverage, opacity, direction, stacked = false }) {
    const angle = direction ? (direction === "right" ? 120 : 240) : 180;
    const radians = angle * Math.PI / 180;
    const dx = Math.sin(radians);
    const dy = -Math.cos(radians);
    const length = Math.abs(width * dx) + Math.abs(height * dy);
    const start = direction
      ? (1 - coverage) * width * Math.abs(dx) + height * Math.abs(dy) / 2
      : (1 - coverage) * height;
    const span = direction ? coverage * width * Math.abs(dx) : coverage * height;
    let stops = [[0, 0], [0.2, 0.15], [0.4, 0.8], [0.8, 1], [1, 1]]
      .map(([position, alpha]) => [start + position * span, alpha * opacity]);
    if (stacked) {
      stops = [...stops.slice(0, -1), [height - 8, opacity], [height, 1]];
    }
    return { width, height, angle, dx, dy, length, stops };
  }

  function gradientCss(model) {
    const stops = model.stops.map(([position, alpha]) =>
      `rgb(var(--image-tone-rgb) / ${alpha}) ${position}px`);
    return `linear-gradient(${model.angle}deg in srgb, ${stops.join(", ")})`;
  }

  function gradientAlpha(model, x, y) {
    const distance = (x - model.width / 2) * model.dx
      + (y - model.height / 2) * model.dy + model.length / 2;
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
      bottom: clamp(Math.ceil((region.bottom + crop.offsetY) * crop.density) - crop.originY, 0, crop.height),
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
      // Round upwards so white-text contrast never benefits from background rounding.
      const red = clamp(Math.ceil(field[index] + rgb[0] * weight), 0, 255);
      const green = clamp(Math.ceil(field[index + 1] + rgb[1] * weight), 0, 255);
      const blue = clamp(Math.ceil(field[index + 2] + rgb[2] * weight), 0, 255);
      const luminance = linearChannels[red] * 0.2126
        + linearChannels[green] * 0.7152 + linearChannels[blue] * 0.0722;
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
    // Fully scan the final quantised colour; rejected candidates may stop early.
    const contrast = check(rgb);
    return { rgb, contrast, passes: contrast >= targetContrast };
  }

  const api = { cropGeometry, averageColour, sampleColour, readTextPixels, gradientModel,
    gradientCss, gradientAlpha, contrastField, contrastAgainstPhoto, solveTone,
    whiteContrast, hex, fromHex };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.AdaptiveColour = api;
  }
})(typeof window === "undefined" ? this : window);
