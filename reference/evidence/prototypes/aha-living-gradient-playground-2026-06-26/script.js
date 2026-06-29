const STORAGE_KEY = "aha-living-gradient-playground:v30";
const LEGACY_STORAGE_KEYS = ["aha-living-gradient-playground:v29", "aha-living-gradient-playground:v28", "aha-living-gradient-playground:v27", "aha-living-gradient-playground:v26"];
const CONFIG_SCHEMA = "aha-living-gradient-playground/v30";

const prototype = document.querySelector(".prototype");
const gradients = Array.from(document.querySelectorAll(".living-gradient"));
const controlsRoot = document.querySelector("[data-control-root]");
const cssOutput = document.querySelector("[data-css-output]");
const saveConfigButton = document.querySelector("[data-save-config]");
const copyCssButton = document.querySelector("[data-copy-css]");
const copyConfigButton = document.querySelector("[data-copy-config]");
const exportMp4Button = document.querySelector("[data-export-mp4]");
const exportLogoMp4Button = document.querySelector("[data-export-logo-mp4]");
const resetButton = document.querySelector("[data-reset-config]");
const copyStatus = document.querySelector("[data-copy-status]");
const modeReadout = document.querySelector("[data-mode-readout]");

const EXPORT_WIDTH = 1920;
const EXPORT_HEIGHT = 1080;
const EXPORT_FPS = 30;
const LOGO_MASK_URL = "assets/aha-logo-mask-large.svg";
const LOGO_MASK_ASPECT = 124 / 149;
const MP4_MIME_TYPES = [
  "video/mp4;codecs=avc1.42E01E",
  "video/mp4;codecs=avc1",
  "video/mp4;codecs=h264",
  "video/mp4",
];

const presets = [
  {
    id: "A",
    label: "A",
    name: "Calm Vertical",
    summary: "A centered slow flame with restrained light and steady shadow.",
    values: {
      duration: 16,
      evolutionSpeed: 1.35,
      flameScale: 1.08,
      flameRotation: 0,
      flameX: 0.55,
      flameY: 0.5,
      flameWidth: 0.58,
      flameHeight: 1.14,
      flameStrength: 1.16,
      taperPower: 1.28,
      edgeSoftness: 0.32,
      warmLight: 1.24,
      warmSpread: 0.92,
      deepPressure: 1.14,
      turbulence: 0.9,
      noiseScale: 1,
      rise: 0.68,
      sway: 0.96,
      colorIntensity: 1.1,
      shaderBlur: 0,
    },
  },
  {
    id: "B",
    label: "B",
    name: "Upper Light",
    summary: "More orange energy gathers near the top-right without washing the red.",
    values: {
      duration: 14,
      evolutionSpeed: 1.5,
      flameScale: 1.12,
      flameRotation: -4,
      flameX: 0.63,
      flameY: 0.48,
      flameWidth: 0.66,
      flameHeight: 1.05,
      flameStrength: 1.24,
      taperPower: 1.18,
      edgeSoftness: 0.3,
      warmLight: 1.3,
      warmSpread: 1.08,
      deepPressure: 1,
      turbulence: 1.02,
      noiseScale: 1.08,
      rise: 0.78,
      sway: 1.36,
      colorIntensity: 1.12,
      shaderBlur: 0,
    },
  },
  {
    id: "C",
    label: "C",
    name: "Shadow Breath",
    summary: "Deep red carries more weight while orange stays narrow and alive.",
    values: {
      duration: 18,
      evolutionSpeed: 1.25,
      flameScale: 1.1,
      flameRotation: 3,
      flameX: 0.52,
      flameY: 0.54,
      flameWidth: 0.6,
      flameHeight: 1.18,
      flameStrength: 1.18,
      taperPower: 1.38,
      edgeSoftness: 0.28,
      warmLight: 1.08,
      warmSpread: 0.78,
      deepPressure: 1.36,
      turbulence: 1.12,
      noiseScale: 1.16,
      rise: 0.58,
      sway: 0.88,
      colorIntensity: 1.12,
      shaderBlur: 0,
    },
  },
  {
    id: "D",
    label: "D",
    name: "Wide Field",
    summary: "A broader flame field for large backgrounds and cropped surfaces.",
    values: {
      duration: 16,
      evolutionSpeed: 1.4,
      flameScale: 1.24,
      flameRotation: -8,
      flameX: 0.6,
      flameY: 0.5,
      flameWidth: 0.86,
      flameHeight: 1.02,
      flameStrength: 1.14,
      taperPower: 1.05,
      edgeSoftness: 0.38,
      warmLight: 1.18,
      warmSpread: 0.96,
      deepPressure: 1.12,
      turbulence: 0.82,
      noiseScale: 0.9,
      rise: 0.64,
      sway: 1.12,
      colorIntensity: 1.1,
      shaderBlur: 0,
    },
  },
];

const presetById = new Map(presets.map((preset) => [preset.id, preset]));

const controlGroups = [
  {
    id: "flame-shape",
    title: "Flame Shape",
    open: true,
    keys: ["flameScale", "flameRotation", "flameX", "flameY", "flameWidth", "flameHeight", "flameStrength", "taperPower"],
  },
  {
    id: "texture",
    title: "Motion & Texture",
    open: true,
    keys: ["duration", "evolutionSpeed", "rise", "sway", "turbulence", "noiseScale", "edgeSoftness"],
  },
  {
    id: "colour",
    title: "Colour",
    open: true,
    keys: ["warmLight", "warmSpread", "deepPressure", "colorIntensity", "shaderBlur"],
  },
  {
    id: "logo-mapping",
    title: "Logo Mapping",
    open: true,
    keys: ["logoShaderScale", "logoShaderX", "logoShaderY", "logoShaderRotation", "logoExportScale"],
  },
  {
    id: "surfaces",
    title: "Surfaces",
    open: false,
    keys: ["surfaces.all", "surfaces.logo", "surfaces.button", "surfaces.card", "surfaces.background"],
  },
  {
    id: "accessibility",
    title: "Motion & Contrast",
    open: false,
    keys: ["reducedMotion", "contrastSafe", "paused"],
  },
];

