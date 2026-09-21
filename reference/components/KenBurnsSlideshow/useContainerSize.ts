import { useCallback, useEffect, useState } from "react";

export type ContainerSize = {
  width: number;
  height: number;
};

export function useContainerSize<TElement extends HTMLElement>() {
  const [node, setNode] = useState<TElement | null>(null);
  const [size, setSize] = useState<ContainerSize>({ width: 0, height: 0 });
  const ref = useCallback((nextNode: TElement | null) => {
    setNode(nextNode);
  }, []);

  useEffect(() => {
    if (!node) {
      return;
    }

    const updateSize = () => {
      const rect = node.getBoundingClientRect();

      setSize((current) => {
        const next = {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };

        if (current.width === next.width && current.height === next.height) {
          return current;
        }

        return next;
      });
    };

    updateSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateSize);

      return () => {
        window.removeEventListener("resize", updateSize);
      };
    }

    const observer = new ResizeObserver(updateSize);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [node]);

  return { ref, node, size };
}
