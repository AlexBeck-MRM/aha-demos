import { useEffect, useState } from "react";

export function usePageVisibility(enabled: boolean) {
  const [isHidden, setIsHidden] = useState(() => {
    if (!enabled || typeof document === "undefined") {
      return false;
    }

    return document.visibilityState === "hidden";
  });

  useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      setIsHidden(false);
      return;
    }

    const updateVisibility = () => {
      setIsHidden(document.visibilityState === "hidden");
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [enabled]);

  return isHidden;
}