const controlDefinitions = {
  duration: { key: "duration", label: "Cycle", type: "range", min: 6, max: 36, step: 1, default: 16, unit: "s" },
  evolutionSpeed: { key: "evolutionSpeed", label: "Evolution speed", type: "range", min: 0.4, max: 4, step: 0.01, default: 1.35, unit: "x" },
  flameScale: { key: "flameScale", label: "Overall scale", type: "range", min: 0.25, max: 5, step: 0.01, default: 1.08 },
  flameRotation: { key: "flameRotation", label: "Rotation", type: "range", min: -180, max: 180, step: 1, default: 0, unit: "deg" },
  flameX: { key: "flameX", label: "Horizontal position", type: "range", min: -1, max: 2, step: 0.01, default: 0.55 },
  flameY: { key: "flameY", label: "Vertical position", type: "range", min: -1, max: 2, step: 0.01, default: 0.5 },
  flameWidth: { key: "flameWidth", label: "Plume width", type: "range", min: 0.08, max: 5, step: 0.01, default: 0.58 },
  flameHeight: { key: "flameHeight", label: "Plume height", type: "range", min: 0.16, max: 5, step: 0.01, default: 1.14 },
  flameStrength: { key: "flameStrength", label: "Red plume strength", type: "range", min: 0.35, max: 1.65, step: 0.01, default: 1.16 },
  taperPower: { key: "taperPower", label: "Taper", type: "range", min: 0.45, max: 2.6, step: 0.01, default: 1.28 },
  warmLight: { key: "warmLight", label: "Orange plume strength", type: "range", min: 0, max: 1.65, step: 0.01, default: 1.24 },
  warmSpread: { key: "warmSpread", label: "Orange plume size", type: "range", min: 0, max: 1.6, step: 0.01, default: 0.92 },
  deepPressure: { key: "deepPressure", label: "Background depth", type: "range", min: 0.35, max: 1.65, step: 0.01, default: 1.14 },
  turbulence: { key: "turbulence", label: "Organic edge", type: "range", min: 0, max: 1.8, step: 0.01, default: 0.9 },
  edgeSoftness: { key: "edgeSoftness", label: "Edge softness", type: "range", min: 0.04, max: 0.9, step: 0.01, default: 0.32 },
  noiseScale: { key: "noiseScale", label: "Noise scale", type: "range", min: 0.45, max: 2.8, step: 0.01, default: 1 },
  rise: { key: "rise", label: "Rising pull", type: "range", min: 0, max: 1.4, step: 0.01, default: 0.68 },
  sway: { key: "sway", label: "Side sway", type: "range", min: 0, max: 4, step: 0.01, default: 0.96 },
  colorIntensity: { key: "colorIntensity", label: "Colour intensity", type: "range", min: 0.75, max: 1.25, step: 0.01, default: 1.1 },
  shaderBlur: { key: "shaderBlur", label: "Shader blur", type: "range", min: 0, max: 180, step: 1, default: 0, unit: "px" },
  logoShaderScale: { key: "logoShaderScale", label: "Logo animation scale", type: "range", min: 0.05, max: 5, step: 0.01, default: 1 },
  logoShaderX: { key: "logoShaderX", label: "Logo animation X", type: "range", min: -1, max: 1, step: 0.01, default: 0 },
  logoShaderY: { key: "logoShaderY", label: "Logo animation Y", type: "range", min: -1, max: 1, step: 0.01, default: 0 },
  logoShaderRotation: { key: "logoShaderRotation", label: "Logo rotation offset", type: "range", min: -180, max: 180, step: 1, default: 0, unit: "deg" },
  logoExportScale: { key: "logoExportScale", label: "Logo export size", type: "range", min: 0.25, max: 0.95, step: 0.01, default: 0.74 },
  "surfaces.all": { key: "surfaces.all", label: "All surfaces", type: "checkbox", default: true },
  "surfaces.logo": { key: "surfaces.logo", label: "Logo", type: "checkbox", default: true },
  "surfaces.button": { key: "surfaces.button", label: "Button", type: "checkbox", default: true },
  "surfaces.card": { key: "surfaces.card", label: "Card", type: "checkbox", default: true },
  "surfaces.background": { key: "surfaces.background", label: "Background", type: "checkbox", default: true },
  reducedMotion: { key: "reducedMotion", label: "Reduced motion", type: "checkbox", default: false },
  contrastSafe: { key: "contrastSafe", label: "Contrast safe", type: "checkbox", default: false },
  paused: { key: "paused", label: "Paused", type: "checkbox", default: false },
};

const controls = Object.values(controlDefinitions);
const controlByKey = new Map(controls.map((control) => [control.key, control]));
const defaultState = createDefaultState();

let state = normalizeState(loadSavedState());
let isRendering = false;
let savedStateSnapshot = serializeState(state);

const shaderRuntime = {
  items: new Map(),
  raf: 0,
  origin: performance.now(),
  webglAvailable: null,
};

const formatters = {
  duration: (value) => `${Math.round(value)}s`,
  evolutionSpeed: (value) => `${value.toFixed(2)}x`,
  flameScale: (value) => value.toFixed(2),
  flameRotation: (value) => `${Math.round(value)}deg`,
  flameX: (value) => `${Math.round(value * 100)}%`,
  flameY: (value) => `${Math.round(value * 100)}%`,
  flameWidth: (value) => value.toFixed(2),
  flameHeight: (value) => value.toFixed(2),
  flameStrength: (value) => value.toFixed(2),
  taperPower: (value) => value.toFixed(2),
  warmLight: (value) => value.toFixed(2),
  warmSpread: (value) => value.toFixed(2),
  deepPressure: (value) => value.toFixed(2),
  turbulence: (value) => value.toFixed(2),
  edgeSoftness: (value) => value.toFixed(2),
  noiseScale: (value) => value.toFixed(2),
  rise: (value) => value.toFixed(2),
  sway: (value) => value.toFixed(2),
  colorIntensity: (value) => value.toFixed(2),
  shaderBlur: (value) => `${Math.round(value)}px`,
  logoShaderScale: (value) => value.toFixed(2),
  logoShaderX: (value) => `${Math.round(value * 100)}%`,
  logoShaderY: (value) => `${Math.round(value * 100)}%`,
  logoShaderRotation: (value) => `${Math.round(value)}deg`,
  logoExportScale: (value) => `${Math.round(value * 100)}%`,
};

