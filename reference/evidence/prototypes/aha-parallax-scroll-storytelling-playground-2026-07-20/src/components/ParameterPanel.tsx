import { useState, type Dispatch, type SetStateAction } from "react";

import {
  BACKDROP_CONTENT_RATIO,
  type SpatialMotionSettings,
} from "../../../../../components/SpatialScrollStory";
import {
  controlGroups,
  formatControlValue,
  getConstrainedControlRange,
  type NumericControl,
} from "../config/settings";
import type { ParallaxSettingsController } from "../hooks/useParallaxSettings";

type ParameterPanelProps = {
  controller: ParallaxSettingsController;
  shaderPaused: boolean;
  onShaderPausedChange: (paused: boolean) => void;
  reducedMotionPreview: boolean;
  onReducedMotionPreviewChange: (reduced: boolean) => void;
  triggerHintsVisible: boolean;
  onTriggerHintsVisibleChange: (visible: boolean) => void;
  layerLabelsVisible: boolean;
  onLayerLabelsVisibleChange: (visible: boolean) => void;
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
  const { min, max } = getConstrainedControlRange(control, settings);

  return (
    <label className="parameterizer-row" htmlFor={control.key}>
      <span className="parameterizer-label" title={control.label}>{control.label}</span>
      <input
        className="parameterizer-control parameterizer-range"
        id={control.key}
        type="range"
        min={min}
        max={max}
        step={control.step}
        value={value}
        onChange={(event) => updateSetting(setSettings, control.key, Number(event.currentTarget.value))}
      />
      <output className="parameterizer-value">{formatControlValue(value, control)}</output>
    </label>
  );
}

function formatVh(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function DerivedBackdropContentTravel({ value }: { value: number }) {
  return (
    <div
      className="parameterizer-row parameterizer-row-derived"
      aria-label={`Backdrop Content travel is derived at 50 percent: plus or minus ${formatVh(value)} viewport height`}
    >
      <span className="parameterizer-label" title="Travel (derived from Layer −2)">Travel</span>
      <span className="parameterizer-derived-note">50% of Layer −2</span>
      <output className="parameterizer-value">±{formatVh(value)}vh</output>
    </div>
  );
}

export function ParameterPanel({
  controller,
  shaderPaused,
  onShaderPausedChange,
  reducedMotionPreview,
  onReducedMotionPreviewChange,
  triggerHintsVisible,
  onTriggerHintsVisibleChange,
  layerLabelsVisible,
  onLayerLabelsVisibleChange,
}: ParameterPanelProps) {
  const { settings, setSettings, status, configText, save, copyConfig, revert } = controller;
  const mode = reducedMotionPreview ? "Reduced" : shaderPaused ? "Shader paused" : "Live";
  const contentTravel = settings.backdropTravelVh * BACKDROP_CONTENT_RATIO;
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
          <h2>Scroll Reveals A + B</h2>
        </div>
        <span className="mode-readout">{mode}</span>
      </div>

      <p className="reveal-contract-note">Defaults · both reveals finish at 70vh<br />Supporting text: fixed 90→70vh per element.</p>

      <div className="parameterizer-toolbar-stack">
        <div className="parameterizer-toolbar" aria-label="Motion preview behavior">
          <button
            className={`parameterizer-button ${shaderPaused ? "" : "is-active"}`}
            type="button"
            aria-pressed={!shaderPaused}
            onClick={() => onShaderPausedChange(false)}
          >
            Shader play
          </button>
          <button
            className={`parameterizer-button ${shaderPaused ? "is-active" : ""}`}
            type="button"
            aria-pressed={shaderPaused}
            onClick={() => onShaderPausedChange(true)}
          >
            Shader pause
          </button>
          <button
            className={`parameterizer-button ${reducedMotionPreview ? "is-active" : ""}`}
            type="button"
            aria-pressed={reducedMotionPreview}
            onClick={() => onReducedMotionPreviewChange(!reducedMotionPreview)}
          >
            Reduced
          </button>
        </div>
        <div className="parameterizer-toolbar" aria-label="Diagnostic overlays">
          <button
            className={`parameterizer-button ${triggerHintsVisible ? "is-active" : ""}`}
            type="button"
            aria-pressed={triggerHintsVisible}
            title="Show title trigger lines"
            onClick={() => onTriggerHintsVisibleChange(!triggerHintsVisible)}
          >
            Triggers
          </button>
          <button
            className={`parameterizer-button ${layerLabelsVisible ? "is-active" : ""}`}
            type="button"
            aria-pressed={layerLabelsVisible}
            title="Show parallax layer labels"
            onClick={() => onLayerLabelsVisibleChange(!layerLabelsVisible)}
          >
            Layer labels
          </button>
        </div>
      </div>

      <div className="parameterizer-layer-map" aria-label="Active parallax layer map">
        <div className="parameterizer-layer-map-title">Layer map</div>
        <div className="parameterizer-layer-map-row">
          <span>−2 Backdrop</span>
          <output>±{formatVh(settings.backdropTravelVh)}vh · {formatVh(settings.backdropTravelVh)}vh bleed</output>
        </div>
        <div className="parameterizer-layer-map-row">
          <span>−1 Backdrop Content</span>
          <output>derived 50% · ±{formatVh(contentTravel)}vh</output>
        </div>
        <div className="parameterizer-layer-map-row">
          <span>0 Page</span>
          <output>fixed · 0vh</output>
        </div>
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
              {group.id === "backdrop-content" ? (
                <DerivedBackdropContentTravel value={contentTravel} />
              ) : null}
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
