const STORAGE_KEY = "aha-living-gradient-playground:v43";
const LEGACY_STORAGE_KEYS = ["aha-living-gradient-playground:v42", "aha-living-gradient-playground:v41", "aha-living-gradient-playground:v40", "aha-living-gradient-playground:v39", "aha-living-gradient-playground:v38", "aha-living-gradient-playground:v37", "aha-living-gradient-playground:v36", "aha-living-gradient-playground:v35"];
const CONFIG_SCHEMA = "aha-living-gradient-playground/v43";

const prototype = document.querySelector(".prototype");
const gradients = Array.from(document.querySelectorAll(".living-gradient"));
const controlsRoot = document.querySelector("[data-control-root]");
const cssOutput = document.querySelector("[data-css-output]");
const saveConfigButton = document.querySelector("[data-save-config]");
const copyCssButton = document.querySelector("[data-copy-css]");
const copyConfigButton = document.querySelector("[data-copy-config]");
const exportPngButton = document.querySelector("[data-export-png]");
const exportLogoPngButton = document.querySelector("[data-export-logo-png]");
const exportHqMp4Button = document.querySelector("[data-export-hq-mp4]");
const exportMp4Button = document.querySelector("[data-export-mp4]");
const exportLogoMp4Button = document.querySelector("[data-export-logo-mp4]");
const resetButton = document.querySelector("[data-reset-config]");
const copyStatus = document.querySelector("[data-copy-status]");
const modeReadout = document.querySelector("[data-mode-readout]");
const minimapButtons = Array.from(document.querySelectorAll("[data-minimap-surface]"));

const EXPORT_WIDTH = 2160;
const EXPORT_HEIGHT = 1620;
const MAX_PREVIEW_CANVAS_SIZE = 1600;
const LOGO_EXPORT_WIDTH = 1080;
const LOGO_EXPORT_HEIGHT = 1080;
const EXPORT_FPS = 30;
const BACKGROUND_EXPORT_BITRATE = 60_000_000;
const LOGO_EXPORT_BASE_BITRATE = 10_000_000;
const BACKGROUND_EXPORT_SELECTOR = ".background-surface";
const LOGO_EXPORT_SELECTOR = ".aha-logo-effect-large";
const MINIMAP_SELECTOR = ".shader-minimap";
const LOGO_EXPORT_MASK_URL = "assets/aha-logo-mask-large.svg";
const LOGO_EXPORT_FALLBACK_ASPECT = 124 / 149;
const BACKGROUND_EXPORT_MIN_SECONDS = 8;
const LOGO_EXPORT_MIN_SECONDS = 20;
const EXPORT_MAX_SECONDS = 160;
const EXPORT_COLOR_SPACE = "srgb";
const EXPORT_COLOR_PROFILE = "sRGB IEC61966-2.1";
const HQ_MP4_ENDPOINTS = {
  start: "/__gradient-lab/hq-mp4/start",
  frame: "/__gradient-lab/hq-mp4/frame",
  finish: "/__gradient-lab/hq-mp4/finish",
  cancel: "/__gradient-lab/hq-mp4/cancel",
};
const HQ_MP4_FILENAME = "aha-living-gradient-background-hq.mp4";
const HQ_MP4_ENCODER = {
  codec: "libx264",
  preset: "slow",
  crf: 14,
  pixelFormat: "yuv420p",
  colorPrimaries: "bt709",
  colorTransfer: "bt709",
  colorSpace: "bt709",
  x264Params: "colorprim=bt709:transfer=bt709:colormatrix=bt709",
  movflags: "+faststart",
};
const EXPORT_MP4_COLOR_METADATA = {
  format: "nclx",
  colorPrimaries: 1,
  transferCharacteristics: 13,
  matrixCoefficients: 1,
  fullRange: false,
};
const EXPORT_COLOR_GRADE_DEFAULTS = {
  exposure: 0.88,
  shadowMix: 0.18,
  orangeLuminanceCap: 0.82,
  saturation: 1.03,
};
const REDUCED_MOTION_STATIC_PHASE = 0.34;
const MINIMAP_SURFACES = ["logo", "background", "card", "button"];
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
    name: "Current Balance",
    summary: "The approved flame balance with strong blur and a restrained warm plume.",
    values: {
      duration: 22,
      evolutionSpeed: 1.68,
      flameScale: 1.36,
      flameRotation: -52,
      flameX: 0.91,
      flameY: 0.65,
      flameWidth: 1.48,
      flameHeight: 1.33,
      flameStrength: 1.39,
      redPlumeX: 0.04,
      redPlumeY: -0.02,
      taperPower: 1.62,
      edgeSoftness: 0.62,
      warmLight: 1.17,
      warmSpread: 1.44,
      orangePlumeX: 0.17,
      orangePlumeY: -0.04,
      orangePlumeHeight: 0.9,
      orangePlumeSoftness: 1.98,
      deepPressure: 1.34,
      turbulence: 1,
      noiseScale: 1.44,
      rise: 1.4,
      sway: 0.79,
      redExtraSway: 2.39,
      colorIntensity: 1.2,
      shaderContrast: 1.12,
      shaderBlur: 22,
      surfaceBlurBoost: 126,
      deepColor: "#520208",
      redColor: "#e2001e",
      orangeColor: "#ffc139",
    },
  },
  {
    id: "B",
    label: "B",
    name: "Softer Light",
    summary: "A nearby version with a gentler orange plume and slightly calmer movement.",
    values: {
      duration: 24,
      evolutionSpeed: 1.72,
      flameScale: 1.82,
      flameRotation: -29,
      flameX: 1.2,
      flameY: 0.27,
      flameWidth: 1.35,
      flameHeight: 1.24,
      flameStrength: 1.29,
      redPlumeX: -0.03,
      redPlumeY: 0.02,
      taperPower: 1.47,
      edgeSoftness: 0.72,
      warmLight: 1.02,
      warmSpread: 0.5,
      orangePlumeX: -0.04,
      orangePlumeY: 0.03,
      orangePlumeHeight: 0.92,
      orangePlumeSoftness: 1.22,
      deepPressure: 1.18,
      turbulence: 0.88,
      noiseScale: 1.28,
      rise: 0.82,
      sway: 0.96,
      redExtraSway: 0.65,
      colorIntensity: 1.16,
      shaderContrast: 0.96,
      shaderBlur: 24,
      surfaceBlurBoost: 24,
      deepColor: "#520208",
      redColor: "#e2001e",
      orangeColor: "#ffc139",
    },
  },
  {
    id: "C",
    label: "C",
    name: "Deeper Shadow",
    summary: "A close darker option with more deep-red pressure and a narrower orange core.",
    values: {
      duration: 22,
      evolutionSpeed: 1.86,
      flameScale: 1.96,
      flameRotation: -34,
      flameX: 1.31,
      flameY: 0.22,
      flameWidth: 1.48,
      flameHeight: 1.33,
      flameStrength: 1.39,
      redPlumeX: 0.04,
      redPlumeY: -0.02,
      taperPower: 1.62,
      edgeSoftness: 0.62,
      warmLight: 1.04,
      warmSpread: 0.46,
      orangePlumeX: 0.04,
      orangePlumeY: -0.04,
      orangePlumeHeight: 0.9,
      orangePlumeSoftness: 0.9,
      deepPressure: 1.34,
      turbulence: 1,
      noiseScale: 1.44,
      rise: 0.96,
      sway: 1.2,
      redExtraSway: 0.65,
      colorIntensity: 1.2,
      shaderContrast: 1.12,
      shaderBlur: 22,
      surfaceBlurBoost: 24,
      deepColor: "#520208",
      redColor: "#e2001e",
      orangeColor: "#ffc139",
    },
  },
  {
    id: "D",
    label: "D",
    name: "Wider Plume",
    summary: "A nearby broader crop that keeps the same direction but shows more red body.",
    values: {
      duration: 20,
      evolutionSpeed: 2.05,
      flameScale: 2.08,
      flameRotation: -36,
      flameX: 1.34,
      flameY: 0.23,
      flameWidth: 1.62,
      flameHeight: 1.36,
      flameStrength: 1.31,
      redPlumeX: -0.06,
      redPlumeY: 0.03,
      taperPower: 1.42,
      edgeSoftness: 0.7,
      warmLight: 1.18,
      warmSpread: 0.66,
      orangePlumeX: -0.02,
      orangePlumeY: 0.02,
      orangePlumeHeight: 1.12,
      orangePlumeSoftness: 1.08,
      deepPressure: 1.2,
      turbulence: 1.08,
      noiseScale: 1.5,
      rise: 0.9,
      sway: 1.32,
      redExtraSway: 0.65,
      colorIntensity: 1.18,
      shaderContrast: 1.04,
      shaderBlur: 26,
      surfaceBlurBoost: 24,
      deepColor: "#520208",
      redColor: "#e2001e",
      orangeColor: "#ffc139",
    },
  },
];

const presetById = new Map(presets.map((preset) => [preset.id, preset]));

function applyCanvasColorSpace(canvas) {
  if (!canvas) return;
  if ("colorSpace" in canvas) {
    try {
      canvas.colorSpace = EXPORT_COLOR_SPACE;
    } catch {
      // Canvas colorSpace is advisory and not supported by every browser.
    }
  }
}

function applyWebGLColorSpace(gl) {
  if (!gl) return;
  if ("drawingBufferColorSpace" in gl) {
    try {
      gl.drawingBufferColorSpace = EXPORT_COLOR_SPACE;
    } catch {
      // Unsupported WebGL color-space setters should not block rendering.
    }
  }
  if ("unpackColorSpace" in gl) {
    try {
      gl.unpackColorSpace = EXPORT_COLOR_SPACE;
    } catch {
      // Unsupported WebGL color-space setters should not block rendering.
    }
  }
}

function get2dContext(canvas, options = {}) {
  applyCanvasColorSpace(canvas);
  const contextOptions = {
    alpha: options.alpha ?? true,
    colorSpace: EXPORT_COLOR_SPACE,
  };
  if (options.willReadFrequently !== undefined) {
    contextOptions.willReadFrequently = Boolean(options.willReadFrequently);
  }
  try {
    return canvas.getContext("2d", contextOptions) ?? canvas.getContext("2d", { alpha: contextOptions.alpha });
  } catch {
    return canvas.getContext("2d", { alpha: contextOptions.alpha });
  }
}

function getWebGLContext(canvas, options = {}) {
  applyCanvasColorSpace(canvas);
  let gl = null;
  try {
    gl = canvas.getContext("webgl", options);
  } catch {
    gl = null;
  }
  applyWebGLColorSpace(gl);
  return gl;
}

const authoredDefaultValues = {
  duration: 22,
  evolutionSpeed: 1.68,
  flameScale: 1.36,
  flameRotation: -52,
  flameX: 0.91,
  flameY: 0.65,
  flameWidth: 1.48,
  flameHeight: 1.33,
  flameStrength: 1.39,
  redPlumeX: 0.04,
  redPlumeY: -0.02,
  taperPower: 1.62,
  edgeSoftness: 0.62,
  warmLight: 1.17,
  warmSpread: 1.44,
  orangePlumeX: 0.17,
  orangePlumeY: -0.04,
  orangePlumeHeight: 0.9,
  orangePlumeSoftness: 1.98,
  deepPressure: 1.34,
  turbulence: 1,
  noiseScale: 1.44,
  rise: 1.4,
  sway: 0.79,
  redExtraSway: 2.39,
  colorIntensity: 1.2,
  shaderContrast: 1.12,
  shaderBlur: 22,
  surfaceBlurBoost: 126,
  deepColor: "#520208",
  redColor: "#e2001e",
  orangeColor: "#ffc139",
  logoShaderScale: 0.95,
  logoShaderX: -0.02,
  logoShaderY: 0,
  logoShaderRotation: -9,
  logoExportScale: 0.82,
  logoExportResolution: 3,
  minimapSurface: "logo",
  minimapContextScale: 3,
  figmaExportGrade: true,
};

const controlGroups = [
  {
    id: "composition",
    title: "Composition",
    icon: "target",
    open: true,
    keys: ["flameScale", "flameRotation", "flameX", "flameY", "shaderBlur", "surfaceBlurBoost"],
  },
  {
    id: "red-plume",
    title: "Red Plume",
    icon: "plume",
    open: true,
    keys: ["flameWidth", "flameHeight", "flameStrength", "redPlumeX", "redPlumeY", "redExtraSway", "taperPower"],
  },
  {
    id: "orange-plume",
    title: "Orange Plume",
    icon: "beam",
    open: true,
    keys: ["warmLight", "warmSpread", "orangePlumeX", "orangePlumeY", "orangePlumeHeight", "orangePlumeSoftness"],
  },
  {
    id: "texture",
    title: "Motion & Texture",
    icon: "wave",
    open: true,
    keys: ["duration", "evolutionSpeed", "rise", "sway", "turbulence", "noiseScale", "edgeSoftness"],
  },
  {
    id: "colour",
    title: "Colour & Depth",
    icon: "swatch",
    open: true,
    keys: ["deepColor", "redColor", "orangeColor", "deepPressure", "colorIntensity", "shaderContrast", "figmaExportGrade"],
  },
  {
    id: "logo-mapping",
    title: "Logo Mapping",
    icon: "logo",
    open: true,
    keys: ["logoShaderScale", "logoShaderX", "logoShaderY", "logoShaderRotation", "logoExportScale", "logoExportResolution"],
  },
  {
    id: "minimap",
    title: "Shader Minimap",
    icon: "map",
    open: true,
    keys: ["minimapContextScale"],
  },
  {
    id: "surfaces",
    title: "Surfaces",
    icon: "grid",
    open: false,
    keys: ["surfaces.all", "surfaces.logo", "surfaces.button", "surfaces.card", "surfaces.background"],
  },
  {
    id: "accessibility",
    title: "Motion & Contrast",
    icon: "pause",
    open: false,
    keys: ["reducedMotion", "contrastSafe", "paused"],
  },
];

