import { useLayoutEffect, type RefObject } from "react";

import { BACKDROP_CONTENT_RATIO, MIN_TITLE_REVEAL_SPAN_VH } from "./types";

type SceneOptions = {
  layer: "backdrop" | "page";
  backdropTravelVh: number;
  titleStartVh: number;
  titleFullVh: number;
  reducedMotion: boolean;
};

const subscribers = new Set<() => void>();
let frameRequest = 0;
let listening = false;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function progressBetweenViewportLines(anchorPx: number, startVh: number, fullVh: number, viewportHeight: number) {
  const safeStartVh = clamp(startVh, 1, 100);
  const safeFullVh = clamp(fullVh, 0, safeStartVh - MIN_TITLE_REVEAL_SPAN_VH);
  const startPx = viewportHeight * (safeStartVh / 100);
  const fullPx = viewportHeight * (safeFullVh / 100);
  return clamp((startPx - anchorPx) / Math.max(1, startPx - fullPx));
}

function getLayoutTopWithinScene(element: HTMLElement, scene: HTMLElement) {
  let offsetTop = 0;
  let current: HTMLElement | null = element;

  while (current && current !== scene) {
    offsetTop += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return current === scene ? offsetTop : null;
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
    layer,
    backdropTravelVh,
    titleStartVh,
    titleFullVh,
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
      const sceneProgress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height));
      const safeBackdropTravelVh = Math.max(0, backdropTravelVh);
      const backdropYVh = reducedMotion || layer === "page"
        ? 0
        : (sceneProgress * 2 - 1) * safeBackdropTravelVh;
      const backdropContentYVh = backdropYVh * BACKDROP_CONTENT_RATIO;
      const backdropContentYPx = viewportHeight * (backdropContentYVh / 100);
      // Measure each element in layout coordinates plus ONLY its outer parallax movement.
      // Reading the reveal's transformed rect here would feed scale/translation back into progress.
      const reveals = node.querySelectorAll<HTMLElement>("[data-scroll-reveal-title], [data-scroll-reveal-group]");
      reveals.forEach((reveal) => {
        const layoutTop = getLayoutTopWithinScene(reveal, node);
        const anchor = rect.top + (layoutTop ?? Math.min(rect.height, viewportHeight) * 0.5) + backdropContentYPx;
        const isTitle = reveal.hasAttribute("data-scroll-reveal-title");
        const entry = reducedMotion ? 1 : progressBetweenViewportLines(
          anchor, isTitle ? titleStartVh : 90, isTitle ? titleFullVh : 70, viewportHeight,
        );
        reveal.style.setProperty(isTitle ? "--ss-title-entry" : "--ss-group-progress", entry.toFixed(4));
      });

      node.style.setProperty("--ss-backdrop-y", `${backdropYVh.toFixed(3)}vh`);
      node.style.setProperty("--ss-backdrop-content-y", `${backdropContentYVh.toFixed(3)}vh`);
      node.style.setProperty("--ss-depth-bleed", `calc(${safeBackdropTravelVh.toFixed(3)}vh + 4px)`);
    };

    update();
    observer.observe(node);
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(node);
    node.querySelectorAll<HTMLElement>("[data-scroll-reveal-title], [data-scroll-reveal-group]")
      .forEach((reveal) => resizeObserver.observe(reveal));
    const unsubscribe = subscribe(update);

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      unsubscribe();
    };
  }, [backdropTravelVh, layer, reducedMotion, ref, titleFullVh, titleStartVh]);
}
