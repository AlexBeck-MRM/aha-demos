const DEFAULT_STATE = {
  timeScale: 1,
  flowSpeed: 0.82,
  blurSoftness: 1.36,
  pulseRadius: 36,
  primaryBeat: 0.58,
  secondaryBeat: 0.18,
  activation: 1.6,
  redBias: 0.98,
  oxygenGlow: 1.92,
  generalContrast: 1.18,
  contrastDepth: 1.16,
  viewportFocus: 1.0
};

const TIME_SCALE_OPTIONS = [
  { value: 1, label: "1x" },
  { value: 0.5, label: "0.5x" },
  { value: 0.25, label: "0.25x" }
];

const PARAM_RANGES = {
  timeScale: { min: 0.25, max: 1.0, step: 0.25, label: "Time Scale", options: TIME_SCALE_OPTIONS },
  flowSpeed: { min: 0.2, max: 1.5, step: 0.01, label: "Motion" },
  blurSoftness: { min: 0.35, max: 2.4, step: 0.01, label: "Softness" },
  pulseRadius: { min: 24, max: 52, step: 0.1, label: "Pulse Size" },
  primaryBeat: { min: 0.0, max: 1.0, step: 0.01, label: "First Beat", description: "Opening squeeze. Lower this to soften the initial hit." },
  secondaryBeat: { min: 0.0, max: 0.7, step: 0.01, label: "Second Beat", description: "Follow-through echo. Lower this to reduce the double-beat feel." },
  activation: { min: 0.0, max: 2.4, step: 0.01, label: "Activation" },
  redBias: { min: 0.7, max: 1.4, step: 0.01, label: "Red Hold" },
  oxygenGlow: { min: 0.0, max: 2.6, step: 0.01, label: "Oxygen Glow" },
  generalContrast: { min: 0.75, max: 1.75, step: 0.01, label: "Global Contrast" },
  contrastDepth: { min: 0.75, max: 1.9, step: 0.01, label: "Contrast Depth" },
  viewportFocus: { min: 0.7, max: 1.65, step: 0.01, label: "Center Spread" }
};

const CONTROL_GROUPS = [
  {
    title: "Flow Field",
    description: "Ambient tissue drift and blur around the heartbeat.",
    keys: ["timeScale", "flowSpeed"]
  },
  {
    title: "Heartbeat Field",
    description: "Normal sinus-style pulse timing with separate first and second beat strength.",
    keys: ["primaryBeat", "secondaryBeat", "activation", "pulseRadius", "viewportFocus"]
  },
  {
    title: "Surface Response",
    description: "How large, bright, and contrasty the illuminated field feels across the viewport.",
    keys: ["blurSoftness", "redBias", "oxygenGlow", "generalContrast", "contrastDepth"]
  }
];

const PRESETS = {
  arterial: {
    timeScale: 1,
    flowSpeed: 0.72,
    blurSoftness: 1.4,
    pulseRadius: 34,
    primaryBeat: 0.62,
    secondaryBeat: 0.16,
    activation: 1.24,
    redBias: 1.12,
    oxygenGlow: 1.52,
    generalContrast: 1.08,
    contrastDepth: 1.12,
    viewportFocus: 0.92
  },
  calm: {
    timeScale: 0.5,
    flowSpeed: 0.44,
    blurSoftness: 1.9,
    pulseRadius: 37,
    primaryBeat: 0.44,
    secondaryBeat: 0.12,
    activation: 0.72,
    redBias: 1.02,
    oxygenGlow: 0.9,
    generalContrast: 0.94,
    contrastDepth: 0.88,
    viewportFocus: 1.14
  },
  deep: {
    timeScale: 0.5,
    flowSpeed: 0.48,
    blurSoftness: 1.72,
    pulseRadius: 33,
    primaryBeat: 0.52,
    secondaryBeat: 0.1,
    activation: 0.78,
    redBias: 1.24,
    oxygenGlow: 0.72,
    generalContrast: 1.06,
    contrastDepth: 1.28,
    viewportFocus: 0.86
  },
  bloom: {
    timeScale: 1,
    flowSpeed: 0.82,
    blurSoftness: 1.36,
    pulseRadius: 36,
    primaryBeat: 0.66,
    secondaryBeat: 0.22,
    activation: 1.6,
    redBias: 0.98,
    oxygenGlow: 1.92,
    generalContrast: 1.18,
    contrastDepth: 1.16,
    viewportFocus: 1.0
  },
  haze: {
    timeScale: 0.25,
    flowSpeed: 0.5,
    blurSoftness: 2.52,
    pulseRadius: 39,
    primaryBeat: 0.4,
    secondaryBeat: 0.08,
    activation: 0.92,
    redBias: 1.04,
    oxygenGlow: 1.28,
    generalContrast: 0.88,
    contrastDepth: 0.84,
    viewportFocus: 1.2
  }
};