function createDefaultState() {
  return {
    preset: "A",
    ...structuredClone(presetById.get("A").values),
    logoShaderScale: controlDefinitions.logoShaderScale.default,
    logoShaderX: controlDefinitions.logoShaderX.default,
    logoShaderY: controlDefinitions.logoShaderY.default,
    logoShaderRotation: controlDefinitions.logoShaderRotation.default,
    logoExportScale: controlDefinitions.logoExportScale.default,
    surfaces: {
      all: true,
      logo: true,
      button: true,
      card: true,
      background: true,
    },
    reducedMotion: false,
    contrastSafe: false,
    paused: false,
  };
}

function renderPanel() {
  controlsRoot.innerHTML = `${renderExplanation()}${renderPresetOverview()}${controlGroups.map((group) => {
    const rows = group.keys.map((key) => controlDefinitions[key]).filter(Boolean).map(renderControl).join("");
    return `<details class="parameterizer-folder" ${group.open ? "open" : ""}>
      <summary class="parameterizer-folder-title">${group.title}</summary>
      <div class="parameterizer-folder-body">${rows}</div>
    </details>`;
  }).join("")}`;

  bindControls();
}

function renderExplanation() {
  return `<section class="shader-explainer" aria-label="Shader explanation">
    <div class="effect-overview-title">What this is showing</div>
    <p>This demo is now one flame shader. A-D are presets that move the same sliders into different compositions.</p>
    <p>The shader starts with a deep-red field, builds one responsive red plume from layered noise, then places a smaller orange plume inside it. No white or extra red is used inside the animated artwork.</p>
    <p>Logo Mapping remaps that same flame inside the logo mask only, so the logo can show shadow and orange together without changing the larger background, card, or button surfaces.</p>
  </section>`;
}

function renderPresetOverview() {
  const cards = presets.map((preset) => {
    const active = preset.id === state.preset;
    return `<button class="effect-card${active ? " is-active" : ""}" type="button" data-preset-card="${preset.id}" aria-pressed="${active}">
      <span class="effect-card-kicker">Preset ${preset.label}</span>
      <strong>${preset.name}</strong>
      <span class="effect-card-summary">${preset.summary}</span>
    </button>`;
  }).join("");

  return `<section class="effect-overview" aria-label="Flame presets">
    <div class="effect-overview-title">Presets</div>
    <div class="effect-card-grid">${cards}</div>
  </section>`;
}

function renderControl(control) {
  const id = `control-${control.key.replaceAll(".", "-")}`;
  const value = getStateValue(control.key);

  if (control.type === "checkbox") {
    return `<label class="parameterizer-row parameterizer-row-checkbox" for="${id}">
      <span class="parameterizer-label" title="${control.label}">${control.label}</span>
      <input class="parameterizer-control parameterizer-check" id="${id}" type="checkbox" data-control-key="${control.key}" ${value ? "checked" : ""}>
      <span class="parameterizer-value" data-value-for="${control.key}">${value ? "On" : "Off"}</span>
    </label>`;
  }

  return `<label class="parameterizer-row" for="${id}">
    <span class="parameterizer-label" title="${control.label}">${control.label}</span>
    <input class="parameterizer-control parameterizer-range" id="${id}" type="range" min="${control.min}" max="${control.max}" step="${control.step}" value="${value}" data-control-key="${control.key}">
    <output class="parameterizer-value" data-value-for="${control.key}">${formatValue(control.key, value)}</output>
  </label>`;
}

function bindControls() {
  controlsRoot.querySelectorAll("[data-preset-card]").forEach((card) => {
    card.addEventListener("click", (event) => {
      applyPreset(event.currentTarget.dataset.presetCard);
      markStateDirty();
      renderPanel();
      render();
    });
  });

  controlsRoot.querySelectorAll("[data-control-key]").forEach((control) => {
    const eventName = control.matches("input[type='checkbox']") ? "change" : "input";
    control.addEventListener(eventName, (event) => {
      const key = event.currentTarget.dataset.controlKey;
      const definition = controlByKey.get(key);
      let value = event.currentTarget.value;

      if (definition.type === "range") value = Number(value);
      if (definition.type === "checkbox") value = event.currentTarget.checked;

      setStateValue(key, value);
      if (!key.startsWith("surfaces.") && key !== "reducedMotion" && key !== "contrastSafe" && key !== "paused") {
        state.preset = getMatchingPresetId() ?? "Custom";
      }
      if (key === "surfaces.all") syncSurfaceDisabledState();

      markStateDirty();
      render();
    });
  });
}

function applyPreset(presetId) {
  const preset = presetById.get(presetId);
  if (!preset) return;
  state.preset = preset.id;
  Object.entries(preset.values).forEach(([key, value]) => {
    setStateValue(key, value);
  });
}

function getMatchingPresetId() {
  return presets.find((preset) => Object.entries(preset.values).every(([key, value]) => {
    return Math.abs(Number(getStateValue(key)) - Number(value)) < 0.001;
  }))?.id;
}

function getStateValue(key) {
  if (!key.includes(".")) return state[key];
  const [root, child] = key.split(".");
  return state[root]?.[child];
}

function setStateValue(key, value) {
  if (!key.includes(".")) {
    state[key] = value;
    return;
  }
  const [root, child] = key.split(".");
  if (!state[root]) state[root] = {};
  state[root][child] = value;
}

function setNestedValue(target, key, value) {
  if (!key.includes(".")) {
    target[key] = value;
    return;
  }
  const [root, child] = key.split(".");
  if (!target[root]) target[root] = {};
  target[root][child] = value;
}

function syncControlValues() {
  isRendering = true;

  controlsRoot.querySelectorAll("[data-control-key]").forEach((control) => {
    const key = control.dataset.controlKey;
    const value = getStateValue(key);
    if (control.type === "checkbox") {
      control.checked = Boolean(value);
    } else {
      control.value = value;
    }
  });

  controlsRoot.querySelectorAll("[data-value-for]").forEach((output) => {
    const key = output.dataset.valueFor;
    output.textContent = formatValue(key, getStateValue(key));
  });

  controlsRoot.querySelectorAll("[data-preset-card]").forEach((card) => {
    const isActive = card.dataset.presetCard === state.preset;
    card.classList.toggle("is-active", isActive);
    card.setAttribute("aria-pressed", String(isActive));
  });

  syncSurfaceDisabledState();
  isRendering = false;
}