const controlDefinitions = {
  duration: { key: "duration", label: "Cycle", type: "range", min: 6, max: 36, step: 1, default: authoredDefaultValues.duration, unit: "s" },
  evolutionSpeed: { key: "evolutionSpeed", label: "Evolution speed", type: "range", min: 0.4, max: 4, step: 0.01, default: authoredDefaultValues.evolutionSpeed, unit: "x" },
  flameScale: { key: "flameScale", label: "Overall scale", type: "range", min: 0.25, max: 5, step: 0.01, default: authoredDefaultValues.flameScale },
  flameRotation: { key: "flameRotation", label: "Rotation", type: "range", min: -180, max: 180, step: 1, default: authoredDefaultValues.flameRotation, unit: "deg" },
  flameX: { key: "flameX", label: "Scene X", type: "range", min: -1, max: 2, step: 0.01, default: authoredDefaultValues.flameX },
  flameY: { key: "flameY", label: "Scene Y", type: "range", min: -1, max: 2, step: 0.01, default: authoredDefaultValues.flameY },
  flameWidth: { key: "flameWidth", label: "Red width", type: "range", min: 0.08, max: 5, step: 0.01, default: authoredDefaultValues.flameWidth },
  flameHeight: { key: "flameHeight", label: "Red height", type: "range", min: 0.16, max: 5, step: 0.01, default: authoredDefaultValues.flameHeight },
  flameStrength: { key: "flameStrength", label: "Red strength", type: "range", min: 0.35, max: 1.65, step: 0.01, default: authoredDefaultValues.flameStrength },
  redPlumeX: { key: "redPlumeX", label: "Red X offset", type: "range", min: -1, max: 1, step: 0.01, default: authoredDefaultValues.redPlumeX },
  redPlumeY: { key: "redPlumeY", label: "Red Y offset", type: "range", min: -1, max: 1, step: 0.01, default: authoredDefaultValues.redPlumeY },
  redExtraSway: { key: "redExtraSway", label: "Red extra sway", type: "range", min: 0, max: 4, step: 0.01, default: authoredDefaultValues.redExtraSway },
  taperPower: { key: "taperPower", label: "Red taper", type: "range", min: 0.45, max: 2.6, step: 0.01, default: authoredDefaultValues.taperPower },
  warmLight: { key: "warmLight", label: "Orange strength", type: "range", min: 0, max: 1.65, step: 0.01, default: authoredDefaultValues.warmLight },
  warmSpread: { key: "warmSpread", label: "Orange width", type: "range", min: 0, max: 1.6, step: 0.01, default: authoredDefaultValues.warmSpread },
  orangePlumeX: { key: "orangePlumeX", label: "Orange X offset", type: "range", min: -1, max: 1, step: 0.01, default: authoredDefaultValues.orangePlumeX },
  orangePlumeY: { key: "orangePlumeY", label: "Orange Y offset", type: "range", min: -1, max: 1, step: 0.01, default: authoredDefaultValues.orangePlumeY },
  orangePlumeHeight: { key: "orangePlumeHeight", label: "Orange height", type: "range", min: 0.2, max: 2.4, step: 0.01, default: authoredDefaultValues.orangePlumeHeight },
  orangePlumeSoftness: { key: "orangePlumeSoftness", label: "Orange softness", type: "range", min: 0.35, max: 2.5, step: 0.01, default: authoredDefaultValues.orangePlumeSoftness },
  deepPressure: { key: "deepPressure", label: "Background depth", type: "range", min: 0.35, max: 1.65, step: 0.01, default: authoredDefaultValues.deepPressure },
  turbulence: { key: "turbulence", label: "Organic edge", type: "range", min: 0, max: 1.8, step: 0.01, default: authoredDefaultValues.turbulence },
  edgeSoftness: { key: "edgeSoftness", label: "Edge softness", type: "range", min: 0.04, max: 0.9, step: 0.01, default: authoredDefaultValues.edgeSoftness },
  noiseScale: { key: "noiseScale", label: "Noise scale", type: "range", min: 0.45, max: 2.8, step: 0.01, default: authoredDefaultValues.noiseScale },
  rise: { key: "rise", label: "Rising pull", type: "range", min: 0, max: 1.4, step: 0.01, default: authoredDefaultValues.rise },
  sway: { key: "sway", label: "Side sway", type: "range", min: 0, max: 4, step: 0.01, default: authoredDefaultValues.sway },
  colorIntensity: { key: "colorIntensity", label: "Colour intensity", type: "range", min: 0.75, max: 1.25, step: 0.01, default: authoredDefaultValues.colorIntensity },
  shaderContrast: { key: "shaderContrast", label: "Shader contrast", type: "range", min: 0.7, max: 1.8, step: 0.01, default: authoredDefaultValues.shaderContrast },
  shaderBlur: { key: "shaderBlur", label: "Base blur", type: "range", min: 0, max: 180, step: 1, default: authoredDefaultValues.shaderBlur, unit: "px" },
  surfaceBlurBoost: { key: "surfaceBlurBoost", label: "Non-heart blur boost", type: "range", min: 0, max: 240, step: 1, default: authoredDefaultValues.surfaceBlurBoost, unit: "px" },
  deepColor: { key: "deepColor", label: "Deep red", type: "color", default: authoredDefaultValues.deepColor },
  redColor: { key: "redColor", label: "Middle red", type: "color", default: authoredDefaultValues.redColor },
  orangeColor: { key: "orangeColor", label: "Orange light", type: "color", default: authoredDefaultValues.orangeColor },
  figmaExportGrade: { key: "figmaExportGrade", label: "Figma export grade", type: "checkbox", default: authoredDefaultValues.figmaExportGrade },
  logoShaderScale: { key: "logoShaderScale", label: "Logo animation scale", type: "range", min: 0.05, max: 5, step: 0.01, default: authoredDefaultValues.logoShaderScale },
  logoShaderX: { key: "logoShaderX", label: "Logo animation X", type: "range", min: -1, max: 1, step: 0.01, default: authoredDefaultValues.logoShaderX },
  logoShaderY: { key: "logoShaderY", label: "Logo animation Y", type: "range", min: -1, max: 1, step: 0.01, default: authoredDefaultValues.logoShaderY },
  logoShaderRotation: { key: "logoShaderRotation", label: "Logo rotation offset", type: "range", min: -180, max: 180, step: 1, default: authoredDefaultValues.logoShaderRotation, unit: "deg" },
  logoExportScale: { key: "logoExportScale", label: "Logo export size", type: "range", min: 0.25, max: 0.95, step: 0.01, default: authoredDefaultValues.logoExportScale },
  logoExportResolution: { key: "logoExportResolution", label: "Logo export resolution", type: "range", min: 1, max: 3, step: 1, default: authoredDefaultValues.logoExportResolution, unit: "x" },
  minimapContextScale: { key: "minimapContextScale", label: "Minimap context", type: "range", min: 2, max: 3, step: 0.05, default: authoredDefaultValues.minimapContextScale, unit: "x" },
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
  redPlumeX: (value) => `${Math.round(value * 100)}%`,
  redPlumeY: (value) => `${Math.round(value * 100)}%`,
  redExtraSway: (value) => value.toFixed(2),
  taperPower: (value) => value.toFixed(2),
  warmLight: (value) => value.toFixed(2),
  warmSpread: (value) => value.toFixed(2),
  orangePlumeX: (value) => `${Math.round(value * 100)}%`,
  orangePlumeY: (value) => `${Math.round(value * 100)}%`,
  orangePlumeHeight: (value) => value.toFixed(2),
  orangePlumeSoftness: (value) => value.toFixed(2),
  deepPressure: (value) => value.toFixed(2),
  turbulence: (value) => value.toFixed(2),
  edgeSoftness: (value) => value.toFixed(2),
  noiseScale: (value) => value.toFixed(2),
  rise: (value) => value.toFixed(2),
  sway: (value) => value.toFixed(2),
  colorIntensity: (value) => value.toFixed(2),
  shaderContrast: (value) => value.toFixed(2),
  shaderBlur: (value) => `${Math.round(value)}px`,
  surfaceBlurBoost: (value) => `${Math.round(value)}px`,
  deepColor: (value) => value,
  redColor: (value) => value,
  orangeColor: (value) => value,
  logoShaderScale: (value) => value.toFixed(2),
  logoShaderX: (value) => `${Math.round(value * 100)}%`,
  logoShaderY: (value) => `${Math.round(value * 100)}%`,
  logoShaderRotation: (value) => `${Math.round(value)}deg`,
  logoExportScale: (value) => `${Math.round(value * 100)}%`,
  logoExportResolution: (value) => `${Math.round(value)}x`,
  minimapContextScale: (value) => `${value.toFixed(2)}x`,
  figmaExportGrade: (value) => (value ? "On" : "Off"),
};

function createDefaultState() {
  return {
    preset: "A",
    ...structuredClone(presetById.get("A").values),
    logoShaderScale: authoredDefaultValues.logoShaderScale,
    logoShaderX: authoredDefaultValues.logoShaderX,
    logoShaderY: authoredDefaultValues.logoShaderY,
    logoShaderRotation: authoredDefaultValues.logoShaderRotation,
    logoExportScale: authoredDefaultValues.logoExportScale,
    logoExportResolution: authoredDefaultValues.logoExportResolution,
    minimapSurface: authoredDefaultValues.minimapSurface,
    minimapContextScale: authoredDefaultValues.minimapContextScale,
    figmaExportGrade: authoredDefaultValues.figmaExportGrade,
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
      <summary class="parameterizer-folder-title">${renderGroupIcon(group.icon)}<span>${group.title}</span></summary>
      <div class="parameterizer-folder-body">${rows}</div>
    </details>`;
  }).join("")}`;

  bindControls();
}

function renderGroupIcon(icon) {
  const paths = {
    target: '<circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="12" r="2"></circle><path d="M12 2v3M12 19v3M2 12h3M19 12h3"></path>',
    plume: '<path d="M6 17c5 1 10-2 12-8-4 1-7-1-9-4 0 5-4 6-5 9-.5 1.7.3 2.6 2 3Z"></path>',
    beam: '<path d="M4 15 18 5l2 2-10 14-2-5-4-1Z"></path>',
    wave: '<path d="M3 12c2.2-4 4.7-4 7 0s4.8 4 7 0c1.1-2 2.2-3 4-3"></path>',
    swatch: '<path d="M5 5h14v14H5z"></path><path d="M5 15h14"></path>',
    logo: '<path d="M12 5c4 0 7 3 7 7 0 5-7 8-7 8s-7-3-7-8c0-4 3-7 7-7Z"></path><path d="M12 8v8"></path>',
    map: '<path d="M5 6h14v14H5z"></path><path d="M9 10h6v6H9z"></path><path d="M3 4l2 2M21 4l-2 2M3 22l2-2M21 22l-2-2"></path>',
    grid: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"></path>',
    pause: '<path d="M8 5v14M16 5v14"></path>',
  };
  const path = paths[icon] ?? paths.target;
  return `<svg class="parameterizer-folder-icon" viewBox="0 0 24 24" aria-hidden="true">${path}</svg>`;
}

function renderExplanation() {
  return `<section class="shader-explainer" aria-label="Shader explanation">
    <div class="effect-overview-title">What this is showing</div>
    <p>This demo is now one flame shader. A-D are close presets around the current flame direction, not separate effects.</p>
    <p>The shader starts with a deep-red field, builds one responsive red plume through the middle, then lets a smaller orange plume peek from the upper-right. No white or extra red is used inside the animated artwork.</p>
    <p>The preview, PNG export, and MP4 export now use the same post-processed shader path. Logo Mapping remaps the flame inside the logo mask, while the minimap shows the wider shader field around the selected crop.</p>
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

  if (control.type === "color") {
    return `<label class="parameterizer-row parameterizer-row-color" for="${id}">
      <span class="parameterizer-label" title="${control.label}">${control.label}</span>
      <input class="parameterizer-control parameterizer-color" id="${id}" type="color" value="${value}" data-control-key="${control.key}">
      <output class="parameterizer-value" data-value-for="${control.key}">${formatValue(control.key, value)}</output>
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
      if (definition.type === "color") value = normalizeHexColor(value, definition.default);

      setStateValue(key, value);
      if (!key.startsWith("surfaces.") && key !== "minimapContextScale" && key !== "reducedMotion" && key !== "contrastSafe" && key !== "paused" && key !== "figmaExportGrade") {
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
    return valuesMatch(getStateValue(key), value);
  }))?.id;
}

function valuesMatch(current, expected) {
  if (typeof expected === "string") {
    return String(current).toLowerCase() === expected.toLowerCase();
  }
  return Math.abs(Number(current) - Number(expected)) < 0.001;
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
  syncMinimapControls();
  isRendering = false;
}

function syncSurfaceDisabledState() {
  controlsRoot.querySelectorAll('[data-control-key^="surfaces."]:not([data-control-key="surfaces.all"])').forEach((toggle) => {
    toggle.disabled = !state.surfaces.all;
  });
}

