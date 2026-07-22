import type { ReactNode } from "react";
import { figmaUrl, sectionConfigById } from "../../config/visualLanguage";
import { Icon } from "../Icon";
import { usePreviewState } from "./PreviewStateContext";

export function SpecimenSection({ id, size = "wide", children }: { id: string; size?: "wide" | "half" | "third"; children: ReactNode }) {
  const config = sectionConfigById.get(id);
  const previewState = usePreviewState();
  const disabled = previewState === "disabled";
  if (!config) throw new Error(`Unknown specimen section: ${id}`);

  return (
    <section className={`specimen-section specimen-${size}`} id={id} aria-labelledby={`${id}-title`}>
      <header className="specimen-header">
        <div>
          <h2 id={`${id}-title`}>{config.title}</h2>
          <p>{config.purpose}</p>
        </div>
        <div className="specimen-meta">
          <a href={figmaUrl(config.figmaNodeId)} target="_blank" rel="noreferrer">
            {config.figmaLabel} <Icon name="external-link" />
          </a>
        </div>
      </header>
      <div className="specimen-body" data-preview-state={previewState} aria-disabled={disabled || undefined} inert={disabled || undefined}>{children}</div>
    </section>
  );
}
