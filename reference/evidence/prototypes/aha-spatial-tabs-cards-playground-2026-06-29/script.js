const prototype = document.querySelector(".prototype");
const cardRow = document.querySelector("[data-card-row]");
const controlsRoot = document.querySelector("[data-control-root]");
const stateButtons = document.querySelectorAll("[data-state]");
const configOutput = document.querySelector("[data-config-output]");
const copyStatus = document.querySelector("[data-copy-status]");
const saveConfigButton = document.querySelector("[data-save-config]");
const copyConfigButton = document.querySelector("[data-copy-config]");
const copyCssButton = document.querySelector("[data-copy-css]");
const resetConfigButton = document.querySelector("[data-reset-config]");
const activePreset = document.querySelector("[data-active-preset]");

const CONFIG_PATH = "config.json";
const SAVE_ENDPOINT = "/__adaptive-card-lab/save-settings";
const CONFIG_SCHEMA = "aha-adaptive-colour-card/v1";
const SURFACE_NAME = "AHA Adaptive Colour Card Lab";

const fallbackState = Object.freeze({
  targetContrast: 7,
  sampleDepth: 0.52,
  toneSaturation: 0.95,
  gradientHeight: 62,
  gradientBlur: 7,
});

const cards = [
  {
    id: "habits",
    title: "Build Healthier Habits",
    body: "Simple steps for food, movement, sleep, and more.",
    sampleSrc: "assets/figma/card-habits-2.png",
    fallbackTone: [23, 60, 60],
    imageLayers: [
      { type: "image", src: "assets/figma/card-habits-1.png" },
      { type: "image", src: "assets/figma/card-habits-2.png", className: "card-image-overlay" },
    ],
  },
  {
    id: "women",
    title: "Women’s Heart Health",
    body: "Know the signs, understand your risk, and plan ahead.",
    sampleSrc: "assets/figma/card-women-3.png",
    fallbackTone: [80, 57, 38],
    imageLayers: [
      { type: "fill" },
      { type: "image", src: "assets/figma/card-women-1.png" },
      { type: "cropped", src: "assets/figma/card-women-2.png" },
      { type: "image", src: "assets/figma/card-women-3.png" },
    ],
  },
];

const presets = {
  balanced: {
    label: "Balanced",
    values: {
      targetContrast: 7,
      sampleDepth: 0.52,
      toneSaturation: 0.95,
      gradientHeight: 62,
      gradientBlur: 7,
    },
  },
  minimum: {
    label: "AA minimum",
    values: {
      targetContrast: 4.5,
      sampleDepth: 0.44,
      toneSaturation: 1,
      gradientHeight: 54,
      gradientBlur: 5,
    },
  },
  strong: {
    label: "Strong",
    values: {
      targetContrast: 9,
      sampleDepth: 0.6,
      toneSaturation: 0.9,
      gradientHeight: 70,
      gradientBlur: 9,
    },
  },
};

const controlGroups = [
  {
    id: "legibility",
    title: "Legibility",
    open: true,
    status: () => `${formatNumber(state.targetContrast)}:1`,
    controls: [
      { key: "targetContrast", label: "White contrast", min: 4.5, max: 12, step: 0.5, unit: ":1" },
      { key: "sampleDepth", label: "Sample depth", min: 0.28, max: 0.7, step: 0.01, unit: "%", scale: 100 },
    ],
  },
  {
    id: "colour",
    title: "Colour",
    open: true,
    status: () => `${Math.round(state.toneSaturation * 100)}%`,
    controls: [
      { key: "toneSaturation", label: "Tone colour", min: 0.45, max: 1.4, step: 0.05, unit: "%", scale: 100 },
    ],
  },
  {
    id: "blend",
    title: "Image blend",
    open: true,
    status: () => `${Math.round(state.gradientHeight)}% / ${formatNumber(state.gradientBlur)}px`,
    controls: [
      { key: "gradientHeight", label: "Blend height", min: 44, max: 78, step: 1, unit: "%" },
      { key: "gradientBlur", label: "Image blur", min: 0, max: 14, step: 1, unit: "px" },
    ],
  },
];

const controls = controlGroups.flatMap((group) => group.controls);
const cardResults = new Map();
let authoredState = { ...fallbackState };
let state = { ...fallbackState };
let analysisRun = 0;