const PRESET_BUTTONS = [
  { key: "arterial", label: "Vivid Arterial" },
  { key: "calm", label: "Calm Vessel" },
  { key: "deep", label: "Deep Crimson" },
  { key: "bloom", label: "Oxygen Bloom" },
  { key: "haze", label: "Soft Haze" }
];

const CORE_DEFAULT_KEYS = ["timeScale", "primaryBeat", "secondaryBeat", "activation", "generalContrast"];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function createControlRow(key, config, value, onChange) {
  const wrapper = document.createElement("div");
  wrapper.className = "control-row";

  const meta = document.createElement("div");
  meta.className = "control-row__meta";

  const label = document.createElement("label");
  label.htmlFor = `control-${key}`;
  label.textContent = config.label;
  meta.append(label);

  if (config.description) {
    const hint = document.createElement("p");
    hint.className = "control-row__hint";
    hint.textContent = config.description;
    meta.append(hint);
  }

  if (Array.isArray(config.options) && config.options.length) {
    const choices = document.createElement("div");
    choices.className = "control-choices";
    const output = document.createElement("output");

    const syncActive = (nextValue) => {
      for (const button of choices.querySelectorAll("button")) {
        button.classList.toggle("is-active", Number(button.dataset.value) === nextValue);
      }
      const selected = config.options.find((option) => option.value === nextValue);
      output.textContent = selected ? selected.label : String(nextValue);
    };

    for (const option of config.options) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "ui-button control-choice";
      button.dataset.value = String(option.value);
      button.textContent = option.label;
      button.addEventListener("click", () => {
        syncActive(option.value);
        onChange(option.value);
      });
      choices.append(button);
    }

    syncActive(Number(value));
    wrapper.classList.add("control-row--choice");
    wrapper.append(meta, choices, output);
    return {
      wrapper,
      input: {
        value: String(value),
        dispatchEvent(event) {
          if (event?.type === "input") {
            syncActive(Number(this.value));
            onChange(Number(this.value));
          }
          return true;
        }
      }
    };
  }

  const decimals = String(config.step).includes(".") ? String(config.step).split(".")[1].length : 0;

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

  wrapper.append(meta, input, output);
  return { wrapper, input };
}

let smoothGlow = 0;
let smoothCenterX = 50;
let smoothCenterY = 52;
let smoothBeat = 0;
let smoothPressure = 0;
let smoothEcho = 0;
let smoothPerfusion = 0;
let smoothRecoil = 0;
let lastStageScale = 1;
let lastCssFilter = "";

