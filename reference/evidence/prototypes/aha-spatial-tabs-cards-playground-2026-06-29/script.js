const cardRow = document.querySelector("[data-image-row]");
const controlsRoot = document.querySelector("[data-control-root]");
const configOutput = document.querySelector("[data-config-output]");
const copyStatus = document.querySelector("[data-copy-status]");
const saveConfigButton = document.querySelector("[data-save-config]");
const copyConfigButton = document.querySelector("[data-copy-config]");
const copyCssButton = document.querySelector("[data-copy-css]");
const resetConfigButton = document.querySelector("[data-reset-config]");
const activePreset = document.querySelector("[data-active-preset]");

const CONFIG_PATH = "config.json?v=overlay-v10";
const SAVE_ENDPOINT = "/__adaptive-card-lab/save-settings";
const { schema: CONFIG_SCHEMA, photoPeaks, defaults: fallbackState, ranges: controlRanges, normalizeState, migrateConfig } = AdaptiveColourSettings;
const SURFACE_NAME = "AHA Adaptive Image Colour Lab";

const ENGINE = Object.freeze({ targetContrast: 7, sampleDepth: 0.5, toneSaturation: 0.95 });
const SHARED_STOPS = [[0, 0], [0.2, 0.15], [0.4, 0.8], [0.8, 1], [1, 1]];
const SIDE_ANGLE = 60;
const CONTRAST_RESERVE = 0.2;
const STACK_JOIN = 8;

const headerExample = {
  title: "Health & hope for every heart.",
  body: "More moments together. More life ahead.",
  sampleSrc: "assets/header-women-outdoors.png",
  fallbackTone: [59, 42, 30],
};

const imageGroupTitles = { A: "Overlay A — Cards", B: "Overlay B — Backgrounds" };

const cards = [
  {
    id: "habits",
    family: "A",
    label: "Example 1 - green tones",
    title: "Build Healthier Habits",
    body: "Simple steps for food, movement, sleep, and more.",
    sampleSrc: "assets/figma/card-habits-2.png",
    fallbackTone: [23, 60, 60],
  },
  {
    id: "women",
    family: "A",
    label: "Example 2 - warm tones",
    title: "Women’s Heart Health",
    body: "Know the signs, understand your risk, and plan ahead.",
    sampleSrc: "assets/figma/card-women-3.png",
    fallbackTone: [80, 57, 38],
  },
  {
    id: "bright",
    family: "A",
    label: "Example 3 - bright tones",
    title: "Know Your Numbers",
    body: "Small checks can help you understand your heart health.",
    sampleSrc: "assets/figma/card-women-1.png",
    fallbackTone: [42, 62, 74],
  },
  {
    id: "dark",
    family: "A",
    label: "Example 4 - dark tones",
    title: "More Moments That Matter",
    body: "Find support for the people and routines you love.",
    sampleSrc: "assets/card-dark-tones.png",
    fallbackTone: [30, 36, 48],
  },
  {
    id: "saturated",
    family: "A",
    label: "Example 5 - saturated reds",
    title: "Make a Difference",
    body: "Find a way to support healthier communities.",
    sampleSrc: "assets/figma/card-women-2.png",
    photoPosition: "70% 50%",
    fallbackTone: [82, 30, 34],
  },
  {
    id: "mixed",
    family: "A",
    label: "Example 6 - mixed lighting",
    title: "Make Time for Movement",
    body: "Small moments of activity can bring us closer.",
    sampleSrc: "assets/card-mixed-lighting.png",
    fallbackTone: [76, 60, 38],
  },
  {
    ...headerExample,
    id: "header",
    family: "B",
    label: "Vertical example — landscape header",
  },
  {
    ...headerExample,
    id: "header-portrait",
    family: "B",
    stacked: true,
    label: "Mobile example — header image",
  },
  {
    id: "horizontal-right",
    family: "B",
    horizontal: "right",
    label: "Horizontal example — text right",
    title: "Together, we can make a difference.",
    body: "Find support, share your story and help build a healthier future for every heart.",
    sampleSrc: "assets/community-hands.png",
    photoPosition: "30% 50%",
    fallbackTone: [69, 52, 32],
  },
  {
    id: "horizontal-left",
    family: "B",
    horizontal: "left",
    label: "Horizontal example — text left",
    title: "Small actions. Lasting change.",
    body: "Bring your time, energy and care to a community working for healthier lives.",
    sampleSrc: "assets/figma/card-women-2.png",
    photoPosition: "70% 35%",
    fallbackTone: [48, 54, 29],
  },
  {
    id: "horizontal-mobile",
    family: "B",
    horizontal: "right",
    stacked: true,
    label: "Mobile example — hands image",
    title: "Together, we can make a difference.",
    body: "Find support, share your story and help build a healthier future for every heart.",
    sampleSrc: "assets/community-hands.png",
    photoPosition: "30% 50%",
    fallbackTone: [69, 52, 32],
  },
];

