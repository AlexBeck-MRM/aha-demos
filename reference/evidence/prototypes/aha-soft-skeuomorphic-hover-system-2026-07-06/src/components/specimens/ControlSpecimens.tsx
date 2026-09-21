import { useState, type ReactNode } from "react";
import { Icon } from "../Icon";
import { InteractiveSurface } from "../InteractiveSurface";
import { usePreviewState } from "../lab/PreviewStateContext";
import { primaryGradientEffect } from "./shared";

export function ButtonsSpecimen() {
  return (
    <div className="figma-button-stack">
      <InteractiveSurface body={1} className="aha-button primary" effect={primaryGradientEffect} type="button">
        <span>Check heart health</span>
      </InteractiveSurface>
      <InteractiveSurface body={1} className="aha-button secondary" type="button">
        <span>Learn more</span><Icon name="arrow-right" />
      </InteractiveSurface>
      <InteractiveSurface body="flat" className="aha-button tertiary" type="button">
        <span>Download guide</span><Icon name="download" />
      </InteractiveSurface>
    </div>
  );
}

function FieldShell({ label, placeholder, helper, prefix, icon }: { label: string; placeholder: string; helper: string; prefix?: string; icon?: ReactNode }) {
  const previewState = usePreviewState();
  return (
    <label className="figma-field" data-preview-state={previewState}>
      <span className="field-label">{label}</span>
      <span className="field-shell interactive" data-body="1" data-preview-state={previewState}>
        <span className="material-layer" aria-hidden="true" />
        <span className="content-layer field-content">
          {icon ? <span className="field-icon">{icon}</span> : null}
          {prefix ? <span className="field-prefix">{prefix}</span> : null}
          <input placeholder={placeholder} disabled={previewState === "disabled"} />
        </span>
      </span>
      <span className="field-note">{helper}</span>
    </label>
  );
}

export function FieldsSpecimen() {
  return (
    <div className="field-column">
      <FieldShell label="Email address" placeholder="you@example.com" helper="We’ll only use this to send the updates you choose." icon={<Icon name="mail" />} />
      <FieldShell label="ZIP code" placeholder="10001" helper="Use your ZIP code to find local support and events." prefix="US" />
    </div>
  );
}

const labels = [
  ["recommended", "Recommended"],
  ["urgent", "Urgent"],
  ["new", "New"],
  ["professional", "For professionals"],
  ["community", "Community"],
  ["prevention", "Prevention"]
];

export function StatusLabelsSpecimen() {
  return <div className="badge-stack">{labels.map(([tone, label]) => <span className={`badge-pill ${tone}`} key={tone}>{label}</span>)}</div>;
}

function SwitchControl({ label, body, checked: initialChecked }: { label: string; body: string; checked: boolean }) {
  const [checked, setChecked] = useState(initialChecked);
  return (
    <InteractiveSurface body="flat" className="native-control switch-row" type="button" role="switch" aria-checked={checked} onClick={() => setChecked(!checked)}>
      <span className={`switch-track ${checked ? "is-on" : ""}`} aria-hidden="true"><span /></span>
      <span className="choice-copy"><strong>{label}</strong><span>{body}</span></span>
    </InteractiveSurface>
  );
}

function Choice({ type, label, body, checked, name, onChange }: { type: "checkbox" | "radio"; label: string; body: string; checked: boolean; name?: string; onChange: (checked: boolean) => void }) {
  const previewState = usePreviewState();
  return (
    <label className="native-control choice-row interactive" data-body="flat" data-preview-state={previewState}>
      <span className="material-layer" aria-hidden="true" />
      <span className="content-layer">
        <input type={type} name={name} checked={checked} disabled={previewState === "disabled"} onChange={(event) => onChange(event.target.checked)} />
        <span className="choice-copy"><strong>{label}</strong><span>{body}</span></span>
      </span>
    </label>
  );
}

export function SelectionSpecimen() {
  const [audience, setAudience] = useState<"self" | "carer">("self");
  const [healthyLiving, setHealthyLiving] = useState(true);
  const [research, setResearch] = useState(false);

  return (
    <div className="selection-board">
      <SwitchControl label="Remember my preferences" body="Keep my chosen topics ready for next time." checked />
      <SwitchControl label="Heart-health email updates" body="Send practical guidance once a week." checked={false} />
      <Choice type="radio" name="journey-owner" label="For me" body="I’m looking after my own health." checked={audience === "self"} onChange={() => setAudience("self")} />
      <Choice type="radio" name="journey-owner" label="For someone I care for" body="I’m supporting another person." checked={audience === "carer"} onChange={() => setAudience("carer")} />
      <Choice type="checkbox" label="Healthy living tips" body="Food, movement, sleep and wellbeing." checked={healthyLiving} onChange={setHealthyLiving} />
      <Choice type="checkbox" label="Research and news" body="New evidence and AHA updates." checked={research} onChange={setResearch} />
    </div>
  );
}

const segments = ["Overview", "Symptoms", "Treatment", "Living well"];

export function SegmentsSpecimen() {
  const [active, setActive] = useState(segments[0]);
  const previewState = usePreviewState();
  const previewTarget = segments.find((segment) => segment !== active);
  return (
    <InteractiveSurface as="div" body={1} className="button-group" role="group" aria-label="Condition guide view" previewStateOverride="rest">
      {segments.map((segment) => (
        <InteractiveSurface
          body="flat"
          className={`group-segment ${active === segment ? "is-active" : ""}`}
          type="button"
          aria-pressed={active === segment}
          previewStateOverride={segment === previewTarget ? previewState : "rest"}
          onClick={() => setActive(segment)}
          key={segment}
        >
          {segment}
        </InteractiveSurface>
      ))}
    </InteractiveSurface>
  );
}