function applyCssState(element, state, tSec) {
  const tempo = clamp(state.timeScale, 0.35, 1.9);
  const flow = Math.max(0.08, state.flowSpeed * tempo);
  const stage = element.parentElement instanceof HTMLElement ? element.parentElement : null;
  const organicDrift = clamp(0.32 + state.flowSpeed * 0.56 + state.activation * 0.12, 0.18, 1.44);
  const pulseSoftness = clamp(0.72 + state.blurSoftness * 0.12 - state.activation * 0.04, 0.55, 1.32);
  const asymmetry = clamp(0.22 + organicDrift * 0.18 + state.activation * 0.08, 0.18, 0.72);
  const localContrast = clamp(state.generalContrast, 0.75, 1.75);
  const contrastDepth = clamp(state.contrastDepth, 0.75, 1.9);
  const viewportFocus = clamp(state.viewportFocus, 0.7, 1.65);
  const warpDrive = clamp(state.flowSpeed * 0.44 + organicDrift * 0.34 + state.activation * 0.08, 0, 2.0);

  const driftA = 16 / flow;
  const driftB = 13 / flow;
  const driftC = 19 / flow;
  const driftD = 23 / flow;

  const beatPeriod = clamp(1.22 - state.flowSpeed * 0.12 - tempo * 0.08, 0.78, 1.36);
  const beatPhase = (tSec / beatPeriod) % 1;
  const primaryWidth = 0.03 + pulseSoftness * 0.017;
  const secondaryWidth = 0.05 + pulseSoftness * 0.022;
  const primaryBeat = state.primaryBeat * Math.exp(-Math.pow((beatPhase - 0.115) / primaryWidth, 2));
  const secondaryBeat = state.secondaryBeat * Math.exp(-Math.pow((beatPhase - 0.292) / secondaryWidth, 2));
  const beatTail = Math.exp(-Math.max(0, beatPhase - 0.18) * (6.1 - pulseSoftness * 1.2)) * (0.18 + state.secondaryBeat * 0.52);
  const beatTarget = clamp((primaryBeat + secondaryBeat) * (0.68 + beatTail * 0.14), 0, 1.45);
  smoothBeat += (beatTarget - smoothBeat) * 0.16;

  const pressureTarget = clamp(primaryBeat * (0.78 + state.activation * 0.18) + secondaryBeat * 0.58, 0, 1.8);
  const echoTarget = clamp(secondaryBeat + beatTail * 0.08, 0, 1.2);
  const perfusionTarget = clamp(primaryBeat * 0.18 + secondaryBeat * 0.42 + beatTail * (0.42 + state.activation * 0.06), 0, 1.5);
  const recoilPhase = Math.max(0, beatPhase - 0.14);
  const recoilTarget = Math.max(0, Math.sin(recoilPhase * 13.5) * Math.exp(-recoilPhase * 5.6));
  smoothPressure += (pressureTarget - smoothPressure) * 0.24;
  smoothEcho += (echoTarget - smoothEcho) * 0.2;
  smoothPerfusion += (perfusionTarget - smoothPerfusion) * 0.14;
  smoothRecoil += (recoilTarget - smoothRecoil) * 0.12;

  const driftSwing = 1.3 + organicDrift * 1.9 + warpDrive * 0.55;
  const centerX =
    50 +
    Math.sin(tSec * 0.087 + 0.4) * driftSwing +
    Math.sin(tSec * 0.029 + 1.2) * (0.9 + asymmetry * 1.3) +
    Math.sin(tSec * 0.16 + 0.9) * smoothPressure * (1.2 + asymmetry * 1.05) +
    Math.cos(tSec * 0.21 + 0.4) * smoothEcho * 0.55;
  const centerY =
    52 +
    Math.cos(tSec * 0.074 + 0.6) * (1.05 + organicDrift * 1.4) +
    Math.sin(tSec * 0.041 + 2.1) * (0.8 + asymmetry * 0.9) -
    smoothPressure * (1.1 + state.activation * 0.54) +
    smoothRecoil * 0.48;
  smoothCenterX += (centerX - smoothCenterX) * (0.03 + organicDrift * 0.01);
  smoothCenterY += (centerY - smoothCenterY) * (0.03 + organicDrift * 0.01);

  const naturalGlow = 0.5 + 0.5 * Math.sin(tSec * 0.055 + Math.sin(tSec * 0.019) * 1.2);
  const targetGlow =
    (0.14 + state.oxygenGlow * 0.22 + state.activation * 0.05) *
    (0.66 + naturalGlow * 0.1 + smoothPressure * 0.5 + smoothPerfusion * 0.36);
  smoothGlow += (targetGlow - smoothGlow) * 0.08;

  const pulseRadiusX =
    state.pulseRadius * viewportFocus +
    state.activation * 3.2 +
    smoothPressure * (4.8 + state.activation * 1.8) +
    smoothPerfusion * (10.8 + pulseSoftness * 2.2) +
    organicDrift * 1.6;
  const pulseRadiusY =
    state.pulseRadius * viewportFocus * (0.72 + pulseSoftness * 0.08) +
    asymmetry * 5.5 +
    smoothPressure * (2.8 + state.activation * 1.4) +
    smoothPerfusion * (7.2 + pulseSoftness * 1.2);
  const pulseSoftEdge = 8 + viewportFocus * 3.5 + pulseSoftness * 14 + smoothPerfusion * 10 + organicDrift * 2.6;
  const skewX =
    Math.sin(tSec * 0.18 + 0.6) * (1 + asymmetry * 2.6) +
    smoothPressure * asymmetry * 3.6 -
    smoothRecoil * 1.8;
  const skewY =
    Math.cos(tSec * 0.14 + 1.2) * (0.8 + asymmetry * 1.8) -
    smoothPressure * (1.6 + asymmetry * 1.4) +
    smoothRecoil * 0.8;
  const pulseAngle = -8 + asymmetry * 18 + Math.sin(tSec * 0.064 + 0.2) * 4 + smoothPressure * 6 - smoothEcho * 3;
  const tissueCompress = smoothPressure * (0.55 + state.activation * 0.14);
  const tissueRelax = smoothRecoil * (0.38 + pulseSoftness * 0.08);
  const tissueShiftX = (smoothPressure * (0.5 + asymmetry * 1.6) - smoothEcho * 0.48) * 3.2;
  const tissueShiftY = (-smoothPressure * (0.85 + state.activation * 0.24) + smoothRecoil * 0.5) * 2.8;
  const tissueTilt = smoothPressure * (2.2 + asymmetry * 5.2) - smoothEcho * 1.6;

  element.style.setProperty("--css-blur", `${Math.round(36 + state.blurSoftness * 24 + pulseSoftness * 4)}px`);
  element.style.setProperty("--drift-a", `${driftA.toFixed(2)}s`);
  element.style.setProperty("--drift-b", `${driftB.toFixed(2)}s`);
  element.style.setProperty("--drift-c", `${driftC.toFixed(2)}s`);
  element.style.setProperty("--drift-d", `${driftD.toFixed(2)}s`);
  element.style.setProperty("--center-x", `${smoothCenterX.toFixed(2)}%`);
  element.style.setProperty("--center-y", `${smoothCenterY.toFixed(2)}%`);
  element.style.setProperty("--beat-period", `${beatPeriod.toFixed(3)}s`);
  element.style.setProperty("--beat-core-x", `${(smoothCenterX + skewX * 0.45).toFixed(2)}%`);
  element.style.setProperty("--beat-core-y", `${(smoothCenterY + skewY * 0.4).toFixed(2)}%`);
  element.style.setProperty("--pulse-radius-x", `${pulseRadiusX.toFixed(2)}%`);
  element.style.setProperty("--pulse-radius-y", `${pulseRadiusY.toFixed(2)}%`);
  element.style.setProperty("--pulse-soft-edge", `${pulseSoftEdge.toFixed(2)}%`);
  element.style.setProperty("--field-core-x", `${(50 + viewportFocus * 18).toFixed(2)}%`);
  element.style.setProperty("--field-core-y", `${(42 + viewportFocus * 14).toFixed(2)}%`);
  element.style.setProperty("--field-shadow-x", `${(70 + viewportFocus * 20).toFixed(2)}%`);
  element.style.setProperty("--field-shadow-y", `${(58 + viewportFocus * 16).toFixed(2)}%`);
  element.style.setProperty("--pulse-skew-x", `${skewX.toFixed(2)}%`);
  element.style.setProperty("--pulse-skew-y", `${skewY.toFixed(2)}%`);
  element.style.setProperty("--pulse-angle", `${pulseAngle.toFixed(2)}deg`);
  element.style.setProperty("--pulse-stretch-x", `${(1 + asymmetry * 0.08 + smoothPressure * 0.02 + smoothPerfusion * 0.09).toFixed(3)}`);
  element.style.setProperty("--pulse-stretch-y", `${(1 - asymmetry * 0.04 - smoothPressure * 0.06 + smoothPerfusion * 0.04).toFixed(3)}`);
  element.style.setProperty("--activation-energy", smoothBeat.toFixed(3));
  element.style.setProperty("--primary-hit", smoothPressure.toFixed(3));
  element.style.setProperty("--echo-hit", smoothEcho.toFixed(3));
  element.style.setProperty("--perfusion-level", smoothPerfusion.toFixed(3));
  element.style.setProperty("--recoil-level", smoothRecoil.toFixed(3));
  element.style.setProperty("--activation-opacity", `${(0.28 + state.activation * 0.18 + smoothPressure * 0.42 + smoothPerfusion * 0.22).toFixed(3)}`);
  element.style.setProperty("--shadow-opacity", `${(0.22 + state.redBias * 0.08 + smoothPressure * 0.18).toFixed(3)}`);
  element.style.setProperty("--oxygen-glow", `${clamp(0.12 + smoothGlow + smoothPressure * 0.22 + smoothPerfusion * 0.12, 0, 1.52).toFixed(3)}`);
  element.style.setProperty("--pulse-wave-opacity", `${(0.1 + state.activation * 0.08 + smoothPerfusion * 0.18).toFixed(3)}`);
  element.style.setProperty("--pulse-bloom", `${(0.64 + state.activation * 0.62 + smoothPerfusion * 0.42).toFixed(3)}`);
  element.style.setProperty("--pulse-zoom", `${(0.008 + state.activation * 0.0014 + smoothPressure * 0.0052 + smoothRecoil * 0.0014).toFixed(4)}`);
  element.style.setProperty("--beat-light", `${(0.18 + smoothPressure * 0.94 + smoothPerfusion * 0.38).toFixed(3)}`);
  element.style.setProperty("--flow-kick", `${(0.12 + smoothPressure * 0.62 + smoothEcho * 0.18 + organicDrift * 0.08).toFixed(3)}`);
  element.style.setProperty("--dub-balance", `${(0.48 + asymmetry * 0.34).toFixed(3)}`);
  element.style.setProperty("--tissue-compress", tissueCompress.toFixed(3));
  element.style.setProperty("--tissue-relax", tissueRelax.toFixed(3));
  element.style.setProperty("--tissue-shift-x", `${tissueShiftX.toFixed(3)}%`);
  element.style.setProperty("--tissue-shift-y", `${tissueShiftY.toFixed(3)}%`);
  element.style.setProperty("--tissue-tilt", `${tissueTilt.toFixed(3)}deg`);
  element.style.setProperty("--global-contrast", localContrast.toFixed(3));
  element.style.setProperty("--contrast-depth", contrastDepth.toFixed(3));

  element.style.setProperty("--surface-bright-opacity", ((0.14 + smoothPressure * 0.08 + smoothPerfusion * 0.16) * (0.82 + localContrast * 0.14 + contrastDepth * 0.12)).toFixed(3));
  element.style.setProperty("--surface-shadow-opacity", ((0.2 + state.redBias * 0.08 + smoothPressure * 0.09) * (0.82 + localContrast * 0.14 + contrastDepth * 0.18)).toFixed(3));
  element.style.setProperty("--field-vignette-opacity", ((0.18 + smoothPressure * 0.05 + smoothPerfusion * 0.08) * (0.78 + localContrast * 0.16 + contrastDepth * 0.24)).toFixed(3));

  const saturationGain = 1.02 + state.activation * 0.06 + smoothPerfusion * 0.06;
  const filterContrast = 0.86 + localContrast * 0.18 + contrastDepth * 0.16;
  const filterBrightness = 0.98 + state.activation * 0.03 - Math.max(0, contrastDepth - 1) * 0.04;
  const filterValue = `saturate(${saturationGain.toFixed(2)}) contrast(${filterContrast.toFixed(2)}) brightness(${filterBrightness.toFixed(2)})`;
  if (filterValue !== lastCssFilter) {
    element.style.filter = filterValue;
    lastCssFilter = filterValue;
  }

  if (stage) {
    const stageScale = 1 + smoothPressure * 0.0072 + smoothPerfusion * 0.0032 - smoothRecoil * 0.0014;
    if (Math.abs(stageScale - lastStageScale) > 0.0002) {
      stage.style.setProperty("--stage-pulse-scale", stageScale.toFixed(5));
      lastStageScale = stageScale;
    }
  }
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

    if (group.description) {
      const note = document.createElement("p");
      note.className = "control-group__note";
      note.textContent = group.description;
      section.append(note);
    }

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
  let lastRenderAt = 0;
  function frame(now) {
    if (now - lastRenderAt >= 1000 / 42) {
      applyCssState(vessel, state, now / 1000);
      lastRenderAt = now;
    }
    rafId = requestAnimationFrame(frame);
  }
  rafId = requestAnimationFrame(frame);

  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(rafId);
  });
});
