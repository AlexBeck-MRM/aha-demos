import { LivingGradientRuntime } from "../../../aha-soft-skeuomorphic-hover-system-2026-07-06/src/living-gradient/runtime";
import transitionConfigSource from "./transition-config.json";
import "./styles.css";

const destinationBackgroundUrl = new URL("./assets/destination-background-4mb.png", import.meta.url).href;

type ModeId = "fast" | "slow";
type StatusChange = { atMs: number; message: string };
type ModeConfig = {
  label: string;
  minimumVeilMs: number;
  statusAfterMs: number | null;
  statusChanges: StatusChange[];
  description: string;
};
type MotionConfig = {
  transitionE: {
    durationMs: number;
    exitEasing: string;
    enterEasing: string;
  };
  veilFadeMs: number;
  heartEnterMs: number;
  heartExitMs: number;
};
type TransitionConfig = {
  defaultMode: ModeId;
  watchdogMs: number;
  motion: MotionConfig;
  modes: Record<ModeId, ModeConfig>;
};

const transitionConfig = transitionConfigSource as TransitionConfig;
const requestedWait = Number(new URLSearchParams(window.location.search).get("wait"));
const qaWaitOverride = Number.isFinite(requestedWait) ? Math.min(Math.max(requestedWait, 0), 20_000) : 0;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Transition E is one duration with directional curves. Loading waits remain separate.
function applyTransitionE() {
  const motion = transitionConfig.motion.transitionE;
  document.documentElement.style.setProperty("--transition-e-duration", `${reducedMotion.matches ? 0 : motion.durationMs}ms`);
  document.documentElement.style.setProperty("--transition-e-exit-easing", reducedMotion.matches ? "linear" : motion.exitEasing);
  document.documentElement.style.setProperty("--transition-e-enter-easing", reducedMotion.matches ? "linear" : motion.enterEasing);
}

applyTransitionE();
reducedMotion.addEventListener("change", applyTransitionE);
document.documentElement.style.setProperty("--transition-veil-duration", `${transitionConfig.motion.veilFadeMs}ms`);
document.documentElement.style.setProperty("--transition-heart-enter-duration", `${transitionConfig.motion.heartEnterMs}ms`);
document.documentElement.style.setProperty("--transition-heart-exit-duration", `${transitionConfig.motion.heartExitMs}ms`);

type TransitionDiagnostics = {
  mode: ModeId;
  phase: "idle" | "departing" | "waiting" | "arriving" | "complete" | "recovery";
  destinationDecoded: boolean;
  destinationDecodedAt: number | null;
  routeReadyAt: number | null;
  criticalAssetRequestAt: number | null;
  criticalAssetLoadedAt: number | null;
  criticalAssetDecodedAt: number | null;
  destinationBackgroundAppliedAt: number | null;
  destinationRevealAt: number | null;
  belowFoldStartedAt: number | null;
  destinationHasBackground: boolean;
  statusShownAt: number | null;
  shaderStatus: string;
};

declare global {
  interface Window {
    __ahaPageTransition?: {
      activate: (mode?: ModeId) => Promise<void>;
      reset: () => void;
      snapshot: () => TransitionDiagnostics;
    };
  }
}

const lab = requireElement<HTMLElement>("#transition-lab");
const sourcePage = requireElement<HTMLElement>("[data-source-page]");
const destinationPage = requireElement<HTMLElement>("[data-destination-page]");
const pageViewport = requireElement<HTMLElement>("[data-page-viewport]");
const veil = requireElement<HTMLElement>("[data-transition-veil]");
const sourceCanvas = requireElement<HTMLCanvasElement>("[data-living-gradient-source]");
const shaderCanvas = requireElement<HTMLCanvasElement>(".living-gradient-canvas");
const modeOptions = requireElement<HTMLElement>("[data-mode-options]");
const pageTransitionAction = requireElement<HTMLButtonElement>("[data-page-transition-action]");
const destinationResetAction = requireElement<HTMLButtonElement>("[data-destination-reset-action]");
const transitionStatus = requireElement<HTMLElement>("[data-transition-status]");
const recoveryState = requireElement<HTMLElement>("[data-recovery-state]");
const recoveryDetail = requireElement<HTMLElement>("[data-recovery-detail]");
const retryAction = requireElement<HTMLButtonElement>("[data-retry-action]");
const cancelAction = requireElement<HTMLButtonElement>("[data-cancel-action]");