cards.splice(6, 0, {
  id: "card-horizontal",
  family: "A",
  horizontal: "right",
  compact: true,
  label: "Example 7 - warm tones · horizontal",
  title: "Small actions. Lasting change.",
  body: "Bring your time and care to a healthier community.",
  sampleSrc: "assets/figma/card-women-3.png",
  photoPosition: "50% 20%",
  fallbackTone: [80, 57, 38],
});

const presets = {
  balanced: { label: "Defaults", values: { ...fallbackState } },
  broader: { label: "Broader", values: { ...fallbackState, overlayAVerticalCoverage: 70, overlayAHorizontalCoverage: 90, overlayBVerticalCoverage: 50, overlayBHorizontalCoverage: 90 } },
};
const controlGroups = ["A", "B"].map((family) => ({
  id: family,
  title: imageGroupTitles[family],
  open: true,
  status: () => `${Math.round(photoPeaks[family] * 100)}%`,
  controls: [
    { key: `overlay${family}VerticalCoverage`, label: "Vertical height", step: 1, unit: "%" },
    { key: `overlay${family}HorizontalCoverage`, label: "Horizontal width", step: 1, unit: "%" },
  ].map((control) => ({ ...control, min: controlRanges[control.key][0], max: controlRanges[control.key][1] })),
}));

const controls = controlGroups.flatMap((group) => group.controls);
const cardResults = new Map();
const imageLoads = new Map();
const loadedImages = new Map();
const gradientModels = new Map();
const contrastFields = new Map();
const LINEAR_CHANNEL = Array.from({ length: 256 }, (_, channel) => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
});
let authoredState = { ...fallbackState };
let state = { ...fallbackState };
let analysisRun = 0;

async function init() {
  authoredState = normalizeState(await loadAuthoredState());
  state = { ...authoredState };
  renderCards();
  observeTextRegions();
  renderControls();
  bindPanelActions();
  applyControls();
}

function renderCards() {
  cardRow.innerHTML = Object.entries(imageGroupTitles).map(([groupId, title]) => `
    <section class="image-example-group" aria-labelledby="image-group-${groupId}">
      <h2 class="image-group-title" id="image-group-${groupId}">${title}</h2>
      <div class="image-examples">
        ${cards.filter((card) => card.family === groupId).map(renderCard).join("")}
      </div>
    </section>
  `).join("");
}

function renderCard(card) {
  const fallback = deriveLegibleTone(card.fallbackTone, ENGINE.toneSaturation, ENGINE.targetContrast).rgb;
  const fallbackHex = rgbToHex(fallback);
  return `
    <figure class="image-example ${card.family === "B" ? "image-example-background" : ""} ${card.compact ? "image-example-compact" : ""} ${card.stacked ? "image-example-mobile" : ""}" data-image-example="${card.id}">
      <div class="image-view-label">${card.label}</div>
      <div class="image-surface" data-image-id="${card.id}" data-family="${card.family}" style="--image-tone:${fallbackHex};--image-tone-rgb:${fallback.join(" ")};--photo-position:${card.photoPosition || "50% 50%"}">
        <img class="image-photo" src="${card.sampleSrc}" alt="">
        <div class="image-gradient" aria-hidden="true"></div>
        <div class="image-content">
          <div class="image-copy"><h3 class="image-title">${card.title}</h3><p class="image-body">${card.body}</p></div>
        </div>
      </div>
      <figcaption class="image-analysis" aria-live="polite">
        <span class="tone-swatch" data-tone-swatch></span>
        <span>
          <strong data-tone-value>Sampling image…</strong>
          <small data-treatment-value>Overlay ${card.family}</small>
          <small data-contrast-value>Checking white text…</small>
        </span>
      </figcaption>
    </figure>
  `;
}

