import { fragmentShaderSource, vertexShaderSource } from "./shaders.js";

const DEFAULT_PALETTE = ["#990000", "#B80A23", "#CF223B", "#ED1E4A", "#FF6A7A"];

const DEFAULT_OPTIONS = {
  timeScale: 0.72,
  flowSpeed: 0.24,
  warp: 0.32,
  turbulence: 0.42,
  blurSoftness: 1.44,
  saturation: 1.32,
  contrast: 1.0,
  brightness: 1.34,
  vibrance: 1.66,
  moodBlend: 0.94,
  oxygenGlow: 1.22,
  quality: "auto",
  seed: 0.618
};

const PARAM_RANGES = {
  timeScale: { min: 0.2, max: 2.4 },
  flowSpeed: { min: 0.0, max: 1.2 },
  warp: { min: 0.0, max: 2.0 },
  turbulence: { min: 0.0, max: 2.4 },
  blurSoftness: { min: 0.1, max: 3.0 },
  saturation: { min: 0.4, max: 2.8 },
  contrast: { min: 0.4, max: 2.2 },
  brightness: { min: 0.5, max: 2.4 },
  vibrance: { min: 0.4, max: 3.2 },
  moodBlend: { min: 0.0, max: 1.0 },
  oxygenGlow: { min: 0.0, max: 2.6 }
};

const CONTROL_GROUPS = [
  {
    title: "Flow Field",
    controls: [
      { key: "timeScale", label: "Flow Tempo", step: 0.01 },
      { key: "flowSpeed", label: "Flow", step: 0.005 },
      { key: "warp", label: "Warp", step: 0.01 },
      { key: "turbulence", label: "Turbulence", step: 0.01 },
      { key: "blurSoftness", label: "Blur", step: 0.01 }
    ]
  },
  {
    title: "Color Response",
    controls: [
      { key: "moodBlend", label: "Mood Blend", step: 0.01 },
      { key: "oxygenGlow", label: "Oxygen Glow", step: 0.01 },
      { key: "vibrance", label: "Vibrance", step: 0.01 },
      { key: "saturation", label: "Saturation", step: 0.01 },
      { key: "contrast", label: "Contrast", step: 0.01 },
      { key: "brightness", label: "Brightness", step: 0.01 }
    ]
  }
];

const PRESETS = {
  arterial: {
    timeScale: 0.76,
    flowSpeed: 0.3,
    warp: 0.4,
    turbulence: 0.5,
    blurSoftness: 1.5,
    moodBlend: 0.98,
    oxygenGlow: 1.46,
    vibrance: 1.92,
    saturation: 1.44,
    contrast: 1.0,
    brightness: 1.42
  },
  calm: {
    timeScale: 0.58,
    flowSpeed: 0.16,
    warp: 0.2,
    turbulence: 0.26,
    blurSoftness: 1.66,
    moodBlend: 0.84,
    oxygenGlow: 0.9,
    vibrance: 1.38,
    saturation: 1.22,
    contrast: 0.94,
    brightness: 1.2
  },
  deep: {
    timeScale: 0.68,
    flowSpeed: 0.2,
    warp: 0.3,
    turbulence: 0.34,
    blurSoftness: 1.58,
    moodBlend: 0.64,
    oxygenGlow: 0.72,
    vibrance: 1.42,
    saturation: 1.2,
    contrast: 0.98,
    brightness: 1.18
  },
  bloom: {
    timeScale: 0.82,
    flowSpeed: 0.32,
    warp: 0.48,
    turbulence: 0.64,
    blurSoftness: 1.36,
    moodBlend: 1.0,
    oxygenGlow: 1.86,
    vibrance: 2.16,
    saturation: 1.72,
    contrast: 1.08,
    brightness: 1.6
  },
  haze: {
    timeScale: 0.62,
    flowSpeed: 0.18,
    warp: 0.26,
    turbulence: 0.22,
    blurSoftness: 2.26,
    moodBlend: 0.88,
    oxygenGlow: 1.24,
    vibrance: 1.68,
    saturation: 1.54,
    contrast: 0.92,
    brightness: 1.48
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

function parseHexColor(hex) {
  if (typeof hex !== "string") {
    return null;
  }
  const trimmed = hex.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return null;
  }
  return [
    parseInt(trimmed.slice(0, 2), 16) / 255,
    parseInt(trimmed.slice(2, 4), 16) / 255,
    parseInt(trimmed.slice(4, 6), 16) / 255
  ];
}

function mixColor(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t
  ];
}