function syncSurfaceDisabledState() {
  controlsRoot.querySelectorAll('[data-control-key^="surfaces."]:not([data-control-key="surfaces.all"])').forEach((toggle) => {
    toggle.disabled = !state.surfaces.all;
  });
}

function updateDerivedVariables() {
  prototype.style.setProperty("--lg-duration", `${state.duration.toFixed(2)}s`);
  prototype.style.setProperty("--lg-evolution-speed", state.evolutionSpeed.toFixed(2));
  prototype.style.setProperty("--lg-flame-scale", state.flameScale.toFixed(2));
  prototype.style.setProperty("--lg-flame-rotation", `${Math.round(state.flameRotation)}deg`);
  prototype.style.setProperty("--lg-flame-x", `${Math.round(state.flameX * 100)}%`);
  prototype.style.setProperty("--lg-flame-y", `${Math.round(state.flameY * 100)}%`);
  prototype.style.setProperty("--lg-flame-width", state.flameWidth.toFixed(2));
  prototype.style.setProperty("--lg-flame-height", state.flameHeight.toFixed(2));
  prototype.style.setProperty("--lg-flame-strength", state.flameStrength.toFixed(2));
  prototype.style.setProperty("--lg-taper-power", state.taperPower.toFixed(2));
  prototype.style.setProperty("--lg-warm-light", state.warmLight.toFixed(2));
  prototype.style.setProperty("--lg-warm-spread", state.warmSpread.toFixed(2));
  prototype.style.setProperty("--lg-deep-pressure", state.deepPressure.toFixed(2));
  prototype.style.setProperty("--lg-organic-edge", state.turbulence.toFixed(2));
  prototype.style.setProperty("--lg-edge-softness", state.edgeSoftness.toFixed(2));
  prototype.style.setProperty("--lg-noise-scale", state.noiseScale.toFixed(2));
  prototype.style.setProperty("--lg-rise", state.rise.toFixed(2));
  prototype.style.setProperty("--lg-sway", state.sway.toFixed(2));
  prototype.style.setProperty("--lg-color-intensity", state.colorIntensity.toFixed(2));
  prototype.style.setProperty("--lg-shader-blur", `${Math.round(state.shaderBlur)}px`);
  prototype.style.setProperty("--lg-logo-shader-scale", state.logoShaderScale.toFixed(2));
  prototype.style.setProperty("--lg-logo-shader-x", `${Math.round(state.logoShaderX * 100)}%`);
  prototype.style.setProperty("--lg-logo-shader-y", `${Math.round(state.logoShaderY * 100)}%`);
  prototype.style.setProperty("--lg-logo-shader-rotation", `${Math.round(state.logoShaderRotation)}deg`);
  prototype.style.setProperty("--lg-logo-export-scale", state.logoExportScale.toFixed(2));
}

function applyFlags() {
  prototype.dataset.preset = state.preset;
  modeReadout.textContent = state.preset === "Custom" ? "Custom" : `Preset ${state.preset}`;
  prototype.classList.toggle("is-reduced-motion", state.reducedMotion);
  prototype.classList.toggle("is-contrast-safe", state.contrastSafe);
  prototype.classList.toggle("is-paused", state.paused);
  gradients.forEach((surface) => {
    surface.dataset.mode = "flame";
  });
}

function applySurfaceToggles() {
  const globalEnabled = state.surfaces.all;
  gradients.forEach((surface) => {
    const surfaceName = surface.dataset.surface;
    const enabled = Boolean(globalEnabled && state.surfaces[surfaceName]);
    surface.classList.toggle("is-surface-off", !enabled);
  });
}

function canUseWebGL() {
  if (shaderRuntime.webglAvailable !== null) return shaderRuntime.webglAvailable;
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  shaderRuntime.webglAvailable = Boolean(gl);
  return shaderRuntime.webglAvailable;
}

function updateShaderRuntime() {
  const active = canUseWebGL() && !state.reducedMotion;
  const globalEnabled = state.surfaces.all;

  gradients.forEach((surface) => {
    const surfaceName = surface.dataset.surface;
    const enabled = active && globalEnabled && state.surfaces[surfaceName];
    surface.classList.toggle("has-shader", enabled);
    if (enabled) {
      ensureShaderSurface(surface);
    } else {
      destroyShaderSurface(surface);
    }
  });

  drawShadersOnce();
  syncShaderLoop();
}

function ensureShaderSurface(surface) {
  if (shaderRuntime.items.has(surface)) return;

  const canvas = document.createElement("canvas");
  canvas.className = "lg-shader-canvas";
  canvas.setAttribute("aria-hidden", "true");
  surface.insertAdjacentElement("afterbegin", canvas);

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: "low-power",
  });

  if (!gl) {
    canvas.remove();
    shaderRuntime.webglAvailable = false;
    return;
  }

  const program = createShaderProgram(gl);
  if (!program) {
    canvas.remove();
    shaderRuntime.webglAvailable = false;
    return;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
  ]), gl.STATIC_DRAW);

  shaderRuntime.items.set(surface, createShaderRenderer(gl, canvas, program, buffer));
}

function destroyShaderSurface(surface) {
  const item = shaderRuntime.items.get(surface);
  if (!item) return;
  item.canvas.remove();
  shaderRuntime.items.delete(surface);
}