function renderControls() {
  controlsRoot.innerHTML = `
    <div class="preset-controls">
        ${Object.entries(presets).map(([key, preset]) => `
          <button class="panel-button parameterizer-button preset-button" type="button" data-preset="${key}">${preset.label}</button>
        `).join("")}
    </div>
    ${controlGroups.map(renderControlGroup).join("")}
  `;

  controlsRoot.addEventListener("input", (event) => {
    const input = event.target.closest("[data-control]");
    if (!input) return;
    state[input.dataset.control] = Number(input.value);
    applyControls();
    markStateDirty();
  });

  controlsRoot.addEventListener("click", (event) => {
    const presetButton = event.target.closest("[data-preset]");
    if (!presetButton) return;
    const preset = presets[presetButton.dataset.preset];
    if (!preset) return;
    state = { ...state, ...preset.values };
    syncInputs();
    applyControls();
    markStateDirty();
  });
}

function renderControlGroup(group) {
  return `
    <details class="parameterizer-folder ${imageGroupTitles[group.id] ? "image-type-controls" : ""}" ${group.open ? "open" : ""}>
      <summary class="parameterizer-folder-title" id="control-${group.id}">
        <span>${group.title}</span>
        <span data-group-status="${group.id}">${group.status()}</span>
      </summary>
      <div class="parameterizer-folder-body">
        ${group.controls.map(renderControl).join("")}
      </div>
    </details>
  `;
}

function renderControl(control) {
  return `
    <label class="parameterizer-row" for="${control.key}">
      <span class="parameterizer-label" title="${control.label}">${control.label}</span>
      <input class="parameterizer-control parameterizer-range" id="${control.key}" type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${state[control.key]}" data-control="${control.key}">
      <output class="parameterizer-value" data-output="${control.key}">${formatValue(state[control.key], control)}</output>
    </label>
  `;
}

function applyControls() {
  state = normalizeState(state);
  updateTextRegions();
  controls.forEach((control) => {
    const output = controlsRoot.querySelector(`[data-output="${control.key}"]`);
    if (output) output.textContent = formatValue(state[control.key], control);
  });
  controlGroups.forEach((group) => {
    const output = controlsRoot.querySelector(`[data-group-status="${group.id}"]`);
    if (output) output.textContent = group.status();
  });
  controlsRoot.querySelectorAll("[data-preset]").forEach((button) => {
    button.classList.toggle("is-active", matchesPreset(button.dataset.preset));
    button.setAttribute("aria-pressed", String(matchesPreset(button.dataset.preset)));
  });
  if (activePreset) activePreset.textContent = getPresetLabel();
  if (configOutput) configOutput.value = buildConfigExport();
  void analyseCards();
}

async function analyseCards() {
  const runId = ++analysisRun;
  setPanelStatus("Analysing image colour…");
  // Cached images are checked synchronously so layout and colour settle together.
  cards.forEach((card) => updateCardTone(analyseCard(card, loadedImages.get(card.sampleSrc))));
  await Promise.all(cards.map(async (card) => {
    let image;
    try { image = await loadImage(card.sampleSrc); } catch { /* Safe fallback below. */ }
    if (runId === analysisRun) updateCardTone(analyseCard(card, image));
  }));
  if (runId !== analysisRun) return;
  const fallback = [...cardResults.values()].some((result) => result.fallback);
  setPanelStatus(fallback ? "Sampling unavailable; safe fallback treatment active." : "Image colours checked. Contrast target protected.");
}

