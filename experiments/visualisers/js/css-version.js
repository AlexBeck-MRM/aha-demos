const DEFAULT_STATE = {
  timeScale: 0.72,
  flowSpeed: 0.56,
  warp: 0.32,
  turbulence: 0.46,
  blurSoftness: 1.58,
  moodBlend: 0.92,
  oxygenGlow: 1.24,
  vibrance: 1.62,
  saturation: 1.34,
  contrast: 1.0,
  brightness: 1.36
};

const PARAM_RANGES = {
  timeScale: { min: 0.2, max: 2.4, step: 0.01, label: "Flow Tempo" },
  flowSpeed: { min: 0.05, max: 2.2, step: 0.01, label: "Flow" },
  warp: { min: 0.0, max: 2.0, step: 0.01, label: "Warp" },
  turbulence: { min: 0.0, max: 2.4, step: 0.01, label: "Turbulence" },
  blurSoftness: { min: 0.2, max: 3.4, step: 0.01, label: "Blur" },
  moodBlend: { min: 0.0, max: 1.0, step: 0.01, label: "Mood Blend" },
  oxygenGlow: { min: 0.0, max: 2.6, step: 0.01, label: "Oxygen Glow" },
  vibrance: { min: 0.4, max: 3.2, step: 0.01, label: "Vibrance" },
  saturation: { min: 0.4, max: 2.8, step: 0.01, label: "Saturation" },
  contrast: { min: 0.4, max: 2.2, step: 0.01, label: "Contrast" },
  brightness: { min: 0.5, max: 2.4, step: 0.01, label: "Brightness" }
};

const CONTROL_GROUPS = [
  {
    title: "Flow Field",
    keys: ["timeScale", "flowSpeed", "warp", "turbulence", "blurSoftness"]
  },
  {
    title: "Color Response",
    keys: ["moodBlend", "oxygenGlow", "vibrance", "saturation", "contrast", "brightness"]
  }
];

const PRESETS = {
  arterial: {
    timeScale: 0.78,
    flowSpeed: 0.72,
    warp: 0.46,
    turbulence: 0.56,
    blurSoftness: 1.4,
    moodBlend: 0.98,
    oxygenGlow: 1.52,
    vibrance: 1.94,
    saturation: 1.48,
    contrast: 1.01,
    brightness: 1.46
  },
  calm: {
    timeScale: 0.6,
    flowSpeed: 0.44,
    warp: 0.2,
    turbulence: 0.24,
    blurSoftness: 1.9,
    moodBlend: 0.82,
    oxygenGlow: 0.9,
    vibrance: 1.34,
    saturation: 1.18,
    contrast: 0.94,
    brightness: 1.2
  },
  deep: {
    timeScale: 0.66,
    flowSpeed: 0.48,
    warp: 0.28,
    turbulence: 0.32,
    blurSoftness: 1.72,
    moodBlend: 0.64,
    oxygenGlow: 0.72,
    vibrance: 1.38,
    saturation: 1.18,
    contrast: 0.97,
    brightness: 1.16
  },
  bloom: {
    timeScale: 0.84,
    flowSpeed: 0.82,
    warp: 0.58,
    turbulence: 0.74,
    blurSoftness: 1.36,
    moodBlend: 1.0,
    oxygenGlow: 1.92,
    vibrance: 2.24,
    saturation: 1.78,
    contrast: 1.08,
    brightness: 1.64
  },
  haze: {
    timeScale: 0.64,
    flowSpeed: 0.5,
    warp: 0.24,
    turbulence: 0.2,
    blurSoftness: 2.52,
    moodBlend: 0.88,
    oxygenGlow: 1.28,
    vibrance: 1.7,
    saturation: 1.56,
    contrast: 0.92,
    brightness: 1.5
  }
};

