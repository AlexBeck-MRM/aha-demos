import { useLayoutEffect, type RefObject } from "react";

type SceneOptions = {
  depthPx: number;
  titleDepthRatio?: number;
  revealSpanVh: number;
  entryLineVh?: number;
  exitLineVh?: number;
  reducedMotion: boolean;
};

const CAMERA_PERSPECTIVE_PX = 1400;
// All scenes share one camera model. Exposing perspective separately per scene would make
// equal depth values look inconsistent and adds a control without a useful design decision.
const subscribers = new Set<() => void>();
let frameRequest = 0;
let listening = false;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function runFrame() {
  frameRequest = 0;
  subscribers.forEach((subscriber) => subscriber());
}

function requestFrame() {
  if (!frameRequest) frameRequest = window.requestAnimationFrame(runFrame);
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", requestFrame, { passive: true });
  window.addEventListener("resize", requestFrame, { passive: true });
}

function stopListening() {
  if (!listening || subscribers.size > 0) return;
  listening = false;
  window.removeEventListener("scroll", requestFrame);
  window.removeEventListener("resize", requestFrame);
  if (frameRequest) window.cancelAnimationFrame(frameRequest);
  frameRequest = 0;
}

function subscribe(callback: () => void) {
  subscribers.add(callback);
  startListening();
  requestFrame();

  return () => {
    subscribers.delete(callback);
    stopListening();
  };
}

// One passive listener and one animation frame serve every scene. React state is deliberately
// kept out of this path so a long story does not rerender on every scroll event.
export function useScrollScene(
  ref: RefObject<HTMLElement | null>,
  {
    depthPx,
    titleDepthRatio = 0,
    revealSpanVh,
    entryLineVh = 100,
    exitLineVh = 58,
    reducedMotion,
  }: SceneOptions,
) {
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    let active = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry?.isIntersecting ?? false;
        node.dataset.sceneActive = String(active);
        if (active) requestFrame();
      },
      { rootMargin: "60% 0px 60%" },
    );

    const update = () => {
      if (!active && !reducedMotion) return;
      const rect = node.getBoundingClientRect();
      const viewportHeight = Math.max(1, window.innerHeight);
      const revealSpanPx = Math.max(1, viewportHeight * (revealSpanVh / 100));
      const centreOffset = rect.top + rect.height / 2 - viewportHeight / 2;
      const projection = CAMERA_PERSPECTIVE_PX / (CAMERA_PERSPECTIVE_PX + Math.max(0, depthPx));
      const depthLag = 1 - projection;
      const maxTravel = viewportHeight * depthLag * 0.5;
      const parallaxY = reducedMotion ? 0 : clamp(-centreOffset * depthLag, -maxTravel, maxTravel);
      const titleParallaxY = parallaxY * clamp(titleDepthRatio);
      // The entry line is a viewport coordinate, not an observer threshold. The observer only
      // pauses offscreen work; this line controls where the visible title reveal begins.
      const contentAnchor = rect.top + Math.min(rect.height, viewportHeight) * 0.5;
      const entryLinePx = viewportHeight * (clamp(entryLineVh, 0, 100) / 100);
      const entry = reducedMotion ? 1 : clamp((entryLinePx - contentAnchor) / revealSpanPx);
      const exitStart = viewportHeight * (clamp(exitLineVh, 0, 100) / 100);
      const exit = reducedMotion ? 0 : clamp((exitStart - rect.bottom) / (viewportHeight * 0.38));
      const sceneProgress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height));

      node.style.setProperty("--ss-scene-progress", sceneProgress.toFixed(4));
      node.style.setProperty("--ss-entry", entry.toFixed(4));
      node.style.setProperty("--ss-exit", exit.toFixed(4));
      node.style.setProperty("--ss-parallax-y", `${parallaxY.toFixed(2)}px`);
      node.style.setProperty("--ss-title-parallax-y", `${titleParallaxY.toFixed(2)}px`);
      node.style.setProperty("--ss-depth-bleed", `${Math.ceil(maxTravel + 4)}px`);
    };

    observer.observe(node);
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(node);
    const unsubscribe = subscribe(update);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      unsubscribe();
    };
  }, [depthPx, entryLineVh, exitLineVh, reducedMotion, ref, revealSpanVh, titleDepthRatio]);
}