function analyseCard(card, image) {
  const surface = cardRow.querySelector(`[data-image-id="${card.id}"]`);
  updateFamilyRegion(surface, card);
  let sampledRgb = card.fallbackTone;
  let fallback = !image;
  try { if (image) sampledRgb = sampleImage(image, ENGINE.sampleDepth, surface); }
  catch { image = null; fallback = true; }
  const model = gradientModels.get(card.id);
  let check;
  if (surface.dataset.contentPlacement === "overlay") {
    try { check = createContrastCheck(surface, image, model); }
    catch { image = null; fallback = true; check = createContrastCheck(surface, null, model); }
  }
  let tone = deriveLegibleTone(sampledRgb, ENGINE.toneSaturation, ENGINE.targetContrast, 1, check);
  if (tone.contrast < ENGINE.targetContrast + CONTRAST_RESERVE) {
    updateFamilyRegion(surface, card, "contrast");
    try { if (image) sampledRgb = sampleImage(image, ENGINE.sampleDepth, surface); } catch { /* Keep the safe family fallback. */ }
    tone = deriveLegibleTone(sampledRgb, ENGINE.toneSaturation, ENGINE.targetContrast);
  }
  return { card, sampledRgb, fallback, ...tone, checkedPhoto: Boolean(check && image && surface.dataset.contentPlacement === "overlay") };
}

function updateTextRegions() {
  cards.forEach((card) => updateFamilyRegion(cardRow.querySelector(`[data-image-id="${card.id}"]`), card));
}

function updateFamilyRegion(surface, card, fallbackReason = "") {
  const width = surface.getBoundingClientRect().width;
  const family = card.family;
  const stacked = Boolean(card.stacked || fallbackReason
    || (family === "B" && width < 720)
    || (family === "A" && card.horizontal && width < 520));
  const horizontal = Boolean(card.horizontal && !stacked);
  const height = stacked ? width * 2 / 3
    : horizontal ? width * (family === "A" ? 0.5 : 618 / 1600)
      : family === "A" ? width * 471 / 320 : width * 9 / 16;
  const coverage = state[`overlay${family}${horizontal ? "Horizontal" : "Vertical"}Coverage`] / 100;
  const opacity = photoPeaks[family];
  surface.classList.toggle("is-stacked", stacked);
  surface.dataset.layout = stacked ? "mobile" : horizontal ? "horizontal" : "vertical";
  surface.dataset.horizontalDirection = card.horizontal || "";
  surface.style.setProperty("--image-photo-height", `${height}px`);
  const content = surface.querySelector(".image-content");
  const copy = surface.querySelector(".image-copy");
  const contentStyle = getComputedStyle(content);
  const fits = copy.scrollWidth <= copy.clientWidth && (horizontal
    ? content.getBoundingClientRect().height <= height
    : copy.offsetHeight + parseFloat(contentStyle.paddingBottom) + 8 <= height * coverage);
  if (!stacked && !fits) return updateFamilyRegion(surface, card, "fit");
  surface.dataset.contentPlacement = stacked ? "below" : "overlay";
  surface.dataset.fallbackReason = fallbackReason;
  surface.dataset.sampleEdge = horizontal ? card.horizontal : "bottom";
  surface.dataset.gradientAxis = horizontal ? "angled" : "vertical";
  surface.dataset.gradientCoverage = String(coverage * 100);
  const bounds = surface.querySelector(".image-photo").getBoundingClientRect();
  const model = {
    kind: horizontal ? "angled" : "vertical", width: bounds.width, height: bounds.height,
    coverage, opacity, stops: SHARED_STOPS, direction: card.horizontal,
    angle: SIDE_ANGLE, join: stacked ? STACK_JOIN : 0,
  };
  gradientModels.set(card.id, model);
  surface.style.setProperty("--adaptive-gradient", horizontal ? angledGradientCss(model) : verticalGradientCss(model));
}

