const prototype = document.querySelector(".prototype");
const mediaFrame = document.querySelector(".media-frame");
const slides = Array.from(document.querySelectorAll(".slide"));
const pauseButton = document.querySelector(".pause-button");
const playButton = document.querySelector("[data-play]");
const panelPauseButton = document.querySelector("[data-pause]");
const modeReadout = document.querySelector("[data-mode-readout]");
const controlsRoot = document.querySelector("[data-control-root]");
const saveConfigButton = document.querySelector("[data-save-config]");
const copyConfigButton = document.querySelector("[data-copy-config]");
const resetConfigButton = document.querySelector("[data-reset-config]");
const configOutput = document.querySelector("[data-config-output]");
const copyStatus = document.querySelector("[data-copy-status]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const CONFIG_PATH = "config.json";
const SAVE_ENDPOINT = "/__ken-burns-lab/save-settings";
const STORAGE_KEY = "aha-ken-burns-background-lab:v1";
const CONFIG_SCHEMA = "aha-ken-burns-background/v1";
const SURFACE_NAME = "AHA Ken Burns Background Lab";

const fallbackState = Object.freeze({
  holdDuration: 10000,
  motionDuration: 11200,
  fadeDuration: 1200,
  overscan: 12,
  zoomAmount: 0.12,
  panStrength: 1,
});

const baseRoutes = [
  { fromX: -2, fromY: -1, fromScale: 1.02, toX: 3, toY: 1, toScale: 1.13 },
  { fromX: 2, fromY: 2, fromScale: 1.04, toX: -3, toY: -1, toScale: 1.12 },
  { fromX: 0, fromY: -2, fromScale: 1.03, toX: 2, toY: 2, toScale: 1.14 },
];

const controlGroups = [
  {
    id: "timing",
    title: "Timing",
    open: true,
    controls: [
      { key: "holdDuration", label: "Image hold", min: 4000, max: 30000, step: 500, unit: "s", scale: 0.001, precision: 1 },
      { key: "motionDuration", label: "Move duration", min: 6000, max: 36000, step: 500, unit: "s", scale: 0.001, precision: 1 },
      { key: "fadeDuration", label: "Crossfade", min: 0, max: 3000, step: 100, unit: "s", scale: 0.001, precision: 1 },
    ],
  },
  {
    id: "frame",
    title: "Frame & Movement",
    open: true,
    controls: [
      { key: "overscan", label: "Overscan", min: 4, max: 20, step: 1, unit: "%", precision: 0 },
      { key: "zoomAmount", label: "Zoom", min: 0.04, max: 0.2, step: 0.01, unit: "%", scale: 100, precision: 0 },
      { key: "panStrength", label: "Pan strength", min: 0.25, max: 1.5, step: 0.05, unit: "x", precision: 2 },
    ],
  },
];

const controls = controlGroups.flatMap((group) => group.controls);
let authoredState = { ...fallbackState };
let state = { ...fallbackState };
let activeIndex = 0;
let isPaused = false;
let timer = null;
let fadeTimer = null;

async function init() {
  authoredState = normalizeState(await loadAuthoredState());
  state = normalizeState(loadSavedState() ?? authoredState);
  renderControls();
  bindPanelActions();
  bindPlayback();
  applyControls({ restart: false });
  setPanelStatus(loadSavedState() ? "Saved browser settings active." : "Authored motion active.");
  scheduleNext();
}

function renderControls() {
  controlsRoot.innerHTML = controlGroups.map((group) => `
    <details class="parameterizer-folder" ${group.open ? "open" : ""}>
      <summary class="parameterizer-folder-title"><span>${group.title}</span></summary>
      <div class="parameterizer-folder-body">
        ${group.controls.map(renderControl).join("")}
      </div>
    </details>
  `).join("");

  controlsRoot.addEventListener("input", (event) => {
    const input = event.target.closest("[data-control]");
    if (!input) return;
    state[input.dataset.control] = Number(input.value);
    applyControls({ restart: true });
    setPanelStatus("Unsaved motion settings active.");
  });
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

function bindPlayback() {
  pauseButton.addEventListener("click", () => setPaused(!isPaused));
  playButton.addEventListener("click", () => setPaused(false));
  panelPauseButton.addEventListener("click", () => setPaused(true));
  document.addEventListener("visibilitychange", scheduleNext);
  reducedMotion.addEventListener("change", scheduleNext);
}

function bindPanelActions() {
  saveConfigButton.addEventListener("click", () => void saveCurrentState());
  copyConfigButton.addEventListener("click", () => void copyText(buildConfigExport(), "Config copied."));
  resetConfigButton.addEventListener("click", () => {
    state = { ...authoredState };
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // The in-memory revert still applies.
    }
    syncInputs();
    applyControls({ restart: true });
    setPanelStatus("Reverted to the authored config.");
  });
}

function applyControls({ restart }) {
  mediaFrame.style.setProperty("--kb-fade-duration", `${state.fadeDuration}ms`);
  mediaFrame.style.setProperty("--kb-motion-duration", `${state.motionDuration}ms`);
  mediaFrame.style.setProperty("--kb-overscan-inset", `${state.overscan * -1}%`);
  slides.forEach((slide, index) => applyRoute(slide, baseRoutes[index]));

  controls.forEach((control) => {
    const output = controlsRoot.querySelector(`[data-output="${control.key}"]`);
    if (output) output.textContent = formatValue(state[control.key], control);
  });

  configOutput.value = buildConfigExport();
  if (restart && !reducedMotion.matches) restartMotion(slides[activeIndex]);
  scheduleNext();
}

function applyRoute(slide, route) {
  const zoomFactor = state.zoomAmount / fallbackState.zoomAmount;
  slide.style.setProperty("--from-x", `${route.fromX * state.panStrength}%`);
  slide.style.setProperty("--from-y", `${route.fromY * state.panStrength}%`);
  slide.style.setProperty("--from-scale", 1 + (route.fromScale - 1) * zoomFactor);
  slide.style.setProperty("--to-x", `${route.toX * state.panStrength}%`);
  slide.style.setProperty("--to-y", `${route.toY * state.panStrength}%`);
  slide.style.setProperty("--to-scale", 1 + (route.toScale - 1) * zoomFactor);
}

function restartMotion(slide) {
  slide.classList.remove("is-animating");
  void slide.offsetWidth;
  slide.classList.add("is-animating");
}

function scheduleNext() {
  window.clearTimeout(timer);
  if (isPaused || reducedMotion.matches || document.hidden) return;
  timer = window.setTimeout(showNext, state.holdDuration);
}

function showNext() {
  const current = slides[activeIndex];
  const nextIndex = (activeIndex + 1) % slides.length;
  const next = slides[nextIndex];

  applyRoute(next, baseRoutes[nextIndex]);
  restartMotion(next);
  current.classList.add("is-leaving");
  current.classList.remove("is-active");
  next.classList.add("is-active");

  window.clearTimeout(fadeTimer);
  fadeTimer = window.setTimeout(() => current.classList.remove("is-leaving", "is-animating"), state.fadeDuration + 50);
  activeIndex = nextIndex;
  scheduleNext();
}

function setPaused(nextPaused) {
  isPaused = nextPaused;
  prototype.dataset.paused = String(isPaused);
  pauseButton.setAttribute("aria-pressed", String(isPaused));
  pauseButton.setAttribute("aria-label", isPaused ? "Play background animation" : "Pause background animation");
  pauseButton.querySelector("span").textContent = isPaused ? "▶" : "Ⅱ";
  modeReadout.textContent = isPaused ? "Paused" : "Playing";
  playButton.classList.toggle("is-active", !isPaused);
  playButton.setAttribute("aria-pressed", String(!isPaused));
  panelPauseButton.classList.toggle("is-active", isPaused);
  panelPauseButton.setAttribute("aria-pressed", String(isPaused));
  scheduleNext();
}

async function loadAuthoredState() {
  try {
    const response = await fetch(CONFIG_PATH, { cache: "no-store" });
    if (!response.ok) throw new Error("Config could not be loaded.");
    const payload = await response.json();
    return payload.state;
  } catch {
    setPanelStatus("Using fallback motion; config.json could not be loaded.");
    return fallbackState;
  }
}

function loadSavedState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function saveCurrentState() {
  const payload = buildConfigPayload();
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.state));
  } catch {
    // The managed server save remains available if storage is blocked.
  }

  try {
    const response = await fetch(SAVE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok || !result.saved) throw new Error(result.message || "Save failed.");
    authoredState = { ...state };
    setPanelStatus("Saved to config.json.");
  } catch {
    configOutput.focus();
    configOutput.select();
    setPanelStatus("Saved in this browser; use npm run dev to update config.json.");
  }
}

function buildConfigPayload() {
  return {
    schema: CONFIG_SCHEMA,
    surface: SURFACE_NAME,
    state: normalizeState(state),
  };
}

function buildConfigExport() {
  return JSON.stringify(buildConfigPayload(), null, 2);
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

async function copyText(value, successMessage) {
  try {
    await navigator.clipboard.writeText(value);
    setPanelStatus(successMessage);
  } catch {
    configOutput.value = value;
    configOutput.focus();
    configOutput.select();
    setPanelStatus("Copy blocked; selected the config instead.");
  }
}

function setPanelStatus(message) {
  if (copyStatus) copyStatus.textContent = message;
}

function formatValue(value, control) {
  return `${(value * (control.scale ?? 1)).toFixed(control.precision)}${control.unit ?? ""}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

window.__ahaKenBurnsLab = {
  getConfig: () => JSON.parse(buildConfigExport()),
  setPaused,
};

void init();