const PRESET_BUTTONS = [
  { key: "arterial", label: "Vivid Arterial" },
  { key: "calm", label: "Calm Vessel" },
  { key: "deep", label: "Deep Crimson" },
  { key: "bloom", label: "Oxygen Bloom" },
  { key: "haze", label: "Soft Haze" }
];

const CORE_DEFAULT_KEYS = ["flowSpeed", "blurSoftness", "moodBlend", "oxygenGlow", "vibrance"];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createControlRow(key, config, value, onChange) {
  const decimals = String(config.step).includes(".") ? String(config.step).split(".")[1].length : 0;

  const wrapper = document.createElement("div");
  wrapper.className = "control-row";

  const label = document.createElement("label");
  label.htmlFor = `control-${key}`;
  label.textContent = config.label;

  const input = document.createElement("input");
  input.id = `control-${key}`;
  input.type = "range";
  input.min = String(config.min);
  input.max = String(config.max);
  input.step = String(config.step);
  input.value = String(value);

  const output = document.createElement("output");
  output.textContent = Number(value).toFixed(decimals);

  input.addEventListener("input", () => {
    const next = Number(input.value);
    output.textContent = Number(next).toFixed(decimals);
    onChange(next);
  });

  wrapper.append(label, input, output);
  return { wrapper, input };
}

let smoothGlow = 0;
let smoothCenterX = 50;
let smoothCenterY = 52;

function applyCssState(element, state, tSec) {
  const tempo = clamp(state.timeScale, 0.35, 1.9);
  const flow = Math.max(0.08, state.flowSpeed * tempo);

  const driftA = 16 / flow;
  const driftB = 13 / flow;
  const driftC = 19 / flow;
  const driftD = 23 / flow;

  const warpDrive = clamp(state.warp * 0.42 + state.turbulence * 0.28, 0, 1.8);
  const centerX = 50 + Math.sin(tSec * 0.09) * (1.6 + warpDrive * 1.2) + Math.sin(tSec * 0.031 + 1.2) * 1.1;
  const centerY = 52 + Math.cos(tSec * 0.08 + 0.5) * (1.4 + warpDrive * 1.1) + Math.sin(tSec * 0.042) * 0.9;
  smoothCenterX += (centerX - smoothCenterX) * 0.03;
  smoothCenterY += (centerY - smoothCenterY) * 0.03;

  const naturalGlow = 0.5 + 0.5 * Math.sin(tSec * 0.055 + Math.sin(tSec * 0.019) * 1.2);
  const targetGlow = (0.28 + state.oxygenGlow * 0.34) * (0.75 + naturalGlow * 0.25);
  smoothGlow += (targetGlow - smoothGlow) * 0.03;

  element.style.setProperty("--css-blur", `${Math.round(72 + state.blurSoftness * 74)}px`);
  element.style.setProperty("--drift-a", `${driftA.toFixed(2)}s`);
  element.style.setProperty("--drift-b", `${driftB.toFixed(2)}s`);
  element.style.setProperty("--drift-c", `${driftC.toFixed(2)}s`);
  element.style.setProperty("--drift-d", `${driftD.toFixed(2)}s`);
  element.style.setProperty("--center-x", `${smoothCenterX.toFixed(2)}%`);
  element.style.setProperty("--center-y", `${smoothCenterY.toFixed(2)}%`);
  element.style.setProperty("--glow-opacity", smoothGlow.toFixed(3));
  element.style.setProperty("--inner-halo", `${(26 + state.oxygenGlow * 15).toFixed(2)}%`);
  element.style.setProperty("--outer-halo", `${(56 + state.oxygenGlow * 20).toFixed(2)}%`);

  const hue = 355.2 + state.moodBlend * 2.4;
  const sat = Math.round(102 + state.saturation * 15);
  const deep = Math.round(14 + (1 - state.moodBlend) * 10);
  const mid = Math.round(31 + state.brightness * 11 + smoothGlow * 1.5);
  const glow = Math.round(44 + state.oxygenGlow * 14 + smoothGlow * 2.2);

  element.style.background = `linear-gradient(154deg, hsl(355 ${sat}% ${deep}%), hsl(${hue} ${sat}% ${mid}%), hsl(347 ${sat}% ${glow}%))`;

  const vibranceBoost = state.vibrance * (1 + smoothGlow * 0.02);
  element.style.filter = `saturate(${vibranceBoost.toFixed(2)}) contrast(${state.contrast.toFixed(2)}) brightness(${state.brightness.toFixed(2)})`;
}