function verticalGradientCss(model) {
  const rampStart = (1 - model.coverage) * model.height;
  const stops = model.stops.filter(([position]) => !model.join || position < 1)
    .map(([position, alpha]) => `rgb(var(--image-tone-rgb) / ${alpha * model.opacity}) ${rampStart + position * model.coverage * model.height}px`);
  if (model.join) stops.push(
    `rgb(var(--image-tone-rgb) / ${model.opacity}) ${model.height - model.join}px`,
    `rgb(var(--image-tone-rgb) / 1) ${model.height}px`,
  );
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

function angledGradientCss(model) {
  // Figma's transform acts on normalized image coordinates. CSS works on a
  // physical gradient line: project the mid-height start/end onto that line.
  const radians = model.angle * Math.PI / 180;
  const start = (1 - model.coverage) * model.width * Math.sin(radians) + model.height * Math.cos(radians) / 2;
  const span = model.coverage * model.width * Math.sin(radians);
  const cssAngle = model.direction === "right" ? 180 - model.angle : 180 + model.angle;
  return `linear-gradient(${cssAngle}deg, ${model.stops.map(([position, alpha]) =>
    `rgb(var(--image-tone-rgb) / ${alpha * model.opacity}) ${start + span * position}px`).join(", ")})`;
}

function gradientAlphaAt(model, x, y) {
  if (model.join && y > model.height - model.join) {
    return model.opacity + (1 - model.opacity) * Math.min(1, (y - model.height + model.join) / model.join);
  }
  const horizontalDistance = model.direction === "right" ? x - model.width : -x;
  const progress = model.kind === "angled"
    ? 1 + (horizontalDistance + (y - model.height / 2) / Math.tan(model.angle * Math.PI / 180)) / (model.coverage * model.width)
    : (y / model.height - (1 - model.coverage)) / model.coverage;
  const stops = model.stops;
  if (progress <= 0) return 0;
  for (let index = 1; index < stops.length; index += 1) {
    const [end, endAlpha] = stops[index];
    if (progress <= end) {
      const [start, startAlpha] = stops[index - 1];
      return model.opacity * (startAlpha + (endAlpha - startAlpha) * (progress - start) / (end - start));
    }
  }
  return model.opacity;
}

function createContrastCheck(surface, image, model) {
  const photo = surface.querySelector(".image-photo");
  const bounds = photo.getBoundingClientRect();
  // Range rectangles follow wrapped text fragments, excluding empty block width.
  // The 2px margin includes glyph overhang/descenders and raster rounding.
  const regions = [...surface.querySelectorAll(".image-title, .image-body")].flatMap((node) => {
    const range = document.createRange();
    range.selectNodeContents(node);
    return [...range.getClientRects()].map((rect) => ({
      left: Math.max(0, Math.floor(rect.left - bounds.left - 2)), top: Math.max(0, Math.floor(rect.top - bounds.top - 2)),
      right: Math.min(Math.ceil(bounds.width), Math.ceil(rect.right - bounds.left + 2)),
      bottom: Math.min(Math.ceil(bounds.height), Math.ceil(rect.bottom - bounds.top + 2)),
    }));
  });
  const key = JSON.stringify([image?.src, bounds.width, bounds.height, getComputedStyle(photo).objectPosition, model, regions]);
  const cached = contrastFields.get(surface.dataset.imageId);
  if (cached?.key === key) return cached.check;
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(bounds.width); canvas.height = Math.ceil(bounds.height);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (image) {
    const scale = Math.max(bounds.width / image.naturalWidth, bounds.height / image.naturalHeight);
    const position = getComputedStyle(photo).objectPosition.split(" ").map((value) => parseFloat(value) / 100);
    context.drawImage(image, (bounds.width - image.naturalWidth * scale) * position[0],
      (bounds.height - image.naturalHeight * scale) * position[1], image.naturalWidth * scale, image.naturalHeight * scale);
  } else { context.fillStyle = "white"; context.fillRect(0, 0, canvas.width, canvas.height); }
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const samples = [];
  let minimumAlpha = 1;
  for (const region of regions) {
    for (let y = region.top; y < region.bottom; y += 1) {
      for (let x = region.left; x < region.right; x += 1) {
        const index = (y * canvas.width + x) * 4;
        const alpha = gradientAlphaAt(model, x + 0.5, y + 0.5);
        const photoWeight = (1 - alpha) * pixels[index + 3] / 255;
        samples.push(pixels[index] * photoWeight, pixels[index + 1] * photoWeight,
          pixels[index + 2] * photoWeight, 1 - photoWeight);
        minimumAlpha = Math.min(minimumAlpha, alpha);
      }
    }
  }
  surface.dataset.minimumTextAlpha = minimumAlpha.toFixed(4);
  const field = Float32Array.from(samples);
  const check = (tone) => {
    let maximumLuminance = 0;
    for (let index = 0; index < field.length; index += 4) {
      const r = Math.min(255, Math.ceil(field[index] + tone[0] * field[index + 3]));
      const g = Math.min(255, Math.ceil(field[index + 1] + tone[1] * field[index + 3]));
      const b = Math.min(255, Math.ceil(field[index + 2] + tone[2] * field[index + 3]));
      maximumLuminance = Math.max(maximumLuminance, LINEAR_CHANNEL[r] * 0.2126 + LINEAR_CHANNEL[g] * 0.7152 + LINEAR_CHANNEL[b] * 0.0722);
    }
    return 1.05 / (maximumLuminance + 0.05);
  };
  contrastFields.set(surface.dataset.imageId, { key, check });
  return check;
}

function observeTextRegions() {
  updateTextRegions();
  const observer = new ResizeObserver(() => {
    updateTextRegions();
    void analyseCards();
  });
  cardRow.querySelectorAll(".image-copy, .image-content, .image-photo").forEach((node) => observer.observe(node));
}

function updateCardTone(result) {
  const study = cardRow.querySelector(`[data-image-example="${result.card.id}"]`);
  const card = study?.querySelector(".image-surface");
  if (!card) return;
  card.style.setProperty("--image-tone", result.hex);
  card.style.setProperty("--image-tone-rgb", result.rgb.join(" "));
  card.dataset.autoTone = result.hex;
  card.dataset.contrast = result.contrast.toFixed(2);
  card.dataset.solidContrast = result.solidContrast.toFixed(2);
  card.dataset.toneSource = result.fallback ? "fallback" : "image";
  card.dataset.treatment = `overlay-${result.card.family.toLowerCase()}`;
  study.querySelector("[data-tone-swatch]").style.setProperty("--swatch", result.hex);
  study.querySelector("[data-tone-value]").textContent = `${result.fallback ? "Fallback" : "Auto"} tone ${result.hex}`;
  const stacked = card.classList.contains("is-stacked");
  const composition = stacked ? "Image above text" : card.dataset.layout === "horizontal" ? "Horizontal" : "Vertical";
  const peak = Math.round(photoPeaks[result.card.family] * 100);
  study.querySelector("[data-treatment-value]").textContent = `Overlay ${result.card.family} · ${composition} · ${peak}% photo peak${stacked ? "; 100% join + text area" : ""}`;
  const contrastBasis = stacked ? "solid tone" : result.checkedPhoto ? "photo + overlay" : "white + overlay bound";
  study.querySelector("[data-contrast-value]").textContent = `≥ ${(Math.floor(result.contrast * 10) / 10).toFixed(1)}:1 white / ${contrastBasis}`;
  cardResults.set(result.card.id, result);
}

function loadImage(src) {
  if (imageLoads.has(src)) return imageLoads.get(src);
  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.crossOrigin = "anonymous";
    const timeout = setTimeout(() => reject(new Error("Image sampling timed out.")), 8000);
    const finish = (callback) => (value) => {
      clearTimeout(timeout);
      callback(value);
    };
    image.onload = finish(() => { loadedImages.set(src, image); resolve(image); });
    image.onerror = finish(reject);
    image.src = new URL(src, document.baseURI).href;
  });
  // Cache both successful loads and failures until reload; sliders never retry a failed URL.
  imageLoads.set(src, promise);
  return promise;
}