function syncMinimapControls() {
  minimapButtons.forEach((button) => {
    const active = button.dataset.minimapSurface === state.minimapSurface;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function updateDerivedVariables() {
  const deepRgb = hexToRgb255(state.deepColor);
  const redRgb = hexToRgb255(state.redColor);
  const orangeRgb = hexToRgb255(state.orangeColor);
  prototype.style.setProperty("--aha-deep-red", state.deepColor);
  prototype.style.setProperty("--aha-red", state.redColor);
  prototype.style.setProperty("--aha-orange", state.orangeColor);
  prototype.style.setProperty("--aha-deep-red-rgb", `${deepRgb.r} ${deepRgb.g} ${deepRgb.b}`);
  prototype.style.setProperty("--aha-red-rgb", `${redRgb.r} ${redRgb.g} ${redRgb.b}`);
  prototype.style.setProperty("--aha-orange-rgb", `${orangeRgb.r} ${orangeRgb.g} ${orangeRgb.b}`);
  prototype.style.setProperty("--lg-duration", `${state.duration.toFixed(2)}s`);
  prototype.style.setProperty("--lg-evolution-speed", state.evolutionSpeed.toFixed(2));
  prototype.style.setProperty("--lg-flame-scale", state.flameScale.toFixed(2));
  prototype.style.setProperty("--lg-flame-rotation", `${Math.round(state.flameRotation)}deg`);
  prototype.style.setProperty("--lg-flame-x", `${Math.round(state.flameX * 100)}%`);
  prototype.style.setProperty("--lg-flame-y", `${Math.round(state.flameY * 100)}%`);
  prototype.style.setProperty("--lg-flame-width", state.flameWidth.toFixed(2));
  prototype.style.setProperty("--lg-flame-height", state.flameHeight.toFixed(2));
  prototype.style.setProperty("--lg-flame-strength", state.flameStrength.toFixed(2));
  prototype.style.setProperty("--lg-red-plume-x", `${Math.round(state.redPlumeX * 100)}%`);
  prototype.style.setProperty("--lg-red-plume-y", `${Math.round(state.redPlumeY * 100)}%`);
  prototype.style.setProperty("--lg-red-extra-sway", state.redExtraSway.toFixed(2));
  prototype.style.setProperty("--lg-taper-power", state.taperPower.toFixed(2));
  prototype.style.setProperty("--lg-warm-light", state.warmLight.toFixed(2));
  prototype.style.setProperty("--lg-warm-spread", state.warmSpread.toFixed(2));
  prototype.style.setProperty("--lg-orange-plume-x", `${Math.round(state.orangePlumeX * 100)}%`);
  prototype.style.setProperty("--lg-orange-plume-y", `${Math.round(state.orangePlumeY * 100)}%`);
  prototype.style.setProperty("--lg-orange-plume-height", state.orangePlumeHeight.toFixed(2));
  prototype.style.setProperty("--lg-orange-plume-softness", state.orangePlumeSoftness.toFixed(2));
  prototype.style.setProperty("--lg-deep-pressure", state.deepPressure.toFixed(2));
  prototype.style.setProperty("--lg-organic-edge", state.turbulence.toFixed(2));
  prototype.style.setProperty("--lg-edge-softness", state.edgeSoftness.toFixed(2));
  prototype.style.setProperty("--lg-noise-scale", state.noiseScale.toFixed(2));
  prototype.style.setProperty("--lg-rise", state.rise.toFixed(2));
  prototype.style.setProperty("--lg-sway", state.sway.toFixed(2));
  prototype.style.setProperty("--lg-color-intensity", state.colorIntensity.toFixed(2));
  prototype.style.setProperty("--lg-shader-contrast", state.shaderContrast.toFixed(2));
  prototype.style.setProperty("--lg-shader-blur", `${Math.round(state.shaderBlur)}px`);
  prototype.style.setProperty("--lg-surface-blur-boost", `${Math.round(state.surfaceBlurBoost)}px`);
  prototype.style.setProperty("--lg-minimap-context-scale", state.minimapContextScale.toFixed(2));
  prototype.style.setProperty("--lg-minimap-crop-size", `${(100 / Math.max(state.minimapContextScale, 0.1)).toFixed(3)}%`);
  prototype.style.setProperty("--lg-logo-shader-scale", state.logoShaderScale.toFixed(2));
  prototype.style.setProperty("--lg-logo-shader-x", `${Math.round(state.logoShaderX * 100)}%`);
  prototype.style.setProperty("--lg-logo-shader-y", `${Math.round(state.logoShaderY * 100)}%`);
  prototype.style.setProperty("--lg-logo-shader-rotation", `${Math.round(state.logoShaderRotation)}deg`);
  prototype.style.setProperty("--lg-logo-export-scale", state.logoExportScale.toFixed(2));
  prototype.style.setProperty("--lg-logo-export-resolution", state.logoExportResolution.toFixed(0));
  syncSurfaceBlurVariables();
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
    const enabled = surfaceName === "minimap" || Boolean(globalEnabled && state.surfaces[surfaceName]);
    surface.classList.toggle("is-surface-off", !enabled);
  });
}

function syncSurfaceBlurVariables() {
  gradients.forEach((surface) => {
    surface.style.setProperty("--lg-effective-shader-blur", `${getRawSurfaceShaderBlur(surface)}px`);
  });
}

function getRawSurfaceShaderBlur(surface) {
  const surfaceName = typeof surface === "string" ? surface : surface?.dataset?.surface;
  const base = Math.max(0, Math.round(Number(state.shaderBlur) || 0));
  const boost = surfaceName === "logo" ? 0 : Math.max(0, Math.round(Number(state.surfaceBlurBoost) || 0));
  return base + boost;
}

function canUseWebGL() {
  if (shaderRuntime.webglAvailable !== null) return shaderRuntime.webglAvailable;
  const canvas = document.createElement("canvas");
  const gl = getWebGLContext(canvas, {
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
  const active = canUseWebGL();
  const globalEnabled = state.surfaces.all;

  gradients.forEach((surface) => {
    const surfaceName = surface.dataset.surface;
    const enabled = surfaceName === "minimap" ? active : active && globalEnabled && state.surfaces[surfaceName];
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

  const gl = getWebGLContext(canvas, {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
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
  cleanupExportPostPipeline(item.gl, item.postPipeline);
  item.canvas.remove();
  shaderRuntime.items.delete(surface);
}

const shaderFragmentSource = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

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
  uniform float u_red_plume_x;
  uniform float u_red_plume_y;
  uniform float u_taper_power;
  uniform float u_warm;
  uniform float u_warm_spread;
  uniform float u_orange_plume_x;
  uniform float u_orange_plume_y;
  uniform float u_orange_plume_height;
  uniform float u_orange_plume_softness;
  uniform float u_deep;
  uniform float u_turbulence;
  uniform float u_edge_softness;
  uniform float u_noise_scale;
  uniform float u_rise;
  uniform float u_sway;
  uniform float u_red_extra_sway;
  uniform float u_energy;
  uniform float u_contrast;
  uniform vec3 u_deep_color;
  uniform vec3 u_red_color;
  uniform vec3 u_orange_color;

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
    float loopPhase = fract(t * max(u_speed, 0.01) / max(u_cycle, 1.0));
    float loopAngle = loopPhase * 6.28318530718;
    float loopSin = sin(loopAngle);
    float loopCos = cos(loopAngle);
    float loopRadius = (0.35 + max(u_rise, 0.02) * 0.45) * max(u_speed, 0.08);
    vec2 center = vec2(u_flame_x, u_flame_y);
    vec2 p = uv - center;
    p.x *= aspect;
    float rotation = radians(u_rotation);
    float s = sin(rotation);
    float c = cos(rotation);
    p = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
    p /= max(u_scale, 0.01);

    float drift = (fbm(vec2(loopSin * 0.36 * loopRadius, loopCos * 0.36 * loopRadius + 0.37)) - 0.5) * 0.18 * u_sway;
    p.x -= drift;

    vec2 redP = p - vec2(u_red_plume_x, u_red_plume_y);
    float vertical = clamp((redP.y / max(u_flame_height, 0.01)) + 0.56, 0.0, 1.0);
    float activeHeight = smoothstep(0.02, 0.18, vertical) * (1.0 - smoothstep(0.97, 1.0, vertical));
    float taper = mix(max(u_flame_width, 0.01), max(u_flame_width, 0.01) * 0.13, pow(vertical, max(u_taper_power, 0.01)));
    float noiseScale = max(u_noise_scale, 0.01);
    float spineNoise = fbm(vec2(vertical * 1.8 * noiseScale + loopSin * 0.8 * loopRadius, loopCos * 0.8 * loopRadius));
    float spine = (spineNoise - 0.5) * taper * 0.7 * u_sway;
    float redSwayNoise = fbm(vec2(vertical * 2.4 * noiseScale + loopCos * 0.64 * loopRadius, loopSin * 0.52 * loopRadius + 2.1));
    float redSwayBoost = (loopSin * 0.075 + (redSwayNoise - 0.5) * 0.11) * taper * u_red_extra_sway;
    float redSpine = spine + redSwayBoost;
    float x = redP.x - redSpine;
    float edge = abs(x) / max(taper, 0.001);
    float largeNoise = fbm(vec2(x * 2.0 * noiseScale + loopSin * 0.32 * loopRadius, vertical * 2.35 * noiseScale + loopCos * 0.6 * loopRadius));
    float fineNoise = fbm(vec2(x * 4.6 * noiseScale + loopSin * 0.75 * loopRadius, vertical * 4.4 * noiseScale + loopCos * 0.9 * loopRadius));
    float organicEdge = edge - (largeNoise - 0.5) * 0.3 * u_turbulence - (fineNoise - 0.5) * 0.08 * u_turbulence;

    float redStart = clamp(0.56 - u_edge_softness * 0.2, 0.24, 0.86);
    float redEnd = clamp(redStart + 0.32 + u_edge_softness * 1.12, redStart + 0.08, 1.7);
    float redPlume = (1.0 - smoothstep(redStart, redEnd, organicEdge)) * activeHeight;
    redPlume *= u_flame_strength * mix(0.84, 1.08, breath);
    redPlume *= mix(1.08, 0.84, clamp((u_deep - 0.35) / 1.3, 0.0, 1.0));
    redPlume = clamp(redPlume, 0.0, 0.96);

    vec2 orangeP = p - vec2(u_orange_plume_x, u_orange_plume_y);
    float orangeVertical = clamp((orangeP.y / max(u_flame_height * u_orange_plume_height, 0.01)) + 0.56, 0.0, 1.0);
    float orangeX = orangeP.x - spine;
    float orangeNoise = fbm(vec2(orangeX * 2.8 * noiseScale + loopSin * 0.56 * loopRadius, orangeVertical * 3.2 * noiseScale + loopCos * 0.72 * loopRadius));
    float orangeCenter = taper * (0.18 + (orangeNoise - 0.5) * 0.36);
    float orangeWidth = max(taper * mix(0.16, 0.48, clamp(u_warm_spread / 1.6, 0.0, 1.0)), 0.006);
    float orangeEdge = abs(orangeX - orangeCenter) / orangeWidth;
    float orangeBandSize = clamp(0.24 * u_orange_plume_height, 0.08, 0.48);
    float orangeBand = 1.0 - smoothstep(0.82, 1.08, abs(orangeVertical - 0.62) / orangeBandSize);
    float orangeSoftness = max(u_orange_plume_softness, 0.01);
    float orangePlume = (1.0 - smoothstep(0.42 - (orangeSoftness - 1.0) * 0.08, 1.18 + u_edge_softness * 0.42 * orangeSoftness, orangeEdge - (orangeNoise - 0.5) * 0.2 * u_turbulence));
    orangePlume *= redPlume * orangeBand * u_warm * mix(0.78, 1.18, breath);
    orangePlume = clamp(orangePlume, 0.0, 0.92);

    float intensity = clamp(u_energy, 0.75, 1.25);
    vec3 color = u_deep_color;
    color = mix(color, u_red_color, redPlume);
    color = mix(color, u_orange_color, orangePlume);
    color = mix(u_deep_color, color, clamp(0.78 + (intensity - 0.75) * 0.44, 0.78, 1.0));
    return clamp(u_red_color + (color - u_red_color) * clamp(u_contrast, 0.7, 1.8), 0.0, 1.0);
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

const textureVertexSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const exportBlurFragmentSource = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;

  uniform sampler2D u_texture;
  uniform vec2 u_resolution;
  uniform vec2 u_direction;
  uniform float u_radius;

  void main() {
    vec2 stepSize = u_direction * u_radius / max(u_resolution, vec2(1.0));
    vec4 color = texture2D(u_texture, v_uv) * 0.208;
    float total = 0.208;

    for (int i = 1; i <= 7; i++) {
      float progress = float(i) / 7.0;
      float weight = exp(-4.5 * progress * progress);
      vec2 offset = stepSize * progress;
      color += texture2D(u_texture, v_uv + offset) * weight;
      color += texture2D(u_texture, v_uv - offset) * weight;
      total += weight * 2.0;
    }

    gl_FragColor = color / total;
  }
`;

const exportGradeFragmentSource = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif

  varying vec2 v_uv;

  uniform sampler2D u_texture;
  uniform float u_enabled;
  uniform vec3 u_deep_color;
  uniform float u_exposure;
  uniform float u_shadow_mix;
  uniform float u_orange_luminance_cap;
  uniform float u_saturation;

  float luma(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
  }

  void main() {
    vec4 sampleColor = texture2D(u_texture, v_uv);
    vec3 color = sampleColor.rgb;

    if (u_enabled > 0.5) {
      float originalLuma = luma(color);

      float shadowMask = 1.0 - smoothstep(0.05, 0.62, originalLuma);
      vec3 shadowTarget = min(color, u_deep_color);
      color = mix(color, shadowTarget, shadowMask * u_shadow_mix);

      float orangeMask = smoothstep(0.08, 0.52, color.g - color.b) * smoothstep(0.18, 0.72, color.r - color.b);
      float currentLuma = max(luma(color), 0.001);
      float capScale = min(1.0, u_orange_luminance_cap / currentLuma);
      color = mix(color, color * capScale, orangeMask);

      float gray = luma(color);
      color = mix(vec3(gray), color, u_saturation);
      color *= u_exposure;
      color = clamp(color, 0.0, 1.0);
    }

    gl_FragColor = vec4(color, sampleColor.a);
  }
`;

function createTextureProgram(gl, fragmentSource) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, textureVertexSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

function drawShadersOnce(now = performance.now()) {
  shaderRuntime.items.forEach((item, surface) => drawShaderItem(item, surface, now));
}

function drawShaderItem(item, surface, now) {
  drawShaderItemAtTime(item, surface, getShaderTime(now));
}

function drawShaderItemAtTime(item, surface, shaderTime) {
  const rect = item.canvas.getBoundingClientRect();
  const renderScale = 1;
  const dpr = capPreviewRenderScale(rect, getPreviewRenderScale(surface));
  const width = Math.max(1, Math.round(rect.width * renderScale * dpr));
  const height = Math.max(1, Math.round(rect.height * renderScale * dpr));
  const blurMetadata = getSurfaceBlurMetadata(surface, width, height, dpr, "preview");
  const blur = blurMetadata.effectiveShaderBlur;
  const colorGrade = getExportColorGrade();

  if (item.canvas.width !== width || item.canvas.height !== height) {
    item.canvas.width = width;
    item.canvas.height = height;
  }

  syncPostPipeline(item, width, height, blur, colorGrade);
  item.blur = blur;
  item.blurMetadata = blurMetadata;
  item.colorGrade = colorGrade;

  if (item.postPipeline) {
    item.gl.bindFramebuffer(item.gl.FRAMEBUFFER, item.postPipeline.sourceFramebuffer);
  }

  drawShaderRenderer(item, shaderTime, width, height, getSurfaceShaderOverrides(surface));

  if (item.postPipeline) {
    item.gl.bindFramebuffer(item.gl.FRAMEBUFFER, null);
  }

  bakeExportPostProcessing(item);
  finishExportSource(item);
}

function getPreviewRenderScale(surface) {
  const rect = surface.getBoundingClientRect();
  const fallback = Math.min(window.devicePixelRatio || 1, 2);
  if (rect.width <= 0 || rect.height <= 0) return fallback;

  if (surface.matches(BACKGROUND_EXPORT_SELECTOR)) {
    return capPreviewRenderScale(rect, Math.max(1, EXPORT_WIDTH / rect.width, EXPORT_HEIGHT / rect.height));
  }

  if (surface.matches(LOGO_EXPORT_SELECTOR)) {
    const logoResolution = getLogoExportResolution();
    const exportRect = getSingleLogoExportRectForAspect(getSurfaceAspect(surface, LOGO_EXPORT_FALLBACK_ASPECT), LOGO_EXPORT_WIDTH * logoResolution, LOGO_EXPORT_HEIGHT * logoResolution);
    return capPreviewRenderScale(rect, Math.max(1, exportRect.width / rect.width, exportRect.height / rect.height));
  }

  return capPreviewRenderScale(rect, fallback);
}

function capPreviewRenderScale(rect, scale) {
  const widthCap = MAX_PREVIEW_CANVAS_SIZE / Math.max(rect.width, 1);
  const heightCap = MAX_PREVIEW_CANVAS_SIZE / Math.max(rect.height, 1);
  return Math.max(1, Math.min(scale, widthCap, heightCap));
}

function getShaderTime(now = performance.now()) {
  if (!state.reducedMotion) return (now - shaderRuntime.origin) / 1000;
  return (state.duration * REDUCED_MOTION_STATIC_PHASE) / Math.max(state.evolutionSpeed, 0.01);
}

function createShaderRenderer(gl, canvas, program, buffer) {
  return {
    canvas,
    gl,
    program,
    buffer,
    postPipeline: null,
    postPipelineWidth: 0,
    postPipelineHeight: 0,
    blur: 0,
    blurMetadata: null,
    colorGrade: getExportColorGrade(),
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
      redPlumeX: gl.getUniformLocation(program, "u_red_plume_x"),
      redPlumeY: gl.getUniformLocation(program, "u_red_plume_y"),
      taperPower: gl.getUniformLocation(program, "u_taper_power"),
      warm: gl.getUniformLocation(program, "u_warm"),
      warmSpread: gl.getUniformLocation(program, "u_warm_spread"),
      orangePlumeX: gl.getUniformLocation(program, "u_orange_plume_x"),
      orangePlumeY: gl.getUniformLocation(program, "u_orange_plume_y"),
      orangePlumeHeight: gl.getUniformLocation(program, "u_orange_plume_height"),
      orangePlumeSoftness: gl.getUniformLocation(program, "u_orange_plume_softness"),
      deep: gl.getUniformLocation(program, "u_deep"),
      turbulence: gl.getUniformLocation(program, "u_turbulence"),
      edgeSoftness: gl.getUniformLocation(program, "u_edge_softness"),
      noiseScale: gl.getUniformLocation(program, "u_noise_scale"),
      rise: gl.getUniformLocation(program, "u_rise"),
      sway: gl.getUniformLocation(program, "u_sway"),
      redExtraSway: gl.getUniformLocation(program, "u_red_extra_sway"),
      energy: gl.getUniformLocation(program, "u_energy"),
      contrast: gl.getUniformLocation(program, "u_contrast"),
      deepColor: gl.getUniformLocation(program, "u_deep_color"),
      redColor: gl.getUniformLocation(program, "u_red_color"),
      orangeColor: gl.getUniformLocation(program, "u_orange_color"),
    },
  };
}

function getSurfaceShaderOverrides(surface) {
  if (surface.dataset.surface === "logo") return getLogoShaderOverrides();
  if (surface.dataset.surface === "minimap") return getMinimapShaderOverrides();
  return null;
}

function getLogoShaderOverrides() {
  return {
    scale: state.flameScale * state.logoShaderScale,
    flameX: state.flameX + state.logoShaderX,
    flameY: state.flameY + state.logoShaderY,
    rotation: state.flameRotation + state.logoShaderRotation,
  };
}

function getMinimapShaderOverrides() {
  const contextScale = Math.max(2, Math.min(3, Number(state.minimapContextScale) || 3));
  const selectedSurface = MINIMAP_SURFACES.includes(state.minimapSurface) ? state.minimapSurface : "logo";
  const base = selectedSurface === "logo" ? getLogoShaderOverrides() : {};
  const baseScale = base.scale ?? state.flameScale;
  const baseX = base.flameX ?? state.flameX;
  const baseY = base.flameY ?? state.flameY;
  return {
    ...base,
    scale: baseScale / contextScale,
    flameX: 0.5 + ((baseX - 0.5) / contextScale),
    flameY: 0.5 + ((baseY - 0.5) / contextScale),
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
    redPlumeX: state.redPlumeX,
    redPlumeY: state.redPlumeY,
    warm: state.warmLight,
    deep: state.deepPressure,
    turbulence: state.turbulence,
    taperPower: state.taperPower,
    warmSpread: state.warmSpread,
    orangePlumeX: state.orangePlumeX,
    orangePlumeY: state.orangePlumeY,
    orangePlumeHeight: state.orangePlumeHeight,
    orangePlumeSoftness: state.orangePlumeSoftness,
    edgeSoftness: state.edgeSoftness,
    noiseScale: state.noiseScale,
    rise: state.rise,
    sway: state.sway,
    redExtraSway: state.redExtraSway,
    energy: state.colorIntensity,
    contrast: state.shaderContrast,
    deepColor: hexToRgbUnit(state.deepColor),
    redColor: hexToRgbUnit(state.redColor),
    orangeColor: hexToRgbUnit(state.orangeColor),
    ...(overrides ?? {}),
  };
}

function drawShaderRenderer(item, shaderTime, width = item.canvas.width, height = item.canvas.height, overrides = null) {
  const params = getShaderParameters(overrides);
  const gl = item.gl;
  applyWebGLColorSpace(gl);
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
  gl.uniform1f(item.uniforms.redPlumeX, params.redPlumeX);
  gl.uniform1f(item.uniforms.redPlumeY, params.redPlumeY);
  gl.uniform1f(item.uniforms.warm, params.warm);
  gl.uniform1f(item.uniforms.deep, params.deep);
  gl.uniform1f(item.uniforms.turbulence, params.turbulence);
  gl.uniform1f(item.uniforms.taperPower, params.taperPower);
  gl.uniform1f(item.uniforms.warmSpread, params.warmSpread);
  gl.uniform1f(item.uniforms.orangePlumeX, params.orangePlumeX);
  gl.uniform1f(item.uniforms.orangePlumeY, params.orangePlumeY);
  gl.uniform1f(item.uniforms.orangePlumeHeight, params.orangePlumeHeight);
  gl.uniform1f(item.uniforms.orangePlumeSoftness, params.orangePlumeSoftness);
  gl.uniform1f(item.uniforms.edgeSoftness, params.edgeSoftness);
  gl.uniform1f(item.uniforms.noiseScale, params.noiseScale);
  gl.uniform1f(item.uniforms.rise, params.rise);
  gl.uniform1f(item.uniforms.sway, params.sway);
  gl.uniform1f(item.uniforms.redExtraSway, params.redExtraSway);
  gl.uniform1f(item.uniforms.energy, params.energy);
  gl.uniform1f(item.uniforms.contrast, params.contrast);
  gl.uniform3fv(item.uniforms.deepColor, params.deepColor);
  gl.uniform3fv(item.uniforms.redColor, params.redColor);
  gl.uniform3fv(item.uniforms.orangeColor, params.orangeColor);
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
    ["--aha-deep-red", state.deepColor],
    ["--aha-red", state.redColor],
    ["--aha-orange", state.orangeColor],
    ["--lg-duration", `${state.duration.toFixed(2)}s`],
    ["--lg-evolution-speed", state.evolutionSpeed.toFixed(2)],
    ["--lg-flame-scale", state.flameScale.toFixed(2)],
    ["--lg-flame-rotation", `${Math.round(state.flameRotation)}deg`],
    ["--lg-flame-x", `${Math.round(state.flameX * 100)}%`],
    ["--lg-flame-y", `${Math.round(state.flameY * 100)}%`],
    ["--lg-flame-width", state.flameWidth.toFixed(2)],
    ["--lg-flame-height", state.flameHeight.toFixed(2)],
    ["--lg-flame-strength", state.flameStrength.toFixed(2)],
    ["--lg-red-plume-x", `${Math.round(state.redPlumeX * 100)}%`],
    ["--lg-red-plume-y", `${Math.round(state.redPlumeY * 100)}%`],
    ["--lg-red-extra-sway", state.redExtraSway.toFixed(2)],
    ["--lg-taper-power", state.taperPower.toFixed(2)],
    ["--lg-warm-light", state.warmLight.toFixed(2)],
    ["--lg-warm-spread", state.warmSpread.toFixed(2)],
    ["--lg-orange-plume-x", `${Math.round(state.orangePlumeX * 100)}%`],
    ["--lg-orange-plume-y", `${Math.round(state.orangePlumeY * 100)}%`],
    ["--lg-orange-plume-height", state.orangePlumeHeight.toFixed(2)],
    ["--lg-orange-plume-softness", state.orangePlumeSoftness.toFixed(2)],
    ["--lg-deep-pressure", state.deepPressure.toFixed(2)],
    ["--lg-organic-edge", state.turbulence.toFixed(2)],
    ["--lg-edge-softness", state.edgeSoftness.toFixed(2)],
    ["--lg-noise-scale", state.noiseScale.toFixed(2)],
    ["--lg-rise", state.rise.toFixed(2)],
    ["--lg-sway", state.sway.toFixed(2)],
    ["--lg-color-intensity", state.colorIntensity.toFixed(2)],
    ["--lg-shader-contrast", state.shaderContrast.toFixed(2)],
    ["--lg-shader-blur", `${Math.round(state.shaderBlur)}px`],
    ["--lg-surface-blur-boost", `${Math.round(state.surfaceBlurBoost)}px`],
    ["--lg-minimap-context-scale", state.minimapContextScale.toFixed(2)],
  ];
}

function logoCustomProperties() {
  return [
    ["--lg-logo-shader-scale", state.logoShaderScale.toFixed(2)],
    ["--lg-logo-shader-x", `${Math.round(state.logoShaderX * 100)}%`],
    ["--lg-logo-shader-y", `${Math.round(state.logoShaderY * 100)}%`],
    ["--lg-logo-shader-rotation", `${Math.round(state.logoShaderRotation)}deg`],
    ["--lg-logo-export-scale", state.logoExportScale.toFixed(2)],
    ["--lg-logo-export-resolution", `${Math.round(state.logoExportResolution)}x`],
  ];
}

function buildConfigExport() {
  return JSON.stringify({
    schema: CONFIG_SCHEMA,
    updated: "2026-06-30",
    visualMode: "flame",
    exportColorSpace: EXPORT_COLOR_SPACE,
    exportColorProfile: EXPORT_COLOR_PROFILE,
    exportColorManagement: "Browser export canvases and WebGL buffers are forced to sRGB where supported before MediaRecorder capture.",
    mp4ColorMetadata: EXPORT_MP4_COLOR_METADATA,
    exportColorGrade: getExportColorGrade(),
    backgroundExportQuality: {
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      fps: EXPORT_FPS,
      videoBitsPerSecond: BACKGROUND_EXPORT_BITRATE,
      browserMp4Limit: "MediaRecorder MP4 is typically 8-bit H.264; this lab improves quality through higher resolution, bitrate, sRGB metadata, and baked blur.",
    },
    backgroundHqMp4Export: getBackgroundHqMp4ExportPlan(),
    backgroundExportBlur: getBackgroundExportBlurMetadata(EXPORT_WIDTH, EXPORT_HEIGHT),
    logoExportBlur: getLogoExportBlurMetadata(LOGO_EXPORT_WIDTH * getLogoExportResolution(), LOGO_EXPORT_HEIGHT * getLogoExportResolution()),
    minimap: {
      surface: state.minimapSurface,
      contextScale: state.minimapContextScale,
      cropSizePercent: Number((100 / Math.max(state.minimapContextScale, 0.1)).toFixed(3)),
      exportTarget: false,
    },
    previewExportParity: getCurrentPreviewExportMetadata(),
    preset: state.preset,
    state,
  }, null, 2);
}

function getCurrentPreviewExportMetadata() {
  const logoResolution = getLogoExportResolution();
  const logoWidth = LOGO_EXPORT_WIDTH * logoResolution;
  const logoHeight = LOGO_EXPORT_HEIGHT * logoResolution;
  return {
    background: {
      previewRect: getElementRectMetadata(document.querySelector(BACKGROUND_EXPORT_SELECTOR)),
      exportRect: { x: 0, y: 0, width: EXPORT_WIDTH, height: EXPORT_HEIGHT },
      blur: getBackgroundExportBlurMetadata(EXPORT_WIDTH, EXPORT_HEIGHT),
      colorGrade: getExportColorGrade(),
    },
    logo: {
      previewRect: getElementRectMetadata(document.querySelector(LOGO_EXPORT_SELECTOR)),
      export: getLogoExportBlurMetadata(logoWidth, logoHeight),
      colorGrade: getExportColorGrade(),
      transparentPng: true,
    },
  };
}

function getElementRectMetadata(element) {
  const rect = element?.getBoundingClientRect();
  if (!rect) return { x: 0, y: 0, width: 0, height: 0 };
  return {
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
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
  const cycleSeconds = state.duration / Math.max(state.evolutionSpeed, 0.1);
  const minSeconds = target === "logo" ? LOGO_EXPORT_MIN_SECONDS : BACKGROUND_EXPORT_MIN_SECONDS;
  const loopCycles = Math.max(1, Math.ceil(minSeconds / Math.max(cycleSeconds, 0.1)));
  const seconds = clamp(cycleSeconds * loopCycles, minSeconds, EXPORT_MAX_SECONDS);
  const roundedSeconds = Number(seconds.toFixed(2));
  const logoResolution = getLogoExportResolution();
  const width = target === "logo" ? LOGO_EXPORT_WIDTH * logoResolution : EXPORT_WIDTH;
  const height = target === "logo" ? LOGO_EXPORT_HEIGHT * logoResolution : EXPORT_HEIGHT;
  return {
    target,
    mode: "flame",
    label: exportPlanLabel(target),
    seconds: roundedSeconds,
    cycleSeconds: Number(cycleSeconds.toFixed(4)),
    loopCycles,
    loopAligned: Math.abs(seconds - cycleSeconds * loopCycles) < 0.001,
    frames: Math.ceil(roundedSeconds * EXPORT_FPS),
    fps: EXPORT_FPS,
    width,
    height,
    mimeType: getSupportedMp4MimeType(),
    videoBitsPerSecond: getExportBitrate(target, logoResolution),
    colorSpace: EXPORT_COLOR_SPACE,
    colorProfile: EXPORT_COLOR_PROFILE,
    mp4ColorMetadata: EXPORT_MP4_COLOR_METADATA,
    logoExportResolution: target === "logo" ? logoResolution : 1,
    startTime: getShaderTime(),
  };
}

function getBackgroundHqMp4ExportPlan() {
  const cycleSeconds = state.duration / Math.max(state.evolutionSpeed, 0.1);
  const cycleFrames = Math.max(1, Math.round(cycleSeconds * EXPORT_FPS));
  const minFrames = Math.ceil(BACKGROUND_EXPORT_MIN_SECONDS * EXPORT_FPS);
  const maxFrames = Math.floor(EXPORT_MAX_SECONDS * EXPORT_FPS);
  const loopCycles = Math.max(1, Math.ceil(minFrames / cycleFrames));
  const unclampedFrames = cycleFrames * loopCycles;
  const frames = Math.min(unclampedFrames, maxFrames);
  const seconds = frames / EXPORT_FPS;
  const blur = getBackgroundExportBlurMetadata(EXPORT_WIDTH, EXPORT_HEIGHT);
  return {
    target: "background",
    mode: "flame",
    label: `${exportPlanLabel("background")} HQ FFmpeg`,
    filename: HQ_MP4_FILENAME,
    width: EXPORT_WIDTH,
    height: EXPORT_HEIGHT,
    fps: EXPORT_FPS,
    frames,
    seconds: Number(seconds.toFixed(4)),
    sourceCycleSeconds: Number(cycleSeconds.toFixed(4)),
    cycleFrames,
    cycleFrameSeconds: Number((cycleFrames / EXPORT_FPS).toFixed(4)),
    loopCycles,
    loopAligned: frames === unclampedFrames,
    truncatedByMaxSeconds: frames !== unclampedFrames,
    startTime: 0,
    colorSpace: EXPORT_COLOR_SPACE,
    colorProfile: EXPORT_COLOR_PROFILE,
    colorGrade: getExportColorGrade(),
    blur,
    encoder: HQ_MP4_ENCODER,
  };
}

function getExportBitrate(target, logoResolution = 1) {
  return target === "logo" ? LOGO_EXPORT_BASE_BITRATE * logoResolution : BACKGROUND_EXPORT_BITRATE;
}

function getLogoExportResolution() {
  return Math.max(1, Math.min(3, Math.round(Number(state.logoExportResolution) || 1)));
}

function exportPlanLabel(target) {
  const presetLabel = state.preset === "Custom" ? "Custom Flame" : `Preset ${state.preset} Flame`;
  return target === "logo" ? `${presetLabel} Logo` : `${presetLabel} Background`;
}

async function exportCurrentGradientPng(target = "background") {
  const plan = getExportPlan(target);
  let renderer;
  try {
    renderer = target === "logo"
      ? await createLogoExportShaderRenderer(plan.width, plan.height, { transparent: true })
      : createExportShaderRenderer(plan.width, plan.height);
  } catch (error) {
    copyStatus.textContent = error.message || "PNG export could not start.";
    return;
  }
  if (!renderer) {
    copyStatus.textContent = "PNG export could not start because the WebGL export renderer is unavailable.";
    return;
  }

  setExportButtonsDisabled(true);
  copyStatus.textContent = `Exporting ${plan.label} PNG (${plan.width}x${plan.height})...`;
  try {
    drawExportFrame(renderer, 0, plan);
    const blob = target === "logo"
      ? canvasToNeutralAlphaPngBlob(renderer.canvas)
      : await canvasToBlob(renderer.canvas, "image/png");
    const filename = target === "logo"
      ? `aha-living-gradient-logo-${plan.logoExportResolution}x-transparent.png`
      : "aha-living-gradient-background-2160x1620.png";
    downloadBlob(blob, filename);
    copyStatus.textContent = target === "logo"
      ? `Exported ${filename} with transparent alpha and neutral transparent pixels.`
      : `Exported ${filename} as the WYSIWYG sRGB background still.`;
  } catch (error) {
    copyStatus.textContent = error.message || "PNG export failed.";
  } finally {
    cleanupExportShaderRenderer(renderer);
    setExportButtonsDisabled(false);
  }
}

async function exportCurrentBackgroundHqMp4() {
  const plan = getBackgroundHqMp4ExportPlan();
  let renderer;
  let sessionId = "";
  try {
    renderer = createExportShaderRenderer(plan.width, plan.height);
  } catch (error) {
    copyStatus.textContent = error.message || "HQ MP4 export could not start.";
    return;
  }
  if (!renderer) {
    copyStatus.textContent = "HQ MP4 export could not start because the WebGL export renderer is unavailable.";
    return;
  }

  setExportButtonsDisabled(true);
  copyStatus.textContent = `Preparing HQ FFmpeg export (${plan.width}x${plan.height}, ${plan.fps}fps, ${plan.seconds.toFixed(2)}s)...`;

  try {
    const session = await startHqMp4Session(plan);
    sessionId = session.sessionId;
    const progressStep = Math.max(1, Math.floor(plan.frames / 100));

    for (let frame = 0; frame < plan.frames; frame += 1) {
      drawExportFrame(renderer, frame / plan.fps, plan);
      const blob = await canvasToBlob(renderer.canvas, "image/png");
      await uploadHqMp4Frame(sessionId, frame, blob);
      if (frame === 0 || frame === plan.frames - 1 || frame % progressStep === 0) {
        const percent = Math.round(((frame + 1) / plan.frames) * 100);
        copyStatus.textContent = `Rendering HQ MP4 frames ${frame + 1}/${plan.frames} (${percent}%)...`;
        await waitForNextFrame();
      }
    }

    copyStatus.textContent = `Encoding ${plan.frames} PNG frames with FFmpeg...`;
    const encoded = await finishHqMp4Session(sessionId);
    const response = await fetch(encoded.downloadUrl, { cache: "no-store" });
    if (!response.ok) throw new Error(`Encoded MP4 download returned ${response.status}.`);
    const blob = await response.blob();
    downloadBlob(blob, encoded.filename || plan.filename);
    copyStatus.textContent = `Exported ${encoded.filename || plan.filename} via FFmpeg (${formatBytes(encoded.bytes)}, CRF ${plan.encoder.crf}, ${plan.encoder.pixelFormat}).`;
  } catch (error) {
    if (sessionId) {
      await cancelHqMp4Session(sessionId).catch(() => {});
    }
    copyStatus.textContent = error.message || "HQ MP4 export failed.";
  } finally {
    cleanupExportShaderRenderer(renderer);
    setExportButtonsDisabled(false);
  }
}

async function startHqMp4Session(plan) {
  return postJson(HQ_MP4_ENDPOINTS.start, {
    plan,
    state: JSON.parse(JSON.stringify(state)),
    config: JSON.parse(buildConfigExport()),
  }, "HQ MP4 export requires the local dev server. Run `npm run play -- --no-open`, then retry.");
}

async function uploadHqMp4Frame(sessionId, frame, blob) {
  const params = new URLSearchParams({ sessionId, frame: String(frame) });
  const response = await fetch(`${HQ_MP4_ENDPOINTS.frame}?${params}`, {
    method: "POST",
    headers: { "Content-Type": "image/png" },
    body: blob,
  });
  if (!response.ok) {
    const error = await readJsonOrText(response);
    throw new Error(error.message || `Frame ${frame + 1} upload returned ${response.status}.`);
  }
}

async function finishHqMp4Session(sessionId) {
  return postJson(HQ_MP4_ENDPOINTS.finish, { sessionId }, "FFmpeg encode failed.");
}

async function cancelHqMp4Session(sessionId) {
  return postJson(HQ_MP4_ENDPOINTS.cancel, { sessionId }, "Could not clean up the HQ MP4 export session.");
}

async function postJson(url, payload, fallbackMessage) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await readJsonOrText(response);
  if (!response.ok) {
    throw new Error(body.message || fallbackMessage || `Request returned ${response.status}.`);
  }
  return body;
}

async function readJsonOrText(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function waitForNextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return "unknown size";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
    videoBitsPerSecond: plan.videoBitsPerSecond,
  });

  setExportButtonsDisabled(true);
  copyStatus.textContent = `Exporting ${plan.label} MP4 loop (${plan.width}x${plan.height}, ${Math.round(plan.videoBitsPerSecond / 1_000_000)} Mbps, ${plan.seconds}s, ${plan.loopCycles} cycle${plan.loopCycles === 1 ? "" : "s"})...`;

  recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });

  const finished = new Promise((resolve, reject) => {
    recorder.addEventListener("stop", resolve, { once: true });
    recorder.addEventListener("error", () => reject(new Error("MediaRecorder failed during MP4 export.")), { once: true });
  });

  try {
    drawExportFrame(renderer, 0, plan);
    recorder.start(250);
    await renderExportFrames(renderer, plan);
    recorder.stop();
    await finished;
    const recordedBlob = new Blob(chunks, { type: plan.mimeType });
    const blob = await tagMp4BlobWithSrgb(recordedBlob);
    const filename = target === "logo"
      ? `aha-living-gradient-logo-${plan.logoExportResolution}x-${plan.seconds.toFixed(2)}s-loop.mp4`
      : `aha-living-gradient-background-${plan.seconds.toFixed(2)}s-loop.mp4`;
    downloadBlob(blob, filename);
    copyStatus.textContent = `Exported ${filename} at ${plan.width}x${plan.height} with high-bitrate sRGB MP4 colour metadata.`;
  } catch (error) {
    if (recorder.state !== "inactive") recorder.stop();
    copyStatus.textContent = error.message || "MP4 export failed.";
  } finally {
    stream.getTracks().forEach((track) => track.stop());
    cleanupExportShaderRenderer(renderer);
    setExportButtonsDisabled(false);
  }
}

async function tagMp4BlobWithSrgb(blob) {
  if (!blob.type.includes("mp4")) return blob;
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const patched = patchExistingMp4ColorBoxes(bytes);
  return patched > 0 ? new Blob([bytes], { type: blob.type }) : blob;
}

function patchExistingMp4ColorBoxes(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let patched = 0;

  for (let offset = 4; offset + 15 < bytes.length; offset += 1) {
    if (bytes[offset] !== 0x63 || bytes[offset + 1] !== 0x6f || bytes[offset + 2] !== 0x6c || bytes[offset + 3] !== 0x72) {
      continue;
    }

    const boxStart = offset - 4;
    const boxSize = view.getUint32(boxStart);
    const isNclx = bytes[offset + 4] === 0x6e && bytes[offset + 5] === 0x63 && bytes[offset + 6] === 0x6c && bytes[offset + 7] === 0x78;
    if (boxSize !== 19 || !isNclx) continue;

    view.setUint16(boxStart + 12, EXPORT_MP4_COLOR_METADATA.colorPrimaries);
    view.setUint16(boxStart + 14, EXPORT_MP4_COLOR_METADATA.transferCharacteristics);
    view.setUint16(boxStart + 16, EXPORT_MP4_COLOR_METADATA.matrixCoefficients);
    bytes[boxStart + 18] = EXPORT_MP4_COLOR_METADATA.fullRange ? 0x80 : 0x00;
    patched += 1;
  }

  return patched;
}

function setExportButtonsDisabled(disabled) {
  if (exportPngButton) exportPngButton.disabled = disabled;
  if (exportLogoPngButton) exportLogoPngButton.disabled = disabled;
  if (exportHqMp4Button) exportHqMp4Button.disabled = disabled;
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
      resolve();
    };
    drawExportFrame(renderer, 0, plan);
    requestAnimationFrame(tick);
  });
}