const shaderFragmentSource = `
  precision mediump float;

  varying vec2 v_uv;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_cycle;
  uniform float u_speed;
  uniform float u_scale;
  uniform float u_rotation;
  uniform float u_flame_x;
  uniform float u_flame_y;
  uniform float u_flame_width;
  uniform float u_flame_height;
  uniform float u_flame_strength;
  uniform float u_taper_power;
  uniform float u_warm;
  uniform float u_warm_spread;
  uniform float u_deep;
  uniform float u_turbulence;
  uniform float u_edge_softness;
  uniform float u_noise_scale;
  uniform float u_rise;
  uniform float u_sway;
  uniform float u_energy;

  const vec3 AHA_ORANGE = vec3(0.941, 0.424, 0.137);
  const vec3 AHA_RED = vec3(0.886, 0.0, 0.118);
  const vec3 AHA_DEEP = vec3(0.322, 0.008, 0.031);

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.03;
      amplitude *= 0.52;
    }
    return value;
  }

  float breathSignal(float t) {
    float phase = fract(t * max(u_speed, 0.01) / max(u_cycle, 1.0));
    float inhale = smoothstep(0.1, 0.42, phase);
    float exhale = 1.0 - smoothstep(0.58, 0.94, phase);
    return inhale * exhale;
  }

  vec3 flame(vec2 uv, float t) {
    float aspect = 1.0;
    float breath = breathSignal(t);
    float riseTime = t * 0.22 * max(u_speed, 0.08) * max(u_rise, 0.02);
    vec2 center = vec2(u_flame_x, u_flame_y);
    vec2 p = uv - center;
    p.x *= aspect;
    float rotation = radians(u_rotation);
    float s = sin(rotation);
    float c = cos(rotation);
    p = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
    p /= max(u_scale, 0.01);

    float drift = (fbm(vec2(riseTime * 0.24, 0.37)) - 0.5) * 0.18 * u_sway;
    p.x -= drift;

    float vertical = clamp((p.y / max(u_flame_height, 0.01)) + 0.56, 0.0, 1.0);
    float activeHeight = smoothstep(0.02, 0.18, vertical) * (1.0 - smoothstep(0.97, 1.0, vertical));
    float taper = mix(max(u_flame_width, 0.01), max(u_flame_width, 0.01) * 0.13, pow(vertical, max(u_taper_power, 0.01)));
    float noiseScale = max(u_noise_scale, 0.01);
    float spineNoise = fbm(vec2(vertical * 1.8 * noiseScale - riseTime * 0.72, riseTime * 0.82));
    float spine = (spineNoise - 0.5) * taper * 0.7 * u_sway;
    float x = p.x - spine;
    float edge = abs(x) / max(taper, 0.001);
    float largeNoise = fbm(vec2(x * 2.0 * noiseScale + riseTime * 0.16, vertical * 2.35 * noiseScale - riseTime));
    float fineNoise = fbm(vec2(x * 4.6 * noiseScale + riseTime * 0.52, vertical * 4.4 * noiseScale - riseTime * 1.8));
    float organicEdge = edge - (largeNoise - 0.5) * 0.3 * u_turbulence - (fineNoise - 0.5) * 0.08 * u_turbulence;

    float redStart = clamp(0.56 - u_edge_softness * 0.2, 0.24, 0.86);
    float redEnd = clamp(redStart + 0.32 + u_edge_softness * 1.12, redStart + 0.08, 1.7);
    float redPlume = (1.0 - smoothstep(redStart, redEnd, organicEdge)) * activeHeight;
    redPlume *= u_flame_strength * mix(0.84, 1.08, breath);
    redPlume *= mix(1.08, 0.84, clamp((u_deep - 0.35) / 1.3, 0.0, 1.0));
    redPlume = clamp(redPlume, 0.0, 0.96);

    float orangeNoise = fbm(vec2(x * 2.8 * noiseScale + riseTime * 0.36, vertical * 3.2 * noiseScale - riseTime * 1.28));
    float orangeCenter = spine + taper * (0.18 + (orangeNoise - 0.5) * 0.36);
    float orangeWidth = max(taper * mix(0.16, 0.48, clamp(u_warm_spread / 1.6, 0.0, 1.0)), 0.006);
    float orangeEdge = abs(p.x - orangeCenter) / orangeWidth;
    float orangeBand = smoothstep(0.34, 0.82, vertical) * (1.0 - smoothstep(0.98, 1.0, vertical));
    float orangePlume = (1.0 - smoothstep(0.42, 1.18 + u_edge_softness * 0.42, orangeEdge - (orangeNoise - 0.5) * 0.2 * u_turbulence));
    orangePlume *= redPlume * orangeBand * u_warm * mix(0.78, 1.18, breath);
    orangePlume = clamp(orangePlume, 0.0, 0.92);

    float intensity = clamp(u_energy, 0.75, 1.25);
    vec3 color = AHA_DEEP;
    color = mix(color, AHA_RED, redPlume);
    color = mix(color, AHA_ORANGE, orangePlume);
    return mix(AHA_DEEP, color, clamp(0.78 + (intensity - 0.75) * 0.44, 0.78, 1.0));
  }

  void main() {
    gl_FragColor = vec4(flame(v_uv, u_time), 1.0);
  }
`;