function applyPreset(state, sliders, preset) {
  Object.entries(preset).forEach(([key, value]) => {
    state[key] = value;
    if (sliders[key]) {
      sliders[key].value = String(value);
      sliders[key].dispatchEvent(new Event("input"));
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const vessel = document.getElementById("cssFx");
  const controls = document.getElementById("controls");
  const defaultList = document.getElementById("defaultList");
  const controlList = document.getElementById("controlList");
  const resetButton = document.getElementById("resetButton");
  const presetsWrap = controls?.querySelector(".controls__presets");

  if (!(vessel instanceof HTMLElement) || !(controlList instanceof HTMLElement) || !(controls instanceof HTMLElement)) {
    return;
  }

  const state = { ...DEFAULT_STATE };
  const sliders = {};
  const defaultKeySet = new Set(CORE_DEFAULT_KEYS);

  if (defaultList instanceof HTMLElement) {
    defaultList.textContent = "";
    for (const key of CORE_DEFAULT_KEYS) {
      const config = PARAM_RANGES[key];
      if (!config) {
        continue;
      }
      const row = createControlRow(key, config, state[key], (next) => {
        state[key] = clamp(next, config.min, config.max);
      });
      row.wrapper.classList.add("control-row--default");
      sliders[key] = row.input;
      defaultList.append(row.wrapper);
    }
  }

  for (const group of CONTROL_GROUPS) {
    const advancedKeys = group.keys.filter((key) => !defaultKeySet.has(key));
    if (!advancedKeys.length) {
      continue;
    }
    const section = document.createElement("section");
    section.className = "control-group";

    const title = document.createElement("h3");
    title.className = "control-group__title";
    title.textContent = group.title;
    section.append(title);

    const body = document.createElement("div");
    body.className = "control-group__body";

    for (const key of advancedKeys) {
      const config = PARAM_RANGES[key];
      const row = createControlRow(key, config, state[key], (next) => {
        state[key] = clamp(next, config.min, config.max);
      });
      sliders[key] = row.input;
      body.append(row.wrapper);
    }

    section.append(body);
    controlList.append(section);
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => applyPreset(state, sliders, DEFAULT_STATE));
  }

  if (presetsWrap instanceof HTMLElement) {
    presetsWrap.textContent = "";
    const bucket = document.createElement("div");
    bucket.className = "preset-bucket";
    const title = document.createElement("h4");
    title.textContent = "Presets";
    const list = document.createElement("div");
    list.className = "preset-bucket__list";
    bucket.append(title, list);

    for (const preset of PRESET_BUTTONS) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.preset = preset.key;
      button.textContent = preset.label;
      button.className = "ui-button preset-button";
      button.addEventListener("click", () => {
        if (PRESETS[preset.key]) {
          applyPreset(state, sliders, PRESETS[preset.key]);
        }
      });
      list.append(button);
    }

    presetsWrap.append(bucket);
  }

  window.addEventListener("keydown", (event) => {
    const target = event.target;
    const inTextInput = target instanceof HTMLElement && /input|textarea/i.test(target.tagName);
    if (inTextInput) {
      return;
    }
    if (event.key === "h" || event.key === "H") {
      controls.hidden = !controls.hidden;
    }
  });

  let rafId = 0;
  function frame(now) {
    applyCssState(vessel, state, now / 1000);
    rafId = requestAnimationFrame(frame);
  }
  rafId = requestAnimationFrame(frame);

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(rafId);
  });
});