function drawExportFrame(renderer, elapsed, plan) {
  const shaderTime = plan.startTime + elapsed;
  if (renderer.type === "logo") {
    drawLogoPreviewSource(renderer, shaderTime);
    drawLogoExportFrame(renderer, plan);
    return;
  }
  drawExportShaderSource(renderer, shaderTime);
  drawBackgroundExportFrame(renderer, plan);
}

function drawExportShaderSource(renderer, shaderTime) {
  if (renderer.postPipeline) {
    renderer.shader.gl.bindFramebuffer(renderer.shader.gl.FRAMEBUFFER, renderer.postPipeline.sourceFramebuffer);
  }
  drawShaderRenderer(
    renderer.shader,
    shaderTime,
    renderer.sourceCanvas.width,
    renderer.sourceCanvas.height,
    renderer.shaderOverrides,
  );
  if (renderer.postPipeline) {
    renderer.shader.gl.bindFramebuffer(renderer.shader.gl.FRAMEBUFFER, null);
  }
  bakeExportPostProcessing(renderer);
  finishExportSource(renderer);
}

function drawBackgroundExportFrame(renderer, plan) {
  renderer.context.clearRect(0, 0, plan.width, plan.height);
  renderer.context.drawImage(renderer.sourceCanvas, -renderer.pad, -renderer.pad);
}

