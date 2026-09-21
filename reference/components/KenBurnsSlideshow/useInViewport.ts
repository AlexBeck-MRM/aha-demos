import { useEffect, useState } from "react";

export function useInViewport(
  target: Element | null,
  enabled: boolean,
  threshold = 0.15,
) {
  const [isOffscreen, setIsOffscreen] = useState(false);

  useEffect(() => {
    if (!enabled || !target || typeof IntersectionObserver === "undefined") {
      setIsOffscreen(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) {
          return;
        }

        setIsOffscreen(!entry.isIntersecting || entry.intersectionRatio < threshold);
      },
      { threshold: [0, threshold, 1] },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [enabled, target, threshold]);

  return isOffscreen;
}