function sampleImage(image, sampleDepth, surface) {
  const width = 80;
  const photo = surface.querySelector(".image-photo");
  const height = Math.max(1, Math.round(width * photo.clientHeight / photo.clientWidth));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  // CSS uses percentage object-position; match its cover crop before sampling an edge.
  const position = getComputedStyle(photo).objectPosition.split(" ").map((value) => parseFloat(value) / 100);
  context.drawImage(image, (width - drawWidth) * position[0], (height - drawHeight) * position[1], drawWidth, drawHeight);

  const depth = clamp(sampleDepth, 0.28, 0.7);
  const edge = surface.dataset.sampleEdge || "bottom";
  const startX = edge === "right" ? Math.floor(width * (1 - depth)) : 0;
  const startY = edge === "bottom" ? Math.floor(height * (1 - depth)) : 0;
  const sampleWidth = edge === "left" ? Math.ceil(width * depth) : width - startX;
  const pixels = context.getImageData(startX, startY, sampleWidth, height - startY).data;
  let red = 0;
  let green = 0;
  let blue = 0;
  let totalWeight = 0;

  for (let index = 0; index < pixels.length; index += 16) {
    if (pixels[index + 3] < 128) continue;
    const rgb = [pixels[index], pixels[index + 1], pixels[index + 2]];
    const [, saturation] = rgbToHsl(rgb);
    const weight = 0.55 + saturation * 0.9;
    red += rgb[0] * weight;
    green += rgb[1] * weight;
    blue += rgb[2] * weight;
    totalWeight += weight;
  }

  if (!totalWeight) throw new Error("No image pixels were available for sampling.");
  return [red, green, blue].map((channel) => Math.round(channel / totalWeight));
}

