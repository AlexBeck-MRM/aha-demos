import { visualLanguageConfig, type PreviewState } from "../../config/visualLanguage";

export function GlobalStateBar({ state, onChange }: { state: PreviewState; onChange: (state: PreviewState) => void }) {
  return (
    <div className="global-state-bar" aria-label="Global component preview state">
      <span className="state-bar-label">Preview state</span>
      <div className="state-tabs" role="tablist" aria-label="Apply a state to every component">
        {visualLanguageConfig.previewStates.map((option) => (
          <button
            type="button"
            role="tab"
            aria-selected={state === option.id}
            className={state === option.id ? "is-active" : ""}
            onClick={() => onChange(option.id)}
            key={option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