function drawLogoExportFrame(renderer, plan) {
  if (renderer.transparent) {
    renderer.context.clearRect(0, 0, plan.width, plan.height);
  } else {
    renderer.context.fillStyle = "#ffffff";
    renderer.context.fillRect(0, 0, plan.width, plan.height);
  }

  const logoCanvas = renderLogoPreviewCrop(renderer);
  const exportRect = getSingleLogoExportRect(renderer, plan.width, plan.height);
  renderer.context.drawImage(logoCanvas, exportRect.x, exportRect.y, exportRect.width, exportRect.height);
  if (renderer.transparent) sanitizeTransparentPixels(renderer.canvas);
}

function syncPostPipeline(renderer, width, height, blur, colorGrade) {
  const enabled = blur > 0 || colorGrade.enabled;
  const gl = renderer.shader?.gl ?? renderer.gl;
  if (!enabled) {
    cleanupExportPostPipeline(gl, renderer.postPipeline);
    renderer.postPipeline = null;
    renderer.postPipelineWidth = 0;
    renderer.postPipelineHeight = 0;
    return true;
  }

  const sameSize = renderer.postPipeline
    && renderer.postPipelineWidth === width
    && renderer.postPipelineHeight === height;
  if (sameSize) return true;

  cleanupExportPostPipeline(gl, renderer.postPipeline);
  renderer.postPipeline = createExportPostPipeline(gl, width, height);
  renderer.postPipelineWidth = renderer.postPipeline ? width : 0;
  renderer.postPipelineHeight = renderer.postPipeline ? height : 0;
  return Boolean(renderer.postPipeline);
}