let selectedMode = transitionConfig.defaultMode as ModeId;
let transitioning = false;
let runId = 0;
let preparationGeneration = 0;
let timers: number[] = [];
let routePromise: Promise<void> | null = null;
let criticalAssetPromise: Promise<void> | null = null;
let criticalAssetAbortController: AbortController | null = null;
let criticalAssetObjectUrl: string | null = null;
let destinationDecoded = false;
let destinationDecodedAt: number | null = null;
let routeReadyAt: number | null = null;
let criticalAssetRequestAt: number | null = null;
let criticalAssetLoadedAt: number | null = null;
let criticalAssetDecodedAt: number | null = null;
let destinationBackgroundAppliedAt: number | null = null;
let destinationRevealAt: number | null = null;
let belowFoldStartedAt: number | null = null;
let statusShownAt: number | null = null;
let phase: TransitionDiagnostics["phase"] = "idle";

const gradientRuntime = new LivingGradientRuntime(sourceCanvas);
gradientRuntime.register(shaderCanvas, { behavior: "persistent", tone: "mark" });
gradientRuntime.start();
destinationPage.dataset.criticalAssetReady = "false";
destinationPage.dataset.belowFoldWork = "pending";

renderModeControls();

pageTransitionAction.addEventListener("click", () => void runTransition());
pageTransitionAction.addEventListener("pointerenter", prefetchFastCriticalAsset);
pageTransitionAction.addEventListener("focus", prefetchFastCriticalAsset);
destinationResetAction.addEventListener("click", resetTransition);
retryAction.addEventListener("click", () => {
  recoveryState.hidden = true;
  transitioning = false;
  void runTransition();
});
cancelAction.addEventListener("click", resetTransition);

window.addEventListener("beforeunload", () => gradientRuntime.destroy(), { once: true });