async function init() {
  authoredState = normalizeState(await loadAuthoredState());
  state = { ...authoredState };
  renderCards();
  renderControls();
  bindStateControls();
  bindPressFeedback();
  bindPanelActions();
  applyControls();
}

function renderCards() {
  cardRow.innerHTML = cards.map((card) => {
    const fallback = card.fallbackTone;
    const fallbackHex = rgbToHex(fallback);
    return `
      <div class="card-study" data-card-study="${card.id}">
        <button
          class="card-md tactile-target demo-target"
          type="button"
          data-card-id="${card.id}"
          style="--card-tone: ${fallbackHex}; --card-tone-rgb: ${fallback.join(" ")}"
          aria-label="${card.title}. ${card.body}"
        >
          <span class="tactile-surface card-surface" aria-hidden="true">
            <span class="card-media-stack">
              ${card.imageLayers.map(renderCardImageLayer).join("")}
            </span>
            <span class="card-gradient"></span>
          </span>
          <span class="tactile-content card-content">
            <span class="card-copy">
              <span class="card-title">${card.title}</span>
              <span class="card-body">${card.body}</span>
            </span>
            <span class="card-arrow" aria-hidden="true">
              <img src="assets/figma/icon-chevron.svg" alt="">
            </span>
          </span>
        </button>
        <div class="card-analysis" aria-live="polite">
          <span class="tone-swatch" data-tone-swatch style="--swatch: ${fallbackHex}"></span>
          <span>
            <strong data-tone-value>Sampling image…</strong>
            <small data-contrast-value>Checking white text contrast</small>
          </span>
        </div>
      </div>
    `;
  }).join("");
}

function renderCardImageLayer(layer) {
  if (layer.type === "fill") {
    return `<span class="card-media-fill"></span>`;
  }

  if (layer.type === "cropped") {
    return `
      <span class="card-image-frame">
        <img class="card-image card-image-crop" src="${layer.src}" alt="">
      </span>
    `;
  }

  return `<img class="card-image ${layer.className || ""}" src="${layer.src}" alt="">`;
}

function renderControls() {
  controlsRoot.innerHTML = `
    <details class="parameterizer-folder preset-group" open>
      <summary class="parameterizer-folder-title">Presets</summary>
      <div class="preset-controls">
        ${Object.entries(presets).map(([key, preset]) => `
          <button class="panel-button parameterizer-button preset-button" type="button" data-preset="${key}">${preset.label}</button>
        `).join("")}
      </div>
    </details>
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
    state = { ...preset.values };
    syncInputs();
    applyControls();
    markStateDirty();
  });
}

function renderControlGroup(group) {
  return `
    <details class="parameterizer-folder" ${group.open ? "open" : ""}>
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

function bindStateControls() {
  stateButtons.forEach((button) => {
    button.addEventListener("click", () => {
      prototype.dataset.demoState = button.dataset.state;
      stateButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
    });
  });
}

function bindPressFeedback() {
  document.addEventListener("pointerdown", (event) => {
    const target = event.target.closest(".tactile-target");
    if (target) target.classList.add("is-pointer-pressed");
  });
  document.addEventListener("pointerup", clearPressedState);
  document.addEventListener("pointercancel", clearPressedState);
  document.addEventListener("pointerleave", clearPressedState);
}

function clearPressedState() {
  document.querySelectorAll(".is-pointer-pressed").forEach((target) => {
    target.classList.remove("is-pointer-pressed");
  });
}

function applyControls() {
  prototype.style.setProperty("--card-gradient-height", `${state.gradientHeight}%`);
  prototype.style.setProperty("--card-gradient-blur", `${state.gradientBlur}px`);

  controls.forEach((control) => {
    const output = controlsRoot.querySelector(`[data-output="${control.key}"]`);
    if (output) output.textContent = formatValue(state[control.key], control);
  });

  controlGroups.forEach((group) => {
    const output = controlsRoot.querySelector(`[data-group-status="${group.id}"]`);
    if (output) output.textContent = group.status();
  });

  controlsRoot.querySelectorAll("[data-preset]").forEach((button) => {
    const active = matchesPreset(button.dataset.preset);
    button.classList.toggle("is-active", active);
  });

  if (activePreset) activePreset.textContent = getPresetLabel();
  if (configOutput) configOutput.value = buildConfigExport();
  void analyseCards();
}

async function analyseCards() {
  const runId = ++analysisRun;
  setPanelStatus("Analysing image colour…");

  const results = await Promise.all(cards.map(async (card) => {
    try {
      const image = await loadImage(card.sampleSrc);
      const sampled = sampleImage(image, state.sampleDepth);
      const tone = deriveLegibleTone(sampled, state.toneSaturation, state.targetContrast);
      return { card, ...tone };
    } catch {
      const rgb = card.fallbackTone;
      return {
        card,
        rgb,
        hex: rgbToHex(rgb),
        contrast: contrastRatio([255, 255, 255], rgb),
        fallback: true,
      };
    }
  }));

  if (runId !== analysisRun) return;

  results.forEach(updateCardTone);
  const fallbackCount = results.filter((result) => result.fallback).length;
  setPanelStatus(fallbackCount ? "Image sampling fell back to authored tones." : "Automatic tones updated.");
}

function updateCardTone(result) {
  const study = cardRow.querySelector(`[data-card-study="${result.card.id}"]`);
  const card = study?.querySelector(".card-md");
  if (!study || !card) return;

  card.style.setProperty("--card-tone", result.hex);
  card.style.setProperty("--card-tone-rgb", result.rgb.join(" "));
  card.dataset.autoTone = result.hex;
  card.dataset.contrast = result.contrast.toFixed(2);
  study.querySelector("[data-tone-swatch]")?.style.setProperty("--swatch", result.hex);

  const toneValue = study.querySelector("[data-tone-value]");
  const contrastValue = study.querySelector("[data-contrast-value]");
  if (toneValue) toneValue.textContent = `Auto tone ${result.hex}`;
  if (contrastValue) contrastValue.textContent = `${result.contrast.toFixed(1)}:1 contrast with white`;
  cardResults.set(result.card.id, result);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = new URL(src, document.baseURI).href;
  });
}