function bakeExportPostProcessing(renderer) {
  if (!renderer.postPipeline) return;

  const { postPipeline } = renderer;
  let inputTexture = postPipeline.sourceTexture;

  if (renderer.blur > 0) {
    const passCount = renderer.blurMetadata?.passCount ?? getBlurPassCount(renderer.blur);
    const passRadius = renderer.blur / passCount;
    for (let index = 0; index < passCount; index += 1) {
      drawExportBlurPass(renderer, inputTexture, postPipeline.tempFramebuffer, 1, 0, passRadius);
      drawExportBlurPass(renderer, postPipeline.tempTexture, postPipeline.sourceFramebuffer, 0, 1, passRadius);
      inputTexture = postPipeline.sourceTexture;
    }
  }

  drawExportGradePass(renderer, inputTexture, null);
}

function finishExportSource(renderer) {
  const gl = (renderer.shader ?? renderer)?.gl;
  if (!gl) return;
  gl.flush();
  if (renderer.postPipeline || renderer.blur > 0) {
    gl.finish();
  }
}

function drawExportBlurPass(renderer, inputTexture, framebuffer, directionX, directionY, radius) {
  const { gl, buffer } = renderer.shader ?? renderer;
  const { postPipeline } = renderer;

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.viewport(0, 0, postPipeline.width, postPipeline.height);
  gl.useProgram(postPipeline.blurProgram);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(postPipeline.blurAttribs.position);
  gl.vertexAttribPointer(postPipeline.blurAttribs.position, 2, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, inputTexture);
  gl.uniform1i(postPipeline.blurUniforms.texture, 0);
  gl.uniform2f(postPipeline.blurUniforms.resolution, postPipeline.width, postPipeline.height);
  gl.uniform2f(postPipeline.blurUniforms.direction, directionX, directionY);
  gl.uniform1f(postPipeline.blurUniforms.radius, radius);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function drawExportGradePass(renderer, inputTexture, framebuffer) {
  const { gl, buffer } = renderer.shader ?? renderer;
  const { postPipeline } = renderer;
  const grade = renderer.colorGrade;

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.viewport(0, 0, postPipeline.width, postPipeline.height);
  gl.useProgram(postPipeline.gradeProgram);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(postPipeline.gradeAttribs.position);
  gl.vertexAttribPointer(postPipeline.gradeAttribs.position, 2, gl.FLOAT, false, 0, 0);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, inputTexture);
  gl.uniform1i(postPipeline.gradeUniforms.texture, 0);
  gl.uniform1f(postPipeline.gradeUniforms.enabled, grade.enabled ? 1 : 0);
  gl.uniform3fv(postPipeline.gradeUniforms.deepColor, hexToRgbUnit(state.deepColor));
  gl.uniform1f(postPipeline.gradeUniforms.exposure, grade.exposure);
  gl.uniform1f(postPipeline.gradeUniforms.shadowMix, grade.shadowMix);
  gl.uniform1f(postPipeline.gradeUniforms.orangeLuminanceCap, grade.orangeLuminanceCap);
  gl.uniform1f(postPipeline.gradeUniforms.saturation, grade.saturation);
  gl.drawArrays(gl.TRIANGLES, 0, 6);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function createExportShaderRenderer(width, height) {
  const blurMetadata = getBackgroundExportBlurMetadata(width, height);
  const blur = blurMetadata.effectiveShaderBlur;
  const pad = blurMetadata.pad;
  const colorGrade = getExportColorGrade();
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = get2dContext(canvas, { alpha: false });
  if (!context) return null;

  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = width + pad * 2;
  sourceCanvas.height = height + pad * 2;
  const gl = getWebGLContext(sourceCanvas, {
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

  const renderer = {
    type: "background",
    canvas,
    context,
    sourceCanvas,
    pad,
    blur,
    blurMetadata,
    colorGrade,
    postPipeline: null,
    postPipelineWidth: 0,
    postPipelineHeight: 0,
    shaderOverrides: null,
    shader: createShaderRenderer(gl, sourceCanvas, program, buffer),
  };
  return syncPostPipeline(renderer, sourceCanvas.width, sourceCanvas.height, blur, colorGrade) ? renderer : null;
}

async function createLogoExportShaderRenderer(width, height, options = {}) {
  const transparent = Boolean(options.transparent);
  const surface = document.querySelector(LOGO_EXPORT_SELECTOR);
  if (!surface) throw new Error("Logo export could not find the large preview logo.");
  ensureShaderSurface(surface);
  const liveShader = shaderRuntime.items.get(surface);
  if (!liveShader) throw new Error("Logo export could not access the live logo shader.");
  const maskImage = await loadImage(LOGO_EXPORT_MASK_URL);
  drawShaderItemAtTime(liveShader, surface, getShaderTime());
  const liveCrop = getLiveLogoCanvasCrop(surface, liveShader.canvas);
  const exportRect = getSingleLogoExportRectForAspect(liveCrop.aspect, width, height);
  const blurMetadata = getLogoRendererBlurMetadata(width, height, liveShader);
  const blur = liveShader.blur;
  const colorGrade = liveShader.colorGrade ?? getExportColorGrade();

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = get2dContext(canvas, { alpha: transparent, willReadFrequently: transparent });
  if (!context) return null;

  const logoCanvas = document.createElement("canvas");
  const logoContext = get2dContext(logoCanvas);
  if (!logoContext) return null;

  const renderer = {
    type: "logo",
    canvas,
    context,
    surface,
    liveShader,
    sourceCanvas: liveShader.canvas,
    maskImage,
    logoCanvas,
    logoContext,
    logoAspect: liveCrop.aspect,
    logoCrop: liveCrop,
    exportRect,
    transparent,
    blur,
    blurMetadata,
    colorGrade,
    useLivePreviewSource: true,
  };
  return renderer;
}

function createExportPostPipeline(gl, width, height) {
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  if (width > maxTextureSize || height > maxTextureSize) return null;

  const blurProgram = createTextureProgram(gl, exportBlurFragmentSource);
  const gradeProgram = createTextureProgram(gl, exportGradeFragmentSource);
  if (!blurProgram || !gradeProgram) return null;

  const sourceTexture = createExportTexture(gl, width, height);
  const tempTexture = createExportTexture(gl, width, height);
  if (!sourceTexture || !tempTexture) return null;

  const sourceFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, sourceFramebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sourceTexture, 0);
  const sourceComplete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  if (!sourceComplete) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return null;
  }

  const tempFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, tempFramebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tempTexture, 0);
  const isComplete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  if (!isComplete) return null;

  return {
    width,
    height,
    blurProgram,
    gradeProgram,
    sourceTexture,
    sourceFramebuffer,
    tempTexture,
    tempFramebuffer,
    blurAttribs: {
      position: gl.getAttribLocation(blurProgram, "a_position"),
    },
    blurUniforms: {
      texture: gl.getUniformLocation(blurProgram, "u_texture"),
      resolution: gl.getUniformLocation(blurProgram, "u_resolution"),
      direction: gl.getUniformLocation(blurProgram, "u_direction"),
      radius: gl.getUniformLocation(blurProgram, "u_radius"),
    },
    gradeAttribs: {
      position: gl.getAttribLocation(gradeProgram, "a_position"),
    },
    gradeUniforms: {
      texture: gl.getUniformLocation(gradeProgram, "u_texture"),
      enabled: gl.getUniformLocation(gradeProgram, "u_enabled"),
      deepColor: gl.getUniformLocation(gradeProgram, "u_deep_color"),
      exposure: gl.getUniformLocation(gradeProgram, "u_exposure"),
      shadowMix: gl.getUniformLocation(gradeProgram, "u_shadow_mix"),
      orangeLuminanceCap: gl.getUniformLocation(gradeProgram, "u_orange_luminance_cap"),
      saturation: gl.getUniformLocation(gradeProgram, "u_saturation"),
    },
  };
}

function getExportColorGrade() {
  return {
    enabled: Boolean(state.figmaExportGrade),
    ...EXPORT_COLOR_GRADE_DEFAULTS,
  };
}

function createExportTexture(gl, width, height) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  return texture;
}

function drawLogoPreviewSource(renderer, shaderTime) {
  drawShaderItemAtTime(renderer.liveShader, renderer.surface, shaderTime);
  if (renderer.useLivePreviewSource) {
    renderer.sourceCanvas = renderer.liveShader.canvas;
    renderer.logoCrop = getLiveLogoCanvasCrop(renderer.surface, renderer.liveShader.canvas);
    renderer.logoAspect = renderer.logoCrop.aspect;
    renderer.blur = renderer.liveShader.blur;
    renderer.blurMetadata = getLogoRendererBlurMetadata(renderer.canvas.width, renderer.canvas.height, renderer.liveShader);
    renderer.colorGrade = renderer.liveShader.colorGrade ?? getExportColorGrade();
    return;
  }
  drawExportShaderSource(renderer, shaderTime);
}

