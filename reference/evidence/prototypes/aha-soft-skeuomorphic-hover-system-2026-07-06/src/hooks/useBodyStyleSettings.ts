import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  authoredBodyStyles,
  BODY_SAVE_ENDPOINT,
  BODY_STORAGE_KEY,
  buildBodyStyleConfig,
  normalizeBodyStyles,
} from "../config/bodyControls";
import type { BodyStyles } from "../config/visualLanguage";

function loadSavedBodies() {
  try {
    const raw = window.localStorage.getItem(BODY_STORAGE_KEY);
    return raw ? normalizeBodyStyles(JSON.parse(raw)) : structuredClone(authoredBodyStyles);
  } catch {
    return structuredClone(authoredBodyStyles);
  }
}

export type BodyStyleSettingsController = {
  bodies: BodyStyles;
  setBodies: Dispatch<SetStateAction<BodyStyles>>;
  status: string;
  save: () => Promise<void>;
  revert: () => void;
  copyConfig: () => Promise<void>;
  configText: string;
};

export function useBodyStyleSettings(): BodyStyleSettingsController {
  const [bodies, setBodies] = useState<BodyStyles>(loadSavedBodies);
  const [authoredBaseline, setAuthoredBaseline] = useState<BodyStyles>(() => structuredClone(authoredBodyStyles));
  const [status, setStatus] = useState("Authored body edges active.");
  const configText = useMemo(() => JSON.stringify(buildBodyStyleConfig(bodies), null, 2), [bodies]);

  const save = async () => {
    const payload = buildBodyStyleConfig(bodies);
    try {
      window.localStorage.setItem(BODY_STORAGE_KEY, JSON.stringify(payload.bodies));
    } catch {
      // The managed save endpoint remains available when browser storage is blocked.
    }

    try {
      const response = await fetch(BODY_SAVE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.saved) throw new Error(result.message || "Save failed.");
      setAuthoredBaseline(structuredClone(payload.bodies));
      setStatus("Saved to the authored body config.");
    } catch {
      setStatus("Saved in this browser; use npm run dev to update authored JSON.");
    }
  };

  const revert = () => {
    try {
      window.localStorage.removeItem(BODY_STORAGE_KEY);
    } catch {
      // The in-memory revert still applies.
    }
    setBodies(structuredClone(authoredBaseline));
    setStatus("Reverted to the last authored body config.");
  };

  const copyConfig = async () => {
    try {
      await navigator.clipboard.writeText(configText);
      setStatus("Body config copied.");
    } catch {
      setStatus("Copy was blocked; the config remains selected below.");
    }
  };

  return { bodies, setBodies, status, save, revert, copyConfig, configText };
}