window.__ahaPageTransition = {
  activate: async (mode = selectedMode) => {
    selectMode(mode);
    await runTransition();
  },
  reset: resetTransition,
  snapshot: () => ({
    mode: selectedMode,
    phase,
    destinationDecoded,
    destinationDecodedAt,
    routeReadyAt,
    criticalAssetRequestAt,
    criticalAssetLoadedAt,
    criticalAssetDecodedAt,
    destinationBackgroundAppliedAt,
    destinationRevealAt,
    belowFoldStartedAt,
    destinationHasBackground: destinationPage.style.backgroundImage.length > 0,
    statusShownAt,
    shaderStatus: sourceCanvas.dataset.gradientStatus ?? "initializing",
  }),
};

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing required page-transition element: ${selector}`);
  return element;
}

function renderModeControls() {
  modeOptions.replaceChildren();
  (Object.entries(transitionConfig.modes) as [ModeId, ModeConfig][]).forEach(([id, mode]) => {
    const label = document.createElement("label");
    label.className = "mode-option";
    label.innerHTML = `
      <input type="radio" name="connection-mode" value="${id}" ${id === selectedMode ? "checked" : ""}>
      <span>${mode.label.replace(" connection", "")}</span>
    `;
    const input = label.querySelector<HTMLInputElement>("input")!;
    input.addEventListener("change", () => selectMode(id));
    modeOptions.append(label);
  });
}

function selectMode(mode: ModeId) {
  if (!(mode in transitionConfig.modes) || transitioning) return;
  if (selectedMode !== mode && mode === "slow") discardDestinationPreparation();
  selectedMode = mode;
  modeOptions.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
    input.checked = input.value === mode;
  });
}

function prefetchFastCriticalAsset() {
  if (selectedMode !== "fast" || transitioning) return;
  void loadCriticalDestinationAsset(0).catch(() => undefined);
}

async function prepareDestinationRoute() {
  if (routePromise) return routePromise;
  const generation = preparationGeneration;
  routePromise = (async () => {
    await document.fonts.ready;
    await nextPaint();
    if (destinationPage.getBoundingClientRect().width <= 0) throw new Error("Destination layout could not be prepared.");
    if (generation !== preparationGeneration) return;
    destinationDecoded = true;
    destinationDecodedAt = performance.now();
    routeReadyAt = destinationDecodedAt;
  })().catch((error) => {
    if (generation === preparationGeneration) routePromise = null;
    throw error;
  });
  return routePromise;
}

async function loadCriticalDestinationAsset(simulatedTransferMs: number) {
  if (criticalAssetPromise) return criticalAssetPromise;
  const generation = preparationGeneration;
  const image = new Image();
  image.decoding = "async";
  criticalAssetRequestAt = performance.now();

  criticalAssetPromise = (async () => {
    criticalAssetAbortController = new AbortController();
    const response = await fetch(destinationBackgroundUrl, {
      cache: simulatedTransferMs > 0 ? "no-store" : "force-cache",
      signal: criticalAssetAbortController.signal,
    });
    if (!response.ok) throw new Error(`The destination background returned ${response.status}.`);
    const blob = simulatedTransferMs > 0
      ? await readResponseWithPacing(response, simulatedTransferMs)
      : await response.blob();
    if (generation !== preparationGeneration) return;
    criticalAssetObjectUrl = URL.createObjectURL(blob);
    const appliedUrl = criticalAssetObjectUrl;
    await setImageSource(image, appliedUrl);

    if (generation !== preparationGeneration) return;
    criticalAssetLoadedAt = performance.now();
    await image.decode();
    if (generation !== preparationGeneration) return;
    criticalAssetDecodedAt = performance.now();
    destinationPage.style.backgroundImage = `url("${appliedUrl}")`;
    destinationBackgroundAppliedAt = performance.now();
    destinationPage.dataset.criticalAssetReady = "true";
    await nextPaint();
  })().catch((error) => {
    if (generation === preparationGeneration) {
      criticalAssetPromise = null;
      criticalAssetAbortController = null;
    }
    throw error;
  });

  return criticalAssetPromise;
}

function setImageSource(image: HTMLImageElement, source: string) {
  return new Promise<void>((resolve, reject) => {
    image.addEventListener("load", () => resolve(), { once: true });
    image.addEventListener("error", () => reject(new Error("The destination background could not be loaded.")), { once: true });
    image.src = source;
  });
}

async function readResponseWithPacing(response: Response, minimumDurationMs: number) {
  if (!response.body) {
    const blob = await response.blob();
    await delay(minimumDurationMs);
    return blob;
  }

  const reader = response.body.getReader();
  const totalBytes = Number(response.headers.get("content-length")) || 4_039_103;
  const chunks: ArrayBuffer[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value.slice().buffer as ArrayBuffer);
    await delay(minimumDurationMs * (value.byteLength / totalBytes));
  }
  return new Blob(chunks, { type: response.headers.get("content-type") ?? "image/png" });
}

async function runTransition() {
  if (transitioning) return;
  const thisRun = ++runId;
  const mode = transitionConfig.modes[selectedMode];
  const minimumVeilMs = Math.max(mode.minimumVeilMs, qaWaitOverride);
  transitioning = true;
  phase = "departing";
  destinationRevealAt = null;
  statusShownAt = null;
  clearTimers();
  setControlsDisabled(true);
  transitionStatus.textContent = "";
  recoveryState.hidden = true;
  lab.setAttribute("aria-busy", "true");
  setBackgroundInert(true);
  document.body.classList.add("is-transitioning");
  pageViewport.classList.add("is-departing");
  veil.classList.remove("is-hiding-logo", "is-revealing");
  veil.setAttribute("aria-hidden", "false");
  veil.classList.add("is-visible");

  // Cover, route preparation, and the critical image request begin together.
  // The opaque veil hides layout and paint work; below-the-fold work waits until reveal.
  const destinationReady = Promise.all([
    prepareDestinationRoute(),
    loadCriticalDestinationAsset(selectedMode === "slow" ? minimumVeilMs : 0),
  ]);
  const visualMinimum = delay(minimumVeilMs);
  const watchdog = delay(transitionConfig.watchdogMs);

  mode.statusChanges.forEach((change) => {
    timers.push(window.setTimeout(() => {
      if (runId !== thisRun || phase === "complete" || phase === "recovery") return;
      transitionStatus.textContent = getTruthfulStatus(change.message);
      transitionStatus.classList.add("is-visible");
      statusShownAt ??= performance.now();
    }, change.atMs));
  });

  await delay(reducedMotion.matches ? 0 : transitionConfig.motion.transitionE.durationMs);
  if (runId !== thisRun) return;
  phase = "waiting";

  const result = await Promise.race([
    Promise.all([destinationReady, visualMinimum]).then(() => "ready" as const).catch(() => "failed" as const),
    watchdog.then(() => "timeout" as const),
  ]);

  if (runId !== thisRun) return;
  if (result !== "ready") {
    showRecovery(result === "failed" ? "The destination route or its main image could not be prepared." : "The destination route or its main image is still loading.");
    return;
  }

  await revealDestination(thisRun);
}

async function revealDestination(thisRun: number) {
  phase = "arriving";
  transitionStatus.classList.remove("is-visible");
  transitionStatus.textContent = "";

  // Finish the branded loading beat before exposing any destination pixels.
  // The heart uses opacity only, so it does not compete with the page motion.
  veil.classList.add("is-hiding-logo");
  await nextPaint();
  await delay(transitionConfig.motion.heartExitMs + 20);
  if (runId !== thisRun) return;

  pageViewport.classList.remove("is-departing");
  pageViewport.classList.add("show-destination", "is-arriving");
  sourcePage.setAttribute("aria-hidden", "true");
  sourcePage.inert = true;
  destinationPage.setAttribute("aria-hidden", "false");
  destinationPage.inert = false;
  await nextPaint();
  if (runId !== thisRun) return;
  destinationRevealAt = performance.now();
  const arrivalComplete = delay((reducedMotion.matches ? 0 : transitionConfig.motion.transitionE.durationMs) + 40);
  veil.classList.add("is-revealing");
  await delay(transitionConfig.motion.veilFadeMs + 20);
  if (runId !== thisRun) return;
  veil.classList.remove("is-visible", "is-hiding-logo", "is-revealing");
  veil.setAttribute("aria-hidden", "true");
  await arrivalComplete;
  if (runId !== thisRun) return;
  pageViewport.classList.remove("is-arriving");
  document.body.classList.remove("is-transitioning");
  lab.setAttribute("aria-busy", "false");
  setBackgroundInert(false);
  transitioning = false;
  phase = "complete";
  setControlsDisabled(false);
  destinationResetAction.focus({ preventScroll: true });
  scheduleBelowFoldWork(thisRun);
}

function getTruthfulStatus(fallback: string) {
  if (routeReadyAt !== null && criticalAssetDecodedAt !== null) return "Preparing the page…";
  if (routeReadyAt !== null) return fallback;
  return "Loading the next page…";
}

function scheduleBelowFoldWork(thisRun: number) {
  timers.push(window.setTimeout(() => {
    if (runId !== thisRun || phase !== "complete") return;
    belowFoldStartedAt = performance.now();
    destinationPage.dataset.belowFoldWork = "started";
  }, 250));
}

function showRecovery(detail: string) {
  phase = "recovery";
  clearTimers();
  criticalAssetAbortController?.abort();
  criticalAssetAbortController = null;
  criticalAssetPromise = null;
  transitionStatus.classList.remove("is-visible");
  transitionStatus.textContent = "";
  recoveryDetail.textContent = detail;
  recoveryState.hidden = false;
  retryAction.focus({ preventScroll: true });
}

function resetTransition() {
  runId += 1;
  clearTimers();
  transitioning = false;
  phase = "idle";
  destinationRevealAt = null;
  statusShownAt = null;
  document.body.classList.remove("is-transitioning");
  pageViewport.classList.remove("is-departing", "show-destination", "is-arriving");
  sourcePage.setAttribute("aria-hidden", "false");
  sourcePage.inert = false;
  destinationPage.setAttribute("aria-hidden", "true");
  destinationPage.inert = true;
  veil.classList.remove("is-visible", "is-hiding-logo", "is-revealing");
  veil.setAttribute("aria-hidden", "true");
  recoveryState.hidden = true;
  transitionStatus.classList.remove("is-visible");
  transitionStatus.textContent = "";
  lab.setAttribute("aria-busy", "false");
  setBackgroundInert(false);
  setControlsDisabled(false);
  discardDestinationPreparation();
}

function discardDestinationPreparation() {
  preparationGeneration += 1;
  criticalAssetAbortController?.abort();
  criticalAssetAbortController = null;
  if (criticalAssetObjectUrl) URL.revokeObjectURL(criticalAssetObjectUrl);
  criticalAssetObjectUrl = null;
  routePromise = null;
  criticalAssetPromise = null;
  destinationDecoded = false;
  destinationDecodedAt = null;
  routeReadyAt = null;
  criticalAssetRequestAt = null;
  criticalAssetLoadedAt = null;
  criticalAssetDecodedAt = null;
  destinationBackgroundAppliedAt = null;
  belowFoldStartedAt = null;
  destinationPage.style.removeProperty("background-image");
  destinationPage.dataset.criticalAssetReady = "false";
  destinationPage.dataset.belowFoldWork = "pending";
}

function setControlsDisabled(disabled: boolean) {
  modeOptions.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
    input.disabled = disabled;
  });
}

function setBackgroundInert(inert: boolean) {
  lab.inert = inert;
}

function clearTimers() {
  timers.forEach((timer) => window.clearTimeout(timer));
  timers = [];
}

function delay(milliseconds: number) {
  return new Promise<void>((resolve) => {
    const timer = window.setTimeout(resolve, Math.max(0, milliseconds));
    timers.push(timer);
  });
}

function nextPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}