function getLogoRendererBlurMetadata(width, height, liveShader) {
  return {
    ...getLogoExportBlurMetadata(width, height),
    previewBlurMetadata: liveShader.blurMetadata ?? null,
    sourceCanvasWidth: liveShader.canvas.width,
    sourceCanvasHeight: liveShader.canvas.height,
  };
}

function renderLogoPreviewCrop(renderer) {
  const crop = renderer.logoCrop ?? getLiveLogoCanvasCrop(renderer.surface, renderer.liveShader.canvas);
  const sourceCanvas = renderer.sourceCanvas;

  resizeCanvas(renderer.logoCanvas, crop.sw, crop.sh);
  renderer.logoContext.clearRect(0, 0, crop.sw, crop.sh);
  renderer.logoContext.drawImage(sourceCanvas, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, crop.sw, crop.sh);
  renderer.logoContext.globalCompositeOperation = "destination-in";
  renderer.logoContext.drawImage(renderer.maskImage, 0, 0, crop.sw, crop.sh);
  renderer.logoContext.globalCompositeOperation = "source-over";
  return renderer.logoCanvas;
}

function getLiveLogoCanvasCrop(surface, liveCanvas) {
  const surfaceRect = surface.getBoundingClientRect();
  const canvasRect = liveCanvas.getBoundingClientRect();
  const scaleX = liveCanvas.width / Math.max(canvasRect.width, 1);
  const scaleY = liveCanvas.height / Math.max(canvasRect.height, 1);
  const rawSx = Math.round((surfaceRect.left - canvasRect.left) * scaleX);
  const rawSy = Math.round((surfaceRect.top - canvasRect.top) * scaleY);
  const sx = clamp(rawSx, 0, liveCanvas.width - 1);
  const sy = clamp(rawSy, 0, liveCanvas.height - 1);
  const sw = Math.max(1, Math.round(surfaceRect.width * scaleX));
  const sh = Math.max(1, Math.round(surfaceRect.height * scaleY));
  return {
    sx,
    sy,
    sw: Math.min(sw, liveCanvas.width - sx),
    sh: Math.min(sh, liveCanvas.height - sy),
    scaleX,
    scaleY,
    surfaceWidth: surfaceRect.width,
    surfaceHeight: surfaceRect.height,
    aspect: surfaceRect.width > 0 && surfaceRect.height > 0
      ? surfaceRect.width / surfaceRect.height
      : LOGO_EXPORT_FALLBACK_ASPECT,
  };
}

function getSingleLogoExportRect(renderer, width, height) {
  if (renderer.exportRect) return renderer.exportRect;
  return getSingleLogoExportRectForAspect(renderer.logoAspect ?? LOGO_EXPORT_FALLBACK_ASPECT, width, height);
}

function getSingleLogoExportRectForAspect(aspect, width, height) {
  const fill = clamp(state.logoExportScale, 0.25, 0.95);
  const maxWidth = width * fill;
  const maxHeight = height * fill;
  let rectWidth = maxWidth;
  let rectHeight = rectWidth / aspect;
  if (rectHeight > maxHeight) {
    rectHeight = maxHeight;
    rectWidth = rectHeight * aspect;
  }
  return {
    width: Math.round(rectWidth),
    height: Math.round(rectHeight),
    x: Math.round((width - rectWidth) / 2),
    y: Math.round((height - rectHeight) / 2),
  };
}

function resizeCanvas(canvas, width, height) {
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
}

function sanitizeTransparentPixels(canvas) {
  const context = get2dContext(canvas, { willReadFrequently: true });
  if (!context) return;
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imageData;
  for (let index = 0; index < data.length; index += 4) {
    if (data[index + 3] === 0) {
      data[index] = 255;
      data[index + 1] = 255;
      data[index + 2] = 255;
    }
  }
  context.putImageData(imageData, 0, 0);
}

async function renderExportDiagnosticFrame(target = "background", elapsed = 0, options = {}) {
  const plan = getExportPlan(target);
  if (Number.isFinite(options.startTime)) plan.startTime = options.startTime;
  const renderer = target === "logo"
    ? await createLogoExportShaderRenderer(plan.width, plan.height, { transparent: Boolean(options.transparent) })
    : createExportShaderRenderer(plan.width, plan.height);
  if (!renderer) throw new Error("Export diagnostic renderer is unavailable.");

  try {
    drawExportFrame(renderer, elapsed, plan);
    return {
      target,
      blur: renderer.blur,
      rawShaderBlur: renderer.blurMetadata?.rawShaderBlur ?? renderer.blur,
      effectiveShaderBlur: renderer.blur,
      blurScale: renderer.blurMetadata?.blurScale ?? 1,
      overscanPad: renderer.blurMetadata?.pad ?? renderer.pad ?? 0,
      blurMetadata: renderer.blurMetadata ?? null,
      figmaExportGrade: renderer.colorGrade.enabled,
      exportColorGrade: renderer.colorGrade,
      colorSpace: EXPORT_COLOR_SPACE,
      colorProfile: EXPORT_COLOR_PROFILE,
      width: plan.width,
      height: plan.height,
      transparent: Boolean(renderer.transparent),
      exportRect: renderer.exportRect ?? { x: 0, y: 0, width: plan.width, height: plan.height },
      alphaMetadata: renderer.transparent && options.includeAlphaMetadata !== false
        ? getCanvasAlphaMetadata(renderer.canvas, renderer.exportRect)
        : null,
      dataUrl: options.includeDataUrl === false
        ? ""
        : renderer.transparent
          ? canvasToNeutralAlphaPngDataUrl(renderer.canvas)
          : renderer.canvas.toDataURL("image/png"),
    };
  } finally {
    cleanupExportShaderRenderer(renderer);
  }
}

async function renderPreviewDiagnosticFrame(target = "background", elapsed = 0, options = {}) {
  const surface = target === "logo"
    ? document.querySelector(LOGO_EXPORT_SELECTOR)
    : document.querySelector(BACKGROUND_EXPORT_SELECTOR);
  if (!surface) throw new Error(`Preview diagnostic could not find ${target} surface.`);

  ensureShaderSurface(surface);
  const liveShader = shaderRuntime.items.get(surface);
  if (!liveShader) throw new Error(`Preview diagnostic could not access ${target} shader.`);

  const startTime = Number.isFinite(options.startTime) ? options.startTime : getShaderTime();
  drawShaderItemAtTime(liveShader, surface, startTime + elapsed);
  const crop = getLiveLogoCanvasCrop(surface, liveShader.canvas);
  const visibleSize = getVisiblePreviewFrameSize(surface);
  const canvas = document.createElement("canvas");
  resizeCanvas(canvas, visibleSize.width, visibleSize.height);
  const context = get2dContext(canvas, { alpha: target === "logo", willReadFrequently: target === "logo" });
  if (!context) throw new Error("Preview diagnostic could not create a canvas.");
  if (target !== "logo") {
    context.fillStyle = state.deepColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(liveShader.canvas, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, canvas.width, canvas.height);

  if (target === "logo") {
    const maskImage = await loadImage(LOGO_EXPORT_MASK_URL);
    context.globalCompositeOperation = "destination-in";
    context.drawImage(maskImage, 0, 0, canvas.width, canvas.height);
    context.globalCompositeOperation = "source-over";
    sanitizeTransparentPixels(canvas);
  }

  return {
    target,
    blur: liveShader.blur,
    rawShaderBlur: liveShader.blurMetadata?.rawShaderBlur ?? liveShader.blur,
    effectiveShaderBlur: liveShader.blur,
    blurScale: liveShader.blurMetadata?.blurScale ?? 1,
    overscanPad: liveShader.blurMetadata?.pad ?? 0,
    blurMetadata: liveShader.blurMetadata ?? null,
    figmaExportGrade: liveShader.colorGrade.enabled,
    exportColorGrade: liveShader.colorGrade,
    colorSpace: EXPORT_COLOR_SPACE,
    colorProfile: EXPORT_COLOR_PROFILE,
    width: canvas.width,
    height: canvas.height,
    crop,
    visibleSize,
    dataUrl: canvas.toDataURL("image/png"),
  };
}

function getVisiblePreviewFrameSize(surface) {
  const rect = surface.getBoundingClientRect();
  const scale = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  return {
    width: Math.max(1, Math.round(rect.width * scale)),
    height: Math.max(1, Math.round(rect.height * scale)),
    scale: Number(scale.toFixed(4)),
  };
}

async function renderPreviewExportPair(target = "background", elapsed = 0, options = {}) {
  const startTime = getShaderTime();
  const preview = await renderPreviewDiagnosticFrame(target, elapsed, { startTime });
  const plan = getExportPlan(target);
  plan.startTime = startTime;
  const renderer = target === "logo"
    ? await createLogoExportShaderRenderer(plan.width, plan.height, { transparent: true })
    : createExportShaderRenderer(plan.width, plan.height);
  if (!renderer) throw new Error("Export diagnostic renderer is unavailable.");

  const comparisonCanvas = document.createElement("canvas");
  resizeCanvas(comparisonCanvas, preview.width, preview.height);
  const comparisonContext = get2dContext(comparisonCanvas, { alpha: target === "logo", willReadFrequently: target === "logo" });
  if (!comparisonContext) throw new Error("Could not create comparison canvas.");

  let exported;
  try {
    drawExportFrame(renderer, elapsed, plan);
    exported = {
      target,
      blur: renderer.blur,
      rawShaderBlur: renderer.blurMetadata?.rawShaderBlur ?? renderer.blur,
      effectiveShaderBlur: renderer.blur,
      blurScale: renderer.blurMetadata?.blurScale ?? 1,
      overscanPad: renderer.blurMetadata?.pad ?? renderer.pad ?? 0,
      blurMetadata: renderer.blurMetadata ?? null,
      figmaExportGrade: renderer.colorGrade.enabled,
      exportColorGrade: renderer.colorGrade,
      colorSpace: EXPORT_COLOR_SPACE,
      colorProfile: EXPORT_COLOR_PROFILE,
      width: plan.width,
      height: plan.height,
      transparent: Boolean(renderer.transparent),
      exportRect: renderer.exportRect ?? { x: 0, y: 0, width: plan.width, height: plan.height },
      alphaMetadata: renderer.transparent && options.includeAlphaMetadata !== false
        ? getCanvasAlphaMetadata(renderer.canvas, renderer.exportRect)
        : null,
      dataUrl: options.includeFullExportDataUrl === false
        ? ""
        : renderer.transparent
          ? canvasToNeutralAlphaPngDataUrl(renderer.canvas)
          : renderer.canvas.toDataURL("image/png"),
    };

    if (target === "logo") {
      comparisonContext.clearRect(0, 0, preview.width, preview.height);
      const rect = exported.exportRect;
      comparisonContext.drawImage(renderer.canvas, rect.x, rect.y, rect.width, rect.height, 0, 0, preview.width, preview.height);
      sanitizeTransparentPixels(comparisonCanvas);
    } else {
      comparisonContext.drawImage(renderer.canvas, 0, 0, exported.width, exported.height, 0, 0, preview.width, preview.height);
    }
  } finally {
    cleanupExportShaderRenderer(renderer);
  }

  return {
    target,
    elapsed,
    preview,
    export: exported,
    comparison: {
      width: comparisonCanvas.width,
      height: comparisonCanvas.height,
      dataUrl: comparisonCanvas.toDataURL("image/png"),
    },
  };
}

function getCanvasAlphaMetadata(canvas, exportRect = { x: 0, y: 0, width: canvas.width, height: canvas.height }) {
  const context = get2dContext(canvas, { willReadFrequently: true });
  if (!context) return null;
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const corners = [
    alphaAtImageData(imageData, canvas.width, 0, 0),
    alphaAtImageData(imageData, canvas.width, Math.max(0, canvas.width - 1), 0),
    alphaAtImageData(imageData, canvas.width, 0, Math.max(0, canvas.height - 1)),
    alphaAtImageData(imageData, canvas.width, Math.max(0, canvas.width - 1), Math.max(0, canvas.height - 1)),
  ];
  let outsideNonTransparent = 0;
  let transparentRgbUnsafe = 0;
  let interiorOpaque = 0;
  let interiorTransparent = 0;
  let edgeAlphaPixels = 0;

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const index = (canvas.width * y + x) * 4;
      const alpha = imageData.data[index + 3];
      const insideExportRect = x >= exportRect.x
        && x < exportRect.x + exportRect.width
        && y >= exportRect.y
        && y < exportRect.y + exportRect.height;
      if (!insideExportRect && alpha !== 0) outsideNonTransparent += 1;
      if (alpha === 0 && (imageData.data[index] !== 255 || imageData.data[index + 1] !== 255 || imageData.data[index + 2] !== 255)) {
        transparentRgbUnsafe += 1;
      }
      if (insideExportRect && alpha > 250) interiorOpaque += 1;
      if (insideExportRect && alpha === 0) interiorTransparent += 1;
      if (insideExportRect && alpha > 0 && alpha < 255) edgeAlphaPixels += 1;
    }
  }

  return {
    corners,
    outsideNonTransparent,
    transparentRgbUnsafe,
    interiorOpaque,
    interiorTransparent,
    edgeAlphaPixels,
  };
}

function alphaAtImageData(imageData, width, x, y) {
  return imageData.data[(width * y + x) * 4 + 3];
}

async function renderLogoPreviewDiagnosticFrame(elapsed = 0) {
  return renderPreviewDiagnosticFrame("logo", elapsed);
}

async function renderLogoDiagnosticPair(elapsed = 0) {
  return renderPreviewExportPair("logo", elapsed);
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
  if (!renderer.shader) return;
  const { gl, buffer, program } = renderer.shader;
  cleanupExportPostPipeline(gl, renderer.postPipeline);
  gl.deleteBuffer(buffer);
  gl.deleteProgram(program);
}