function sampleImage(image, sampleDepth) {
  const width = 80;
  const height = 118;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);

  const startY = Math.floor(height * (1 - clamp(sampleDepth, 0.28, 0.7)));
  const pixels = context.getImageData(0, startY, width, height - startY).data;
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

function deriveLegibleTone(sampledRgb, saturationMultiplier, targetContrast) {
  const [hue, sampledSaturation, sampledLightness] = rgbToHsl(sampledRgb);
  const saturation = clamp(sampledSaturation * saturationMultiplier, 0.18, 0.78);
  let lightness = clamp(sampledLightness * 0.68, 0.08, 0.32);
  let rgb = hslToRgb([hue, saturation, lightness]);
  let contrast = contrastRatio([255, 255, 255], rgb);

  while (contrast < targetContrast && lightness > 0.025) {
    lightness -= 0.005;
    rgb = hslToRgb([hue, saturation, lightness]);
    contrast = contrastRatio([255, 255, 255], rgb);
  }

  return { rgb, hex: rgbToHex(rgb), contrast };
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
    const payload = await response.json();
    return payload.state;
  } catch {
    setPanelStatus("Using fallback values; config.json could not be loaded.");
    return fallbackState;
  }
}

async function saveCurrentState() {
  const payload = buildConfigPayload();
  try {
    const response = await fetch(SAVE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.saved) throw new Error(result.message || "Save failed.");
    authoredState = { ...state };
    if (configOutput) configOutput.value = JSON.stringify(payload, null, 2);
    setPanelStatus("Saved to config.json.");
  } catch {
    if (configOutput) {
      configOutput.value = JSON.stringify(payload, null, 2);
      configOutput.focus();
      configOutput.select();
    }
    setPanelStatus("Save needs the local npm run dev server; config selected instead.");
  }
}

function buildConfigPayload() {
  return {
    schema: CONFIG_SCHEMA,
    surface: SURFACE_NAME,
    state: normalizeState(state),
  };
}

function normalizeState(candidate = {}) {
  const next = { ...fallbackState };
  controls.forEach((control) => {
    const value = Number(candidate[control.key]);
    if (Number.isFinite(value)) next[control.key] = clamp(value, control.min, control.max);
  });
  return next;
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
    ".prototype {",
    `  --card-gradient-height: ${state.gradientHeight}%;`,
    `  --card-gradient-blur: ${state.gradientBlur}px;`,
    "}",
  ];

  cardResults.forEach((result, cardId) => {
    lines.push("", `.card-md[data-card-id=\"${cardId}\"] {`, `  --card-tone: ${result.hex};`, `  --card-tone-rgb: ${result.rgb.join(" ")};`, "}");
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