function deriveLegibleTone(sampledRgb, saturationMultiplier, targetContrast, opacity = 1, contrastCheck) {
  const [hue, sampledSaturation, sampledLightness] = rgbToHsl(sampledRgb);
  const saturation = clamp(sampledSaturation * saturationMultiplier, 0.18, 0.78);
  let lightness = clamp(sampledLightness * 0.68, 0.08, 0.32);
  let rgb = hslToRgb([hue, saturation, lightness]);
  // White is the brightest possible sRGB underlay. Round up to cover 8-bit compositing.
  const compositeContrast = contrastCheck || ((tone) => contrastRatio([255, 255, 255],
    tone.map((channel) => Math.ceil(channel * opacity + 255 * (1 - opacity)))));
  let contrast = compositeContrast(rgb);

  // The same bound protects every photo treatment, including fallbacks and control extremes.
  const minimumContrast = clamp(targetContrast, 4.5, 12) + CONTRAST_RESERVE;
  while (contrast < minimumContrast && lightness > 0) {
    lightness = Math.max(0, lightness - 0.005);
    rgb = hslToRgb([hue, saturation, lightness]);
    contrast = compositeContrast(rgb);
  }

  return { rgb, hex: rgbToHex(rgb), contrast, solidContrast: contrastRatio([255, 255, 255], rgb), opacity };
}

function rgbToHsl([red, green, blue]) {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;

  if (delta) {
    if (max === r) hue = ((g - b) / delta) % 6;
    if (max === g) hue = (b - r) / delta + 2;
    if (max === b) hue = (r - g) / delta + 4;
    hue = ((hue * 60) + 360) % 360;
  }

  const lightness = (max + min) / 2;
  const saturation = delta ? delta / (1 - Math.abs(2 * lightness - 1)) : 0;
  return [hue, saturation, lightness];
}

function hslToRgb([hue, saturation, lightness]) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const section = hue / 60;
  const secondary = chroma * (1 - Math.abs((section % 2) - 1));
  let channels = [0, 0, 0];

  if (section < 1) channels = [chroma, secondary, 0];
  else if (section < 2) channels = [secondary, chroma, 0];
  else if (section < 3) channels = [0, chroma, secondary];
  else if (section < 4) channels = [0, secondary, chroma];
  else if (section < 5) channels = [secondary, 0, chroma];
  else channels = [chroma, 0, secondary];

  const match = lightness - chroma / 2;
  return channels.map((channel) => Math.round((channel + match) * 255));
}

function contrastRatio(first, second) {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const light = Math.max(firstLuminance, secondLuminance);
  const dark = Math.min(firstLuminance, secondLuminance);
  return (light + 0.05) / (dark + 0.05);
}