function normalizePalette(inputPalette) {
  const parsed = Array.isArray(inputPalette) ? inputPalette.map(parseHexColor).filter(Boolean) : [];
  const source = parsed.length > 0 ? parsed : DEFAULT_PALETTE.map(parseHexColor);
  if (source.length === 1) {
    return Array.from({ length: 5 }, () => source[0].slice());
  }
  if (source.length === 5) {
    return source;
  }
  const result = [];
  for (let i = 0; i < 5; i += 1) {
    const t = i / 4;
    const scaled = t * (source.length - 1);
    const leftIndex = Math.floor(scaled);
    const rightIndex = Math.min(source.length - 1, leftIndex + 1);
    const localT = scaled - leftIndex;
    result.push(mixColor(source[leftIndex], source[rightIndex], localT));
  }
  return result;
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Failed to create shader object.");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Unknown shader compilation error";
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) {
    throw new Error("Failed to create WebGL program.");
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || "Unknown shader link error";
    gl.deleteProgram(program);
    throw new Error(message);
  }
  return program;
}

function setFallbackMode(canvas) {
  if (canvas) {
    canvas.style.display = "none";
  }
  if (typeof document !== "undefined" && canvas?.parentElement) {
    canvas.parentElement.classList.add("fallback-gradient");
  }
}

function clearFallbackMode(canvas) {
  if (canvas) {
    canvas.style.display = "block";
  }
  if (typeof document !== "undefined" && canvas?.parentElement) {
    canvas.parentElement.classList.remove("fallback-gradient");
  }
}

function createFallbackController(initialState, canvas) {
  const state = { ...initialState, isFallback: true };
  setFallbackMode(canvas);
  return {
    set(name, value) {
      if (Object.prototype.hasOwnProperty.call(state, name)) {
        state[name] = value;
      }
    },
    getState() {
      return { ...state };
    },
    setPalette() {},
    dispose() {}
  };
}

function getAutoQuality(internalScale) {
  if (internalScale > 0.86) {
    return { octaves: 2, taps: 3 };
  }
  if (internalScale > 0.7) {
    return { octaves: 2, taps: 2 };
  }
  return { octaves: 1, taps: 1 };
}