function cleanupExportPostPipeline(gl, pipeline) {
  if (!pipeline) return;
  gl.deleteTexture(pipeline.sourceTexture);
  gl.deleteFramebuffer(pipeline.sourceFramebuffer);
  gl.deleteTexture(pipeline.tempTexture);
  gl.deleteFramebuffer(pipeline.tempFramebuffer);
  gl.deleteProgram(pipeline.blurProgram);
  gl.deleteProgram(pipeline.gradeProgram);
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

function canvasToBlob(canvas, type = "image/png", quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }
      reject(new Error("Canvas export did not produce a blob."));
    }, type, quality);
  });
}

function canvasToNeutralAlphaPngBlob(canvas) {
  const bytes = encodeCanvasPng(canvas, { neutralTransparentRgb: true });
  return new Blob([bytes], { type: "image/png" });
}

function canvasToNeutralAlphaPngDataUrl(canvas) {
  const bytes = encodeCanvasPng(canvas, { neutralTransparentRgb: true });
  return `data:image/png;base64,${bytesToBase64(bytes)}`;
}

function encodeCanvasPng(canvas, options = {}) {
  const context = get2dContext(canvas, { willReadFrequently: true });
  if (!context) throw new Error("PNG export could not read the canvas.");
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const raw = new Uint8Array((canvas.width * 4 + 1) * canvas.height);
  let rawIndex = 0;
  let sourceIndex = 0;
  for (let y = 0; y < canvas.height; y += 1) {
    raw[rawIndex] = 0;
    rawIndex += 1;
    for (let x = 0; x < canvas.width; x += 1) {
      const alpha = imageData.data[sourceIndex + 3];
      if (options.neutralTransparentRgb && alpha === 0) {
        raw[rawIndex] = 255;
        raw[rawIndex + 1] = 255;
        raw[rawIndex + 2] = 255;
      } else {
        raw[rawIndex] = imageData.data[sourceIndex];
        raw[rawIndex + 1] = imageData.data[sourceIndex + 1];
        raw[rawIndex + 2] = imageData.data[sourceIndex + 2];
      }
      raw[rawIndex + 3] = alpha;
      rawIndex += 4;
      sourceIndex += 4;
    }
  }

  const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = new Uint8Array(13);
  writeUint32(ihdr, 0, canvas.width);
  writeUint32(ihdr, 4, canvas.height);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return concatBytes([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlibStore(raw)),
    pngChunk("IEND", new Uint8Array(0)),
  ]);
}

function zlibStore(data) {
  const blockCount = Math.ceil(data.length / 65535);
  const output = new Uint8Array(2 + data.length + blockCount * 5 + 4);
  let offset = 0;
  output[offset] = 0x78;
  output[offset + 1] = 0x01;
  offset += 2;

  for (let inputOffset = 0; inputOffset < data.length; inputOffset += 65535) {
    const blockLength = Math.min(65535, data.length - inputOffset);
    const finalBlock = inputOffset + blockLength >= data.length;
    output[offset] = finalBlock ? 1 : 0;
    output[offset + 1] = blockLength & 0xff;
    output[offset + 2] = (blockLength >>> 8) & 0xff;
    const inverse = (~blockLength) & 0xffff;
    output[offset + 3] = inverse & 0xff;
    output[offset + 4] = (inverse >>> 8) & 0xff;
    offset += 5;
    output.set(data.subarray(inputOffset, inputOffset + blockLength), offset);
    offset += blockLength;
  }

  writeUint32(output, offset, adler32(data));
  return output;
}

function pngChunk(type, data) {
  const typeBytes = stringToBytes(type);
  const chunk = new Uint8Array(12 + data.length);
  writeUint32(chunk, 0, data.length);
  chunk.set(typeBytes, 4);
  chunk.set(data, 8);
  writeUint32(chunk, 8 + data.length, crc32(concatBytes([typeBytes, data])));
  return chunk;
}

function stringToBytes(value) {
  const bytes = new Uint8Array(value.length);
  for (let index = 0; index < value.length; index += 1) bytes[index] = value.charCodeAt(index);
  return bytes;
}

function concatBytes(parts) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  parts.forEach((part) => {
    output.set(part, offset);
    offset += part.length;
  });
  return output;
}

function writeUint32(bytes, offset, value) {
  bytes[offset] = (value >>> 24) & 0xff;
  bytes[offset + 1] = (value >>> 16) & 0xff;
  bytes[offset + 2] = (value >>> 8) & 0xff;
  bytes[offset + 3] = value & 0xff;
}

function adler32(data) {
  let a = 1;
  let b = 0;
  for (let index = 0; index < data.length; index += 1) {
    a = (a + data[index]) % 65521;
    b = (b + a) % 65521;
  }
  return ((b << 16) | a) >>> 0;
}

function crc32(data) {
  let crc = 0xffffffff;
  for (let index = 0; index < data.length; index += 1) {
    crc = PNG_CRC_TABLE[(crc ^ data[index]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const PNG_CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = (value & 1) ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  return table;
})();

function bytesToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
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
  const next = {
    ...candidate,
    preset: candidate?.preset ?? "A",
    deepColor: candidate?.deepColor ?? authoredDefaultValues.deepColor,
    redColor: candidate?.redColor ?? authoredDefaultValues.redColor,
    orangeColor: candidate?.orangeColor ?? authoredDefaultValues.orangeColor,
    redExtraSway: candidate?.redExtraSway ?? authoredDefaultValues.redExtraSway,
    surfaceBlurBoost: candidate?.surfaceBlurBoost ?? authoredDefaultValues.surfaceBlurBoost,
    minimapSurface: MINIMAP_SURFACES.includes(candidate?.minimapSurface) ? candidate.minimapSurface : authoredDefaultValues.minimapSurface,
    minimapContextScale: candidate?.minimapContextScale ?? authoredDefaultValues.minimapContextScale,
    surfaces: candidate?.surfaces,
    figmaExportGrade: candidate?.figmaExportGrade ?? authoredDefaultValues.figmaExportGrade,
    reducedMotion: candidate?.reducedMotion,
    contrastSafe: candidate?.contrastSafe,
    paused: candidate?.paused,
  };
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

async function saveCurrentState() {
  let browserSaved = false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    savedStateSnapshot = serializeState(state);
    browserSaved = true;
  } catch {
    copyStatus.textContent = "Settings changed, but browser storage is unavailable.";
    return;
  }

  const codebaseResult = await saveCurrentStateToCodebase();
  if (codebaseResult.saved) {
    copyStatus.textContent = "Saved settings to this browser and wrote them into the codebase defaults.";
    return;
  }

  copyStatus.textContent = browserSaved
    ? `Saved settings for reload. Codebase save unavailable here${codebaseResult.reason ? `: ${codebaseResult.reason}` : "."}`
    : "Settings changed, but browser storage is unavailable.";
}

async function saveCurrentStateToCodebase() {
  try {
    const response = await fetch("/__gradient-lab/save-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        schema: CONFIG_SCHEMA,
        state,
      }),
    });
    if (!response.ok) {
      return { saved: false, reason: response.status === 404 ? "serve with npm run play to enable file writes" : `server returned ${response.status}` };
    }
    const result = await response.json();
    return { saved: Boolean(result.saved), reason: result.message };
  } catch {
    return { saved: false, reason: "serve with npm run play to enable file writes" };
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
      return;
    }
    if (control.type === "color") {
      setNestedValue(next, control.key, normalizeHexColor(value, control.default));
    }
  });

  next.minimapSurface = MINIMAP_SURFACES.includes(candidate?.minimapSurface) ? candidate.minimapSurface : next.minimapSurface;

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

function getComputedShaderBlur(surface) {
  const raw = getComputedStyle(surface).getPropertyValue("--lg-effective-shader-blur").trim()
    || getComputedStyle(surface).getPropertyValue("--lg-shader-blur").trim();
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? Math.max(0, Math.round(value)) : getRawSurfaceShaderBlur(surface);
}

function getSurfaceBlurMetadata(surface, targetWidth, targetHeight, pixelScale = null, source = "export") {
  const fallbackBlur = getRawSurfaceShaderBlur(surface);
  if (!surface) {
    return {
      source: "fallback",
      rawShaderBlur: fallbackBlur,
      effectiveShaderBlur: fallbackBlur,
      blurScale: 1,
      liveWidth: 0,
      liveHeight: 0,
      exportWidth: targetWidth,
      exportHeight: targetHeight,
      pad: fallbackBlur * 2,
      passCount: getBlurPassCount(fallbackBlur),
    };
  }

  const rect = surface.getBoundingClientRect();
  const liveWidth = Math.max(0, rect.width);
  const liveHeight = Math.max(0, rect.height);
  const rawShaderBlur = getComputedShaderBlur(surface);
  const hasLiveSize = liveWidth > 0 && liveHeight > 0;
  const blurScale = pixelScale ?? (hasLiveSize ? Math.max(targetWidth / liveWidth, targetHeight / liveHeight) : 1);
  const effectiveShaderBlur = Math.max(0, Math.round(rawShaderBlur * blurScale));

  return {
    source,
    rawShaderBlur,
    effectiveShaderBlur,
    blurScale: Number(blurScale.toFixed(4)),
    liveWidth: Math.round(liveWidth),
    liveHeight: Math.round(liveHeight),
    exportWidth: targetWidth,
    exportHeight: targetHeight,
    pad: effectiveShaderBlur * 2,
    passCount: getBlurPassCount(rawShaderBlur),
  };
}

function getBlurPassCount(blur) {
  return blur > 0 ? Math.min(10, Math.max(1, Math.ceil(blur / 36))) : 0;
}

function getBackgroundExportBlurMetadata(width = EXPORT_WIDTH, height = EXPORT_HEIGHT) {
  const surface = document.querySelector(BACKGROUND_EXPORT_SELECTOR) ?? document.querySelector('.living-gradient[data-surface="background"]');
  return getSurfaceBlurMetadata(surface, width, height, null, "live-background-surface");
}

function getLogoExportBlurMetadata(width, height) {
  const surface = document.querySelector(LOGO_EXPORT_SELECTOR);
  const aspect = getSurfaceAspect(surface, LOGO_EXPORT_FALLBACK_ASPECT);
  const exportRect = getSingleLogoExportRectForAspect(aspect, width, height);
  return {
    ...getSurfaceBlurMetadata(surface, exportRect.width, exportRect.height, null, "live-logo-surface"),
    exportCanvasWidth: width,
    exportCanvasHeight: height,
    exportRect,
  };
}

function getSurfaceAspect(surface, fallback) {
  const rect = surface?.getBoundingClientRect();
  return rect && rect.width > 0 && rect.height > 0 ? rect.width / rect.height : fallback;
}

function normalizeHexColor(value, fallback = "#000000") {
  const raw = String(value ?? "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(raw)) return raw.toLowerCase();
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
    return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`.toLowerCase();
  }
  return /^#[0-9a-fA-F]{6}$/.test(fallback) ? fallback.toLowerCase() : "#000000";
}

function hexToRgb255(value) {
  const color = normalizeHexColor(value);
  return {
    r: parseInt(color.slice(1, 3), 16),
    g: parseInt(color.slice(3, 5), 16),
    b: parseInt(color.slice(5, 7), 16),
  };
}

function hexToRgbUnit(value) {
  const rgb = hexToRgb255(value);
  return [rgb.r / 255, rgb.g / 255, rgb.b / 255];
}

function formatValue(key, value) {
  const control = controlByKey.get(key);
  if (control?.type === "color") return formatters[key] ? formatters[key](String(value)) : String(value);
  return formatters[key] ? formatters[key](Number(value)) : String(value);
}

saveConfigButton.addEventListener("click", saveCurrentState);
copyCssButton.addEventListener("click", () => copyText(buildCssExport(), "Copied current CSS custom properties."));
copyConfigButton.addEventListener("click", () => copyText(buildConfigExport(), "Copied current parameter config."));
if (exportPngButton) exportPngButton.addEventListener("click", () => exportCurrentGradientPng("background"));
if (exportLogoPngButton) exportLogoPngButton.addEventListener("click", () => exportCurrentGradientPng("logo"));
if (exportHqMp4Button) exportHqMp4Button.addEventListener("click", exportCurrentBackgroundHqMp4);
exportMp4Button.addEventListener("click", () => exportCurrentGradientMp4("background"));
if (exportLogoMp4Button) exportLogoMp4Button.addEventListener("click", () => exportCurrentGradientMp4("logo"));
resetButton.addEventListener("click", resetConfig);
minimapButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const surface = button.dataset.minimapSurface;
    if (!MINIMAP_SURFACES.includes(surface)) return;
    state.minimapSurface = surface;
    markStateDirty();
    render();
  });
});

document.addEventListener("visibilitychange", syncShaderLoop);
window.addEventListener("resize", () => drawShadersOnce());
window.__ahaLivingGradientExportDebug = {
  renderFrame: renderExportDiagnosticFrame,
  renderPreviewFrame: renderPreviewDiagnosticFrame,
  renderPair: renderPreviewExportPair,
  renderLogoPreviewFrame: renderLogoPreviewDiagnosticFrame,
  renderLogoPair: renderLogoDiagnosticPair,
  getBackgroundHqMp4Plan: () => JSON.parse(JSON.stringify(getBackgroundHqMp4ExportPlan())),
  getConfig: () => JSON.parse(buildConfigExport()),
};

initReducedMotion();
renderPanel();
render();