function relativeLuminance(rgb) {
  const channels = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function bindPanelActions() {
  saveConfigButton?.addEventListener("click", () => void saveCurrentState());
  copyConfigButton?.addEventListener("click", () => copyText(buildConfigExport(), "Config copied."));
  copyCssButton?.addEventListener("click", () => copyText(buildCssExport(), "CSS copied."));
  resetConfigButton?.addEventListener("click", () => {
    state = { ...authoredState };
    syncInputs();
    applyControls();
    setPanelStatus("Reverted to the authored config.");
  });
}

async function loadAuthoredState() {
  try {
    const response = await fetch(CONFIG_PATH, { cache: "no-store" });
    if (!response.ok) throw new Error("Config could not be loaded.");
    const migrated = migrateConfig(await response.json());
    const notice = document.querySelector("[data-migration-status]");
    if (notice) {
      notice.hidden = migrated.notes.length === 0;
      notice.textContent = migrated.notes.join(" ");
    }
    return migrated.state;
  } catch {
    setPanelStatus("Using defaults; config.json could not be loaded.");
    return fallbackState;
  }
}

async function saveCurrentState() {
  const payload = buildConfigPayload();
  saveConfigButton.disabled = true;
  try {
    const response = await fetch(SAVE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.saved) throw new Error(result.message || "Save failed.");
    // Preserve the exact values that this request saved, even if a slider moved.
    authoredState = { ...payload.state };
    const notice = document.querySelector("[data-migration-status]");
    if (notice) notice.hidden = true;
    setPanelStatus("Saved to config.json.");
  } catch {
    if (configOutput) {
      configOutput.value = JSON.stringify(payload, null, 2);
      configOutput.focus();
      configOutput.select();
    }
    setPanelStatus("Save uses the local server. Config selected for copying.");
  } finally {
    saveConfigButton.disabled = false;
  }
}

function buildConfigPayload() {
  return {
    schema: CONFIG_SCHEMA,
    surface: SURFACE_NAME,
    state: normalizeState(state),
  };
}



function syncInputs() {
  controls.forEach((control) => {
    const input = controlsRoot.querySelector(`[data-control="${control.key}"]`);
    if (input) input.value = state[control.key];
  });
}

function markStateDirty() {
  const unchanged = JSON.stringify(normalizeState(state)) === JSON.stringify(normalizeState(authoredState));
  setPanelStatus(unchanged ? "Authored settings active." : "Unsaved changes; automatic tones updated.");
}

function buildConfigExport() {
  return JSON.stringify({
    ...buildConfigPayload(),
    preset: getPresetLabel(),
  }, null, 2);
}

function buildCssExport() {
  const lines = [
    "/* Snapshot of current crops and dimensions. Use matching config, styles.css and runtime for responsive layouts. */",
    "/* The 8px stacked join and solid text area reach 100%; the selected family caps the main photo ramp. */",
  ];
  cardResults.forEach((result, cardId) => {
    const surface = cardRow.querySelector(`[data-image-id="${cardId}"]`);
    lines.push("", `.image-surface[data-image-id="${cardId}"] {`,
      `  --image-tone: ${result.hex};`,
      `  --image-tone-rgb: ${result.rgb.join(" ")};`,
      `  --image-photo-height: ${surface.style.getPropertyValue("--image-photo-height")};`,
      `  --adaptive-gradient: ${surface.style.getPropertyValue("--adaptive-gradient")};`, "}");
  });
  return lines.join("\n");
}

async function copyText(value, successMessage) {
  try {
    await navigator.clipboard.writeText(value);
    setPanelStatus(successMessage);
  } catch {
    if (configOutput) {
      configOutput.value = value;
      configOutput.focus();
      configOutput.select();
    }
    setPanelStatus("Copy blocked; selected output instead.");
  }
}

function setPanelStatus(message) {
  if (copyStatus) copyStatus.textContent = message;
}

function formatValue(value, control) {
  const scaled = value * (control.scale || 1);
  if (control.unit === ":1") return `${formatNumber(scaled)}:1`;
  return `${formatNumber(scaled)}${control.unit}`;
}

function formatNumber(value) {
  return Number(value).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function matchesPreset(presetKey) {
  const preset = presets[presetKey];
  if (!preset) return false;
  return Object.entries(preset.values).every(([key, value]) => state[key] === value);
}

function getPresetLabel() {
  const matchingPreset = Object.entries(presets).find(([key]) => matchesPreset(key));
  return matchingPreset ? matchingPreset[1].label : "Custom";
}

function rgbToHex(rgb) {
  return `#${rgb.map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

void init();