export function createVesselBackground(canvas, options = {}) {
  const state = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  for (const [key, range] of Object.entries(PARAM_RANGES)) {
    if (typeof state[key] === "number") {
      state[key] = clamp(state[key], range.min, range.max);
    }
  }
  state.seed = Number.isFinite(state.seed) ? state.seed : DEFAULT_OPTIONS.seed;
  state.quality = ["auto", "low", "high"].includes(state.quality) ? state.quality : "auto";

  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: false,
    powerPreference: "high-performance"
  });

  if (!gl) {
    return createFallbackController(state, canvas);
  }

  clearFallbackMode(canvas);

  let program;
  try {
    program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
  } catch (error) {
    console.error("Shader setup failed:", error);
    return createFallbackController(state, canvas);
  }

  const uniforms = {
    resolution: gl.getUniformLocation(program, "u_resolution"),
    time: gl.getUniformLocation(program, "u_time"),
    flowSpeed: gl.getUniformLocation(program, "u_flow_speed"),
    warp: gl.getUniformLocation(program, "u_warp"),
    turbulence: gl.getUniformLocation(program, "u_turbulence"),
    blurSoftness: gl.getUniformLocation(program, "u_blur_softness"),
    saturation: gl.getUniformLocation(program, "u_saturation"),
    contrast: gl.getUniformLocation(program, "u_contrast"),
    brightness: gl.getUniformLocation(program, "u_brightness"),
    vibrance: gl.getUniformLocation(program, "u_vibrance"),
    moodBlend: gl.getUniformLocation(program, "u_mood_blend"),
    oxygenGlow: gl.getUniformLocation(program, "u_oxygen_glow"),
    seed: gl.getUniformLocation(program, "u_seed"),
    palette: gl.getUniformLocation(program, "u_palette[0]"),
    octaves: gl.getUniformLocation(program, "u_octaves"),
    tapCount: gl.getUniformLocation(program, "u_tap_count")
  };

  const vao = gl.createVertexArray();
  const positionBuffer = gl.createBuffer();
  if (!vao || !positionBuffer) {
    return createFallbackController(state, canvas);
  }

  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  let palette = normalizePalette(options.palette);
  let paletteDirty = true;
  let disposed = false;
  let rafId = 0;
  let startTime = performance.now();
  let internalScale = state.quality === "high" ? 1.0 : state.quality === "low" ? 0.68 : 0.78;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.floor(canvas.clientWidth * dpr * internalScale));
    const height = Math.max(1, Math.floor(canvas.clientHeight * dpr * internalScale));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function chooseQuality() {
    if (state.quality === "high") {
      return { octaves: 3, taps: 3 };
    }
    if (state.quality === "low") {
      return { octaves: 1, taps: 1 };
    }
    return getAutoQuality(internalScale);
  }

  function uploadPalette() {
    if (!uniforms.palette || !paletteDirty) {
      return;
    }
    gl.uniform3fv(uniforms.palette, new Float32Array(palette.flat()));
    paletteDirty = false;
  }

  function frame(now) {
    if (disposed) {
      return;
    }
    resize();

    const quality = chooseQuality();
    const elapsedSeconds = (now - startTime) / 1000;
    const timeSeconds = elapsedSeconds * state.timeScale;

    gl.useProgram(program);
    gl.bindVertexArray(vao);

    uploadPalette();

    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1f(uniforms.time, timeSeconds);
    gl.uniform1f(uniforms.flowSpeed, state.flowSpeed);
    gl.uniform1f(uniforms.warp, state.warp);
    gl.uniform1f(uniforms.turbulence, state.turbulence);
    gl.uniform1f(uniforms.blurSoftness, state.blurSoftness);
    gl.uniform1f(uniforms.saturation, state.saturation);
    gl.uniform1f(uniforms.contrast, state.contrast);
    gl.uniform1f(uniforms.brightness, state.brightness);
    gl.uniform1f(uniforms.vibrance, state.vibrance);
    gl.uniform1f(uniforms.moodBlend, state.moodBlend);
    gl.uniform1f(uniforms.oxygenGlow, state.oxygenGlow);
    gl.uniform1f(uniforms.seed, state.seed);
    gl.uniform1i(uniforms.octaves, quality.octaves);
    gl.uniform1i(uniforms.tapCount, quality.taps);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    rafId = requestAnimationFrame(frame);
  }

  function set(name, value) {
    if (name === "quality") {
      if (["auto", "low", "high"].includes(value)) {
        state.quality = value;
        if (state.quality === "low") {
          internalScale = Math.min(internalScale, 0.72);
        }
        if (state.quality === "high") {
          internalScale = 1.0;
        }
        resize();
      }
      return;
    }
    if (Object.prototype.hasOwnProperty.call(PARAM_RANGES, name) && Number.isFinite(value)) {
      const range = PARAM_RANGES[name];
      state[name] = clamp(value, range.min, range.max);
    }
  }

  function setPalette(hexArray) {
    palette = normalizePalette(hexArray);
    paletteDirty = true;
  }

  function getState() {
    return {
      ...state,
      qualityScale: internalScale,
      isFallback: false
    };
  }

  function dispose() {
    if (disposed) {
      return;
    }
    disposed = true;
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
    gl.deleteBuffer(positionBuffer);
    gl.deleteVertexArray(vao);
    gl.deleteProgram(program);
  }

  window.addEventListener("resize", resize);
  resize();
  rafId = requestAnimationFrame(frame);

  return {
    set,
    getState,
    setPalette,
    dispose
  };
}

