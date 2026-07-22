import { useState, type Dispatch, type SetStateAction } from "react";

import type { SpatialMotionSettings } from "../../../../../components/SpatialScrollStory";
import {
  authoredConfig,
  buildConfig,
  normalizeSettings,
  SAVE_ENDPOINT,
  STORAGE_KEY,
} from "../config/settings";

const PREVIOUS_AUTHORED_IMAGE_DEPTH_PX = 420;
const PREVIOUS_AUTHORED_SURFACE_SCALE_IN = 1.08;

function loadSavedSettings() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...authoredConfig.state };

    const savedSettings = normalizeSettings(JSON.parse(raw));
    // Preserve deliberate tuning while migrating browsers that still hold the old authored depth.
    return {
      ...savedSettings,
      imageDepthPx: savedSettings.imageDepthPx === PREVIOUS_AUTHORED_IMAGE_DEPTH_PX
        ? authoredConfig.state.imageDepthPx
        : savedSettings.imageDepthPx,
      surfaceTitleScaleIn: savedSettings.surfaceTitleScaleIn === PREVIOUS_AUTHORED_SURFACE_SCALE_IN
        ? authoredConfig.state.surfaceTitleScaleIn
        : savedSettings.surfaceTitleScaleIn,
    };
  } catch {
    return { ...authoredConfig.state };
  }
}

export type ParallaxSettingsController = {
  settings: SpatialMotionSettings;
  setSettings: Dispatch<SetStateAction<SpatialMotionSettings>>;
  status: string;
  save: () => Promise<void>;
  revert: () => void;
  copyConfig: () => Promise<void>;
  configText: string;
};

export function useParallaxSettings(): ParallaxSettingsController {
  const [settings, setSettings] = useState<SpatialMotionSettings>(loadSavedSettings);
  const [baselineSettings, setBaselineSettings] = useState<SpatialMotionSettings>(() => ({ ...authoredConfig.state }));
  const [status, setStatus] = useState("Authored motion active.");
  const configText = JSON.stringify(buildConfig(settings), null, 2);

  const save = async () => {
    const payload = buildConfig(settings);
    try {
      // Static deployments cannot write source files, so browser storage preserves the same
      // control round-trip there. The managed dev server additionally updates authored JSON.
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload.state));
    } catch {
      // The managed save path remains available when browser storage is blocked.
    }

    try {
      const response = await fetch(SAVE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok || !result.saved) throw new Error(result.message || "Save failed.");
      setBaselineSettings({ ...payload.state });
      setStatus("Saved to the authored React config.");
    } catch {
      setStatus("Saved in this browser; use npm run dev to update the authored config.");
    }
  };

  const revert = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // The in-memory revert still applies.
    }
    setSettings({ ...baselineSettings });
    setStatus("Reverted to the last authored config.");
  };

  const copyConfig = async () => {
    try {
      await navigator.clipboard.writeText(configText);
      setStatus("Config copied.");
    } catch {
      setStatus("Copy was blocked; the config remains selected below.");
    }
  };

  return {
    settings,
    setSettings,
    status,
    save,
    revert,
    copyConfig,
    configText,
  };
}
