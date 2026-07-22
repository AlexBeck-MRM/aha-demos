import { useState, type KeyboardEvent } from "react";

export function useRovingTabs(ids: string[], initialId = ids[0]) {
  const [activeId, setActiveId] = useState(initialId);

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = ids.indexOf(activeId);
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? ids.length - 1
        : event.key === "ArrowRight"
          ? (currentIndex + 1) % ids.length
          : (currentIndex - 1 + ids.length) % ids.length;
    const nextId = ids[nextIndex];
    setActiveId(nextId);
    const tab = event.currentTarget.querySelector<HTMLElement>(`[role="tab"][data-tab-id="${nextId}"]`);
    tab?.focus();
  }

  return { activeId, setActiveId, onKeyDown };
}
