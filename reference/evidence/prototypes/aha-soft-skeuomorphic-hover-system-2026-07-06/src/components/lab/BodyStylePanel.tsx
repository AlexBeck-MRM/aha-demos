import { useState, type Dispatch, type SetStateAction } from "react";
import {
  bodyControlGroups,
  formatBodyControlValue,
  type BodyNumericControl,
} from "../../config/bodyControls";
import type {
  BodyStyleId,
  BodyStyleSettingKey,
  BodyStyles,
} from "../../config/visualLanguage";
import type { BodyStyleSettingsController } from "../../hooks/useBodyStyleSettings";

function updateBodySetting(
  setBodies: Dispatch<SetStateAction<BodyStyles>>,
  bodyId: BodyStyleId,
  key: BodyStyleSettingKey,
  value: number,
) {
  setBodies((current) => ({
    ...current,
    [bodyId]: { ...current[bodyId], [key]: value },
  }));
}

function BodyControlRow({
  bodyId,
  control,
  bodies,
  setBodies,
}: {
  bodyId: BodyStyleId;
  control: BodyNumericControl;
  bodies: BodyStyles;
  setBodies: Dispatch<SetStateAction<BodyStyles>>;
}) {
  const inputId = `${bodyId}-${control.key}`;
  const value = bodies[bodyId][control.key];

  return (
    <label className="parameterizer-row" htmlFor={inputId}>
      <span className="parameterizer-label" title={control.label}>{control.label}</span>
      <input
        className="parameterizer-control parameterizer-range"
        id={inputId}
        type="range"
        min={control.min}
        max={control.max}
        step={control.step}
        value={value}
        onChange={(event) => updateBodySetting(
          setBodies,
          bodyId,
          control.key,
          Number(event.currentTarget.value),
        )}
      />
      <output className="parameterizer-value">{formatBodyControlValue(value, control)}</output>
    </label>
  );
}

export function BodyStylePanel({ controller }: { controller: BodyStyleSettingsController }) {
  const { bodies, setBodies, status, configText, save, copyConfig, revert } = controller;
  const [folderOpen, setFolderOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(bodyControlGroups.map((group) => [group.id, group.open])),
  );

  return (
    <aside className="parameterizer-panel body-style-panel" aria-label="Body edge parameters">
      <div className="parameterizer-header">
        <div>
          <p className="tool-label">Visual language controls</p>
          <h2>Body light & shadow</h2>
        </div>
        <span className="mode-readout">Live</span>
      </div>

      <div className="parameterizer-scroll">
        {bodyControlGroups.map((group) => (
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
            <summary className="parameterizer-folder-title">
              <span>{group.title}</span>
              <span>{group.controls.length}</span>
            </summary>
            <div className="parameterizer-folder-body">
              {group.controls.map((control) => (
                <BodyControlRow
                  bodyId={group.id}
                  control={control}
                  bodies={bodies}
                  setBodies={setBodies}
                  key={control.key}
                />
              ))}
            </div>
          </details>
        ))}
      </div>

      <div className="parameterizer-actions" aria-label="Body parameter save and export actions">
        <button className="parameterizer-button" type="button" onClick={() => void save()}>Save</button>
        <button className="parameterizer-button" type="button" onClick={() => void copyConfig()}>Copy</button>
        <button className="parameterizer-button" type="button" onClick={revert}>Revert</button>
      </div>

      <textarea className="parameterizer-output" value={configText} readOnly aria-label="Current body edge config" />
      <p className="parameterizer-status" role="status" aria-live="polite">{status}</p>
    </aside>
  );
}