function createShaderProgram(gl) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, `
    attribute vec2 a_position;
    varying vec2 v_uv;

    void main() {
      v_uv = a_position * 0.5 + 0.5;
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, shaderFragmentSource);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function drawShadersOnce(now = performance.now()) {
  shaderRuntime.items.forEach((item, surface) => drawShaderItem(item, surface, now));
}

function drawShaderItem(item, surface, now) {
  const rect = item.canvas.getBoundingClientRect();
  const renderScale = 1;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const width = Math.max(1, Math.round(rect.width * renderScale * dpr));
  const height = Math.max(1, Math.round(rect.height * renderScale * dpr));

  if (item.canvas.width !== width || item.canvas.height !== height) {
    item.canvas.width = width;
    item.canvas.height = height;
  }

  drawShaderRenderer(item, (now - shaderRuntime.origin) / 1000, width, height, getSurfaceShaderOverrides(surface));
}

function createShaderRenderer(gl, canvas, program, buffer) {
  return {
    canvas,
    gl,
    program,
    buffer,
    attribs: {
      position: gl.getAttribLocation(program, "a_position"),
    },
    uniforms: {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      cycle: gl.getUniformLocation(program, "u_cycle"),
      speed: gl.getUniformLocation(program, "u_speed"),
      scale: gl.getUniformLocation(program, "u_scale"),
      rotation: gl.getUniformLocation(program, "u_rotation"),
      flameX: gl.getUniformLocation(program, "u_flame_x"),
      flameY: gl.getUniformLocation(program, "u_flame_y"),
      flameWidth: gl.getUniformLocation(program, "u_flame_width"),
      flameHeight: gl.getUniformLocation(program, "u_flame_height"),
      flameStrength: gl.getUniformLocation(program, "u_flame_strength"),
      taperPower: gl.getUniformLocation(program, "u_taper_power"),
      warm: gl.getUniformLocation(program, "u_warm"),
      warmSpread: gl.getUniformLocation(program, "u_warm_spread"),
      deep: gl.getUniformLocation(program, "u_deep"),
      turbulence: gl.getUniformLocation(program, "u_turbulence"),
      edgeSoftness: gl.getUniformLocation(program, "u_edge_softness"),
      noiseScale: gl.getUniformLocation(program, "u_noise_scale"),
      rise: gl.getUniformLocation(program, "u_rise"),
      sway: gl.getUniformLocation(program, "u_sway"),
      energy: gl.getUniformLocation(program, "u_energy"),
    },
  };
}

function getSurfaceShaderOverrides(surface) {
  return surface.dataset.surface === "logo" ? getLogoShaderOverrides() : null;
}

function getLogoShaderOverrides() {
  return {
    scale: state.flameScale * state.logoShaderScale,
    flameX: state.flameX + state.logoShaderX,
    flameY: state.flameY + state.logoShaderY,
    rotation: state.flameRotation + state.logoShaderRotation,
  };
}

function getShaderParameters(overrides = null) {
  return {
    cycle: state.duration,
    speed: state.evolutionSpeed,
    scale: state.flameScale,
    rotation: state.flameRotation,
    flameX: state.flameX,
    flameY: state.flameY,
    flameWidth: state.flameWidth,
    flameHeight: state.flameHeight,
    flameStrength: state.flameStrength,
    warm: state.warmLight,
    deep: state.deepPressure,
    turbulence: state.turbulence,
    taperPower: state.taperPower,
    warmSpread: state.warmSpread,
    edgeSoftness: state.edgeSoftness,
    noiseScale: state.noiseScale,
    rise: state.rise,
    sway: state.sway,
    energy: state.colorIntensity,
    ...(overrides ?? {}),
  };
}

function drawShaderRenderer(item, shaderTime, width = item.canvas.width, height = item.canvas.height, overrides = null) {
  const params = getShaderParameters(overrides);
  const gl = item.gl;
  gl.viewport(0, 0, width, height);
  gl.useProgram(item.program);
  gl.bindBuffer(gl.ARRAY_BUFFER, item.buffer);
  gl.enableVertexAttribArray(item.attribs.position);
  gl.vertexAttribPointer(item.attribs.position, 2, gl.FLOAT, false, 0, 0);

  gl.uniform2f(item.uniforms.resolution, width, height);
  gl.uniform1f(item.uniforms.time, shaderTime);
  gl.uniform1f(item.uniforms.cycle, params.cycle);
  gl.uniform1f(item.uniforms.speed, params.speed);
  gl.uniform1f(item.uniforms.scale, params.scale);
  gl.uniform1f(item.uniforms.rotation, params.rotation);
  gl.uniform1f(item.uniforms.flameX, params.flameX);
  gl.uniform1f(item.uniforms.flameY, params.flameY);
  gl.uniform1f(item.uniforms.flameWidth, params.flameWidth);
  gl.uniform1f(item.uniforms.flameHeight, params.flameHeight);
  gl.uniform1f(item.uniforms.flameStrength, params.flameStrength);
  gl.uniform1f(item.uniforms.warm, params.warm);
  gl.uniform1f(item.uniforms.deep, params.deep);
  gl.uniform1f(item.uniforms.turbulence, params.turbulence);
  gl.uniform1f(item.uniforms.taperPower, params.taperPower);
  gl.uniform1f(item.uniforms.warmSpread, params.warmSpread);
  gl.uniform1f(item.uniforms.edgeSoftness, params.edgeSoftness);
  gl.uniform1f(item.uniforms.noiseScale, params.noiseScale);
  gl.uniform1f(item.uniforms.rise, params.rise);
  gl.uniform1f(item.uniforms.sway, params.sway);
  gl.uniform1f(item.uniforms.energy, params.energy);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function syncShaderLoop() {
  const shouldRun = shaderRuntime.items.size > 0 && !state.paused && !state.reducedMotion && !document.hidden;
  if (!shouldRun) {
    if (shaderRuntime.raf) cancelAnimationFrame(shaderRuntime.raf);
    shaderRuntime.raf = 0;
    return;
  }
  if (shaderRuntime.raf) return;

  const tick = (now) => {
    shaderRuntime.raf = 0;
    drawShadersOnce(now);
    syncShaderLoop();
  };
  shaderRuntime.raf = requestAnimationFrame(tick);
}

function buildCssExport() {
  return `/* Flame shader requires this prototype's WebGL renderer. */
.living-gradient[data-mode="flame"] {
${flameCustomProperties().map(([name, value]) => `  ${name}: ${value};`).join("\n")}
}

