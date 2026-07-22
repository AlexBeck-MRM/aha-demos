import { useState, type Dispatch, type SetStateAction } from "react";

import type { SpatialMotionSettings } from "../../../../../components/SpatialScrollStory";
import {
  controlGroups,
  formatControlValue,
  type NumericControl,
} from "../config/settings";
import type { ParallaxSettingsController } from "../hooks/useParallaxSettings";

type ParameterPanelProps = {
  controller: ParallaxSettingsController;
  ambientPaused: boolean;
  onAmbientPausedChange: (paused: boolean) => void;
  reducedMotionPreview: boolean;
  onReducedMotionPreviewChange: (reduced: boolean) => void;
};

function updateSetting<K extends keyof SpatialMotionSettings>(
  setSettings: Dispatch<SetStateAction<SpatialMotionSettings>>,
  key: K,
  value: SpatialMotionSettings[K],
) {
  setSettings((current) => ({ ...current, [key]: value }));
}

function ControlRow({
  control,
  settings,
  setSettings,
}: {
  control: NumericControl;
  settings: SpatialMotionSettings;
  setSettings: Dispatch<SetStateAction<SpatialMotionSettings>>;
}) {
  const value = settings[control.key];
  return (
    <label className="parameterizer-row" htmlFor={control.key}>
      <span className="parameterizer-label" title={control.label}>{control.label}</span>
      <input
        className="parameterizer-control parameterizer-range"
        id={control.key}
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        onChange={(event) => updateSetting(setSettings, control.key, Number(event.currentTarget.value))}
      />
      <output className="parameterizer-value">{formatControlValue(value, control)}</output>
    </label>
  );
}

export function ParameterPanel({
  controller,
  ambientPaused,
  onAmbientPausedChange,
  reducedMotionPreview,
  onReducedMotionPreviewChange,
}: ParameterPanelProps) {
  const { settings, setSettings, status, configText, save, copyConfig, revert } = controller;
  const mode = reducedMotionPreview ? "Reduced" : ambientPaused ? "Paused" : "Live";
  const [folderOpen, setFolderOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(controlGroups.map((group) => [group.id, group.open])),
  );

  return (
    <aside
      className="parameterizer-panel"
      aria-label="Parallax storytelling parameters"
      data-lenis-prevent
    >
      <div className="parameterizer-header">
        <div>
          <p className="tool-label">Scroll story controls</p>
          <h2>Parallax & title reveal</h2>
        </div>
        <span className="mode-readout">{mode}</span>
      </div>

      <div className="parameterizer-toolbar" aria-label="Preview behavior">
        <button
          className={`parameterizer-button ${ambientPaused ? "" : "is-active"}`}
          type="button"
          aria-pressed={!ambientPaused}
          onClick={() => onAmbientPausedChange(false)}
        >
          Play
        </button>
        <button
          className={`parameterizer-button ${ambientPaused ? "is-active" : ""}`}
          type="button"
          aria-pressed={ambientPaused}
          onClick={() => onAmbientPausedChange(true)}
        >
          Pause
        </button>
        <button
          className={`parameterizer-button ${reducedMotionPreview ? "is-active" : ""}`}
          type="button"
          aria-pressed={reducedMotionPreview}
          onClick={() => onReducedMotionPreviewChange(!reducedMotionPreview)}
        >
          Reduce motion
        </button>
      </div>

      <div className="parameterizer-scroll">
        {controlGroups.map((group) => (
          <details
            className="parameterizer-folder"
            open={folderOpen[group.id]}
            onToggle={(event) => {
              const open = event.currentTarget.open;
              setFolderOpen((current) => (
                current[group.id] === open ? current : { ...current, [group.id]: open }
              ));
            }}
            key={group.id}
          >
            <summary className="parameterizer-folder-title"><span>{group.title}</span></summary>
            <div className="parameterizer-folder-body">
              {group.controls.map((control) => (
                <ControlRow
                  control={control}
                  settings={settings}
                  setSettings={setSettings}
                  key={control.key}
                />
              ))}
            </div>
          </details>
        ))}
      </div>

      <div className="parameterizer-actions" aria-label="Parameter save and export actions">
        <button className="parameterizer-button" type="button" onClick={() => void save()}>Save</button>
        <button className="parameterizer-button" type="button" onClick={() => void copyConfig()}>Copy Config</button>
        <button className="parameterizer-button" type="button" onClick={revert}>Revert</button>
      </div>

      <textarea className="parameterizer-output" value={configText} readOnly aria-label="Current parallax config" />
      <p className="parameterizer-status" role="status" aria-live="polite">{status}</p>
    </aside>
  );
}