function createControlRow(config, value, onChange) {
  const decimals = String(config.step).includes(".") ? String(config.step).split(".")[1].length : 0;
  const wrapper = document.createElement("div");
  wrapper.className = "control-row";

  const label = document.createElement("label");
  label.textContent = config.label;
  label.htmlFor = `control-${config.key}`;

  const slider = document.createElement("input");
  slider.id = `control-${config.key}`;
  slider.type = "range";
  slider.min = String(PARAM_RANGES[config.key].min);
  slider.max = String(PARAM_RANGES[config.key].max);
  slider.step = String(config.step);
  slider.value = String(value);

  const output = document.createElement("output");
  output.textContent = Number(value).toFixed(decimals);

  slider.addEventListener("input", () => {
    const parsed = Number(slider.value);
    output.textContent = Number(parsed).toFixed(decimals);
    onChange(parsed);
  });

  wrapper.append(label, slider, output);
  return { wrapper, slider };
}

function applyPreset(controller, sliders, presetValues) {
  for (const [key, value] of Object.entries(presetValues)) {
    controller.set(key, value);
    if (sliders[key]) {
      sliders[key].value = String(value);
      sliders[key].dispatchEvent(new Event("input"));
    }
  }
}

function setupUi(controller) {
  const controls = document.getElementById("controls");
  const defaultList = document.getElementById("defaultList");
  const controlList = document.getElementById("controlList");
  const resetButton = document.getElementById("resetButton");
  const presetsWrap = controls?.querySelector(".controls__presets");

  if (!controls || !controlList) {
    return;
  }

  const initialState = controller.getState();
  if (initialState.isFallback) {
    controls.hidden = true;
    return;
  }

  const sliders = {};
  const configByKey = new Map();
  for (const group of CONTROL_GROUPS) {
    for (const config of group.controls) {
      configByKey.set(config.key, config);
    }
  }

  const defaultKeySet = new Set(CORE_DEFAULT_KEYS);

  if (defaultList instanceof HTMLElement) {
    defaultList.textContent = "";
    for (const key of CORE_DEFAULT_KEYS) {
      const config = configByKey.get(key);
      if (!config) {
        continue;
      }
      const row = createControlRow(config, initialState[config.key], (nextValue) => {
        controller.set(config.key, nextValue);
      });
      row.wrapper.classList.add("control-row--default");
      sliders[config.key] = row.slider;
      defaultList.append(row.wrapper);
    }
  }

  for (const group of CONTROL_GROUPS) {
    const advancedControls = group.controls.filter((config) => !defaultKeySet.has(config.key));
    if (!advancedControls.length) {
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
    for (const config of advancedControls) {
      const row = createControlRow(config, initialState[config.key], (nextValue) => {
        controller.set(config.key, nextValue);
      });
      sliders[config.key] = row.slider;
      body.append(row.wrapper);
    }
    section.append(body);
    controlList.append(section);
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      applyPreset(controller, sliders, DEFAULT_OPTIONS);
    });
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
      button.textContent = preset.label;
      button.dataset.preset = preset.key;
      button.className = "ui-button preset-button";
      button.addEventListener("click", () => {
        if (PRESETS[preset.key]) {
          applyPreset(controller, sliders, PRESETS[preset.key]);
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
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("bg");
    if (!(canvas instanceof HTMLCanvasElement)) {
      return;
    }
    const controller = createVesselBackground(canvas, { quality: "auto", seed: Math.random() * 10 });
    setupUi(controller);
  });
}
