import { useEffect } from "react";
import Lenis from "lenis";

// Lerp keeps successive wheel/trackpad input on one continuous trajectory. A duration/easing
// pair restarts the curve for each input burst and creates the stop-start feel this replaces.
const SMOOTH_SCROLL_LERP = 0.07;

export function useSmoothPageScroll(forceReducedMotion = false) {
  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const configureScroll = () => {
      lenis?.destroy();
      lenis = null;

      if (forceReducedMotion || reducedMotionQuery.matches) return;

      lenis = new Lenis({
        anchors: true,
        autoRaf: true,
        gestureOrientation: "vertical",
        lerp: SMOOTH_SCROLL_LERP,
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
      });
    };

    configureScroll();
    reducedMotionQuery.addEventListener("change", configureScroll);

    return () => {
      reducedMotionQuery.removeEventListener("change", configureScroll);
      lenis?.destroy();
    };
  }, [forceReducedMotion]);
}
