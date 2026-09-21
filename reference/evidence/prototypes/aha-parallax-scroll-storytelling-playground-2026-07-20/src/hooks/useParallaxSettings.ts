import { useState, type Dispatch, type SetStateAction } from "react";

import type { SpatialMotionSettings } from "../../../../../components/SpatialScrollStory";
import {
  authoredConfig,
  buildConfig,
  LEGACY_STORAGE_KEY,
  migrateLegacySettings,
  migratePriorSettings,
  normalizeSettings,
  SAVE_ENDPOINT,
  STORAGE_KEY,
  V2_STORAGE_KEY,
  V3_STORAGE_KEY,
  V4_STORAGE_KEY,
} from "../config/settings";

function loadSavedSettings() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeSettings(JSON.parse(raw));

    const v4Raw = window.localStorage.getItem(V4_STORAGE_KEY);
    if (v4Raw) {
      const migrated = migratePriorSettings(JSON.parse(v4Raw));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      window.localStorage.removeItem(V4_STORAGE_KEY);
      return migrated;
    }

    const v3Raw = window.localStorage.getItem(V3_STORAGE_KEY);
    if (v3Raw) return migratePriorSettings(JSON.parse(v3Raw));

    const v2Raw = window.localStorage.getItem(V2_STORAGE_KEY);
    if (v2Raw) {
      const migrated = migratePriorSettings(JSON.parse(v2Raw));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      window.localStorage.removeItem(V4_STORAGE_KEY);
      window.localStorage.removeItem(V3_STORAGE_KEY);
      window.localStorage.removeItem(V2_STORAGE_KEY);
      return migrated;
    }

    const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacyRaw) return { ...authoredConfig.state };
    const migrated = migratePriorSettings(migrateLegacySettings(JSON.parse(legacyRaw)));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    return migrated;
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
      window.localStorage.removeItem(V4_STORAGE_KEY);
      window.localStorage.removeItem(V3_STORAGE_KEY);
      window.localStorage.removeItem(V2_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
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
      window.localStorage.removeItem(V4_STORAGE_KEY);
      window.localStorage.removeItem(V3_STORAGE_KEY);
      window.localStorage.removeItem(V2_STORAGE_KEY);
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
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