.living-gradient[data-mode="flame"][data-surface="logo"] {
${logoCustomProperties().map(([name, value]) => `  ${name}: ${value};`).join("\n")}
}`;
}

function flameCustomProperties() {
  return [
    ["--lg-duration", `${state.duration.toFixed(2)}s`],
    ["--lg-evolution-speed", state.evolutionSpeed.toFixed(2)],
    ["--lg-flame-scale", state.flameScale.toFixed(2)],
    ["--lg-flame-rotation", `${Math.round(state.flameRotation)}deg`],
    ["--lg-flame-x", `${Math.round(state.flameX * 100)}%`],
    ["--lg-flame-y", `${Math.round(state.flameY * 100)}%`],
    ["--lg-flame-width", state.flameWidth.toFixed(2)],
    ["--lg-flame-height", state.flameHeight.toFixed(2)],
    ["--lg-flame-strength", state.flameStrength.toFixed(2)],
    ["--lg-taper-power", state.taperPower.toFixed(2)],
    ["--lg-warm-light", state.warmLight.toFixed(2)],
    ["--lg-warm-spread", state.warmSpread.toFixed(2)],
    ["--lg-deep-pressure", state.deepPressure.toFixed(2)],
    ["--lg-organic-edge", state.turbulence.toFixed(2)],
    ["--lg-edge-softness", state.edgeSoftness.toFixed(2)],
    ["--lg-noise-scale", state.noiseScale.toFixed(2)],
    ["--lg-rise", state.rise.toFixed(2)],
    ["--lg-sway", state.sway.toFixed(2)],
    ["--lg-color-intensity", state.colorIntensity.toFixed(2)],
    ["--lg-shader-blur", `${Math.round(state.shaderBlur)}px`],
  ];
}

function logoCustomProperties() {
  return [
    ["--lg-logo-shader-scale", state.logoShaderScale.toFixed(2)],
    ["--lg-logo-shader-x", `${Math.round(state.logoShaderX * 100)}%`],
    ["--lg-logo-shader-y", `${Math.round(state.logoShaderY * 100)}%`],
    ["--lg-logo-shader-rotation", `${Math.round(state.logoShaderRotation)}deg`],
    ["--lg-logo-export-scale", state.logoExportScale.toFixed(2)],
  ];
}

function buildConfigExport() {
  return JSON.stringify({
    schema: CONFIG_SCHEMA,
    updated: "2026-06-29",
    visualMode: "flame",
    preset: state.preset,
    state,
  }, null, 2);
}

function render() {
  if (isRendering) return;
  state = normalizeState(state);
  updateDerivedVariables();
  applyFlags();
  applySurfaceToggles();
  updateShaderRuntime();
  syncControlValues();
  cssOutput.value = buildCssExport();
}

async function copyText(text, successMessage) {
  copyStatus.textContent = "Copying...";
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = successMessage;
  } catch {
    cssOutput.value = text;
    cssOutput.focus();
    cssOutput.select();
    const copied = document.execCommand("copy");
    copyStatus.textContent = copied ? successMessage : "Select the export field to copy manually.";
  }
}

function getSupportedMp4MimeType() {
  if (!window.MediaRecorder) return "";
  return MP4_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

function getExportPlan(target = "background") {
  const seconds = clamp(state.duration / Math.max(state.evolutionSpeed, 0.1), 8, 80);
  const roundedSeconds = Number(seconds.toFixed(2));
  return {
    target,
    mode: "flame",
    label: exportPlanLabel(target),
    seconds: roundedSeconds,
    frames: Math.ceil(roundedSeconds * EXPORT_FPS),
    fps: EXPORT_FPS,
    width: EXPORT_WIDTH,
    height: EXPORT_HEIGHT,
    mimeType: getSupportedMp4MimeType(),
    startTime: (performance.now() - shaderRuntime.origin) / 1000,
  };
}

function exportPlanLabel(target) {
  const presetLabel = state.preset === "Custom" ? "Custom Flame" : `Preset ${state.preset} Flame`;
  return target === "logo" ? `${presetLabel} Logo` : `${presetLabel} Background`;
}

async function exportCurrentGradientMp4(target = "background") {
  const plan = getExportPlan(target);
  if (!plan.mimeType || !HTMLCanvasElement.prototype.captureStream) {
    copyStatus.textContent = "MP4 export is not available in this browser. Use a browser with canvas capture and MP4 MediaRecorder support.";
    return;
  }

  let renderer;
  try {
    renderer = target === "logo"
      ? await createLogoExportShaderRenderer(plan.width, plan.height)
      : createExportShaderRenderer(plan.width, plan.height);
  } catch (error) {
    copyStatus.textContent = error.message || "MP4 export could not start.";
    return;
  }
  if (!renderer) {
    copyStatus.textContent = "MP4 export could not start because the WebGL export renderer is unavailable.";
    return;
  }

  const stream = renderer.canvas.captureStream(plan.fps);
  const chunks = [];
  const recorder = new MediaRecorder(stream, {
    mimeType: plan.mimeType,
    videoBitsPerSecond: 10_000_000,
  });

  setExportButtonsDisabled(true);
  copyStatus.textContent = `Exporting ${plan.label} MP4 loop (${plan.seconds}s)...`;

  recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });

  const finished = new Promise((resolve, reject) => {
    recorder.addEventListener("stop", resolve, { once: true });
    recorder.addEventListener("error", () => reject(new Error("MediaRecorder failed during MP4 export.")), { once: true });
  });

  try {
    recorder.start(250);
    await renderExportFrames(renderer, plan);
    recorder.stop();
    await finished;
    const blob = new Blob(chunks, { type: plan.mimeType });
    const filename = target === "logo"
      ? `aha-living-gradient-logo-${plan.seconds.toFixed(2)}s-loop.mp4`
      : `aha-living-gradient-background-${plan.seconds.toFixed(2)}s-loop.mp4`;
    downloadBlob(blob, filename);
    copyStatus.textContent = `Exported ${filename}.`;
  } catch (error) {
    if (recorder.state !== "inactive") recorder.stop();
    copyStatus.textContent = error.message || "MP4 export failed.";
  } finally {
    stream.getTracks().forEach((track) => track.stop());
    cleanupExportShaderRenderer(renderer);
    setExportButtonsDisabled(false);
  }
}

function setExportButtonsDisabled(disabled) {
  exportMp4Button.disabled = disabled;
  if (exportLogoMp4Button) exportLogoMp4Button.disabled = disabled;
}

function renderExportFrames(renderer, plan) {
  const start = performance.now();
  let lastFrame = -1;
  return new Promise((resolve) => {
    const tick = (now) => {
      const elapsed = (now - start) / 1000;
      const frame = Math.min(Math.floor(elapsed * plan.fps), plan.frames - 1);
      if (frame !== lastFrame) {
        drawExportFrame(renderer, frame / plan.fps, plan);
        lastFrame = frame;
      }
      if (elapsed < plan.seconds) {
        requestAnimationFrame(tick);
        return;
      }
      drawExportFrame(renderer, 0, plan);
      resolve();
    };
    drawExportFrame(renderer, 0, plan);
    requestAnimationFrame(tick);
  });
}

function drawExportFrame(renderer, elapsed, plan) {
  drawShaderRenderer(
    renderer.shader,
    plan.startTime + elapsed,
    renderer.sourceCanvas.width,
    renderer.sourceCanvas.height,
    renderer.shaderOverrides,
  );
  if (renderer.type === "logo") {
    drawLogoExportFrame(renderer, plan);
    return;
  }
  drawBackgroundExportFrame(renderer, plan);
}

function drawBackgroundExportFrame(renderer, plan) {
  renderer.context.clearRect(0, 0, plan.width, plan.height);
  renderer.context.filter = renderer.blur > 0 ? `blur(${renderer.blur}px)` : "none";
  renderer.context.drawImage(renderer.sourceCanvas, -renderer.pad, -renderer.pad);
  renderer.context.filter = "none";
}

function drawLogoExportFrame(renderer, plan) {
  renderer.context.fillStyle = "#ffffff";
  renderer.context.fillRect(0, 0, plan.width, plan.height);

  renderer.logoContext.clearRect(0, 0, renderer.logoRect.width, renderer.logoRect.height);
  renderer.logoContext.filter = renderer.blur > 0 ? `blur(${renderer.blur}px)` : "none";
  renderer.logoContext.drawImage(renderer.sourceCanvas, -renderer.pad, -renderer.pad);
  renderer.logoContext.filter = "none";
  renderer.logoContext.globalCompositeOperation = "destination-in";
  renderer.logoContext.drawImage(renderer.maskImage, 0, 0, renderer.logoRect.width, renderer.logoRect.height);
  renderer.logoContext.globalCompositeOperation = "source-over";

  renderer.context.drawImage(renderer.logoCanvas, renderer.logoRect.x, renderer.logoRect.y);
}

function createExportShaderRenderer(width, height) {
  const blur = Math.max(0, Math.round(state.shaderBlur));
  const pad = blur * 2;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return null;

  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = width + pad * 2;
  sourceCanvas.height = height + pad * 2;
  const gl = sourceCanvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });
  if (!gl) return null;

  const program = createShaderProgram(gl);
  if (!program) return null;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
  ]), gl.STATIC_DRAW);

  return {
    type: "background",
    canvas,
    context,
    sourceCanvas,
    pad,
    blur,
    shaderOverrides: null,
    shader: createShaderRenderer(gl, sourceCanvas, program, buffer),
  };
}

async function createLogoExportShaderRenderer(width, height) {
  const maskImage = await loadImage(LOGO_MASK_URL);
  const blur = Math.max(0, Math.round(state.shaderBlur));
  const pad = blur * 2;
  const logoRect = getLogoExportRect(width, height);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return null;

  const logoCanvas = document.createElement("canvas");
  logoCanvas.width = logoRect.width;
  logoCanvas.height = logoRect.height;
  const logoContext = logoCanvas.getContext("2d");
  if (!logoContext) return null;

  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = logoRect.width + pad * 2;
  sourceCanvas.height = logoRect.height + pad * 2;
  const gl = sourceCanvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });
  if (!gl) return null;

  const program = createShaderProgram(gl);
  if (!program) return null;

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    -1, 1,
    1, -1,
    1, 1,
  ]), gl.STATIC_DRAW);

  return {
    type: "logo",
    canvas,
    context,
    sourceCanvas,
    logoCanvas,
    logoContext,
    logoRect,
    maskImage,
    pad,
    blur,
    shaderOverrides: getLogoShaderOverrides(),
    shader: createShaderRenderer(gl, sourceCanvas, program, buffer),
  };
}

function getLogoExportRect(width, height) {
  const logoHeight = Math.round(height * state.logoExportScale);
  const logoWidth = Math.round(logoHeight * LOGO_MASK_ASPECT);
  return {
    width: logoWidth,
    height: logoHeight,
    x: Math.round((width - logoWidth) / 2),
    y: Math.round((height - logoHeight) / 2),
  };
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener("error", () => reject(new Error(`Could not load ${src}.`)), { once: true });
    image.src = src;
  });
}

function cleanupExportShaderRenderer(renderer) {
  const { gl, buffer, program } = renderer.shader;
  gl.deleteBuffer(buffer);
  gl.deleteProgram(program);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function loadSavedState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      const legacySaved = window.localStorage.getItem(legacyKey);
      if (legacySaved) return migrateLegacyState(JSON.parse(legacySaved));
    }
    return defaultState;
  } catch {
    return defaultState;
  }
}

function migrateLegacyState(candidate) {
  const next = { ...candidate };
  delete next.logoShaderScale;
  delete next.logoShaderX;
  delete next.logoShaderY;
  delete next.logoShaderRotation;
  if (typeof next.sway === "number") next.sway = clamp(next.sway * 4, 0, controlDefinitions.sway.max);
  return next;
}

function serializeState(value) {
  return JSON.stringify(normalizeState(value));
}

function markStateDirty() {
  copyStatus.textContent = serializeState(state) === savedStateSnapshot
    ? "Current settings match the saved version."
    : "Unsaved changes. Click Save Settings to keep them after reload.";
}

function saveCurrentState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    savedStateSnapshot = serializeState(state);
    copyStatus.textContent = "Saved settings. They will load automatically next time.";
  } catch {
    copyStatus.textContent = "Settings changed, but browser storage is unavailable.";
  }
}

function normalizeState(candidate) {
  const next = structuredClone(defaultState);
  const preset = presetById.has(candidate?.preset) ? candidate.preset : "A";
  next.preset = candidate?.preset === "Custom" ? "Custom" : preset;

  controls.forEach((control) => {
    const value = readCandidateValue(candidate, control.key);
    if (value === undefined) return;
    if (control.type === "range") {
      setNestedValue(next, control.key, clamp(Number(value), control.min, control.max));
      return;
    }
    if (control.type === "checkbox") {
      setNestedValue(next, control.key, Boolean(value));
    }
  });

  return next;
}

function readCandidateValue(candidate, key) {
  if (!candidate) return undefined;
  if (!key.includes(".")) return candidate[key];
  const [root, child] = key.split(".");
  return candidate[root]?.[child];
}

function resetConfig() {
  state = structuredClone(defaultState);
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    LEGACY_STORAGE_KEYS.forEach((legacyKey) => window.localStorage.removeItem(legacyKey));
  } catch {
    // Storage removal is a convenience; the in-memory reset still applies.
  }
  savedStateSnapshot = serializeState(state);
  copyStatus.textContent = "Reset to authored defaults.";
  renderPanel();
  render();
}

function initReducedMotion() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (prefersReducedMotion.matches) state.reducedMotion = true;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatValue(key, value) {
  return formatters[key] ? formatters[key](Number(value)) : String(value);
}

saveConfigButton.addEventListener("click", saveCurrentState);
copyCssButton.addEventListener("click", () => copyText(buildCssExport(), "Copied current CSS custom properties."));
copyConfigButton.addEventListener("click", () => copyText(buildConfigExport(), "Copied current parameter config."));
exportMp4Button.addEventListener("click", () => exportCurrentGradientMp4("background"));
if (exportLogoMp4Button) exportLogoMp4Button.addEventListener("click", () => exportCurrentGradientMp4("logo"));
resetButton.addEventListener("click", resetConfig);

document.addEventListener("visibilitychange", syncShaderLoop);
window.addEventListener("resize", () => drawShadersOnce());

initReducedMotion();
renderPanel();
render();
