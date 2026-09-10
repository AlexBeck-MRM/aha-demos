import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { LivingGradientLayer, type LivingGradientEffect } from "../living-gradient/LivingGradient";
import type { PreviewState } from "../config/visualLanguage";
import { usePreviewState } from "./lab/PreviewStateContext";

export type BodyLevel = "flat" | 1 | 2 | 3;

type SurfaceProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  body?: BodyLevel;
  media?: ReactNode;
  type?: "button" | "submit" | "reset";
  href?: string;
  disabled?: boolean;
  effect?: LivingGradientEffect;
  previewStateOverride?: PreviewState;
};

export function InteractiveSurface({
  as: Component = "button",
  className = "",
  children,
  body,
  media,
  effect,
  disabled,
  previewStateOverride,
  ...props
}: SurfaceProps) {
  const globalPreviewState = usePreviewState();
  const previewState = globalPreviewState === "disabled"
    ? "disabled"
    : previewStateOverride ?? globalPreviewState;
  const ariaDisabled = props["aria-disabled"];
  const globallyDisabled = globalPreviewState === "disabled";
  const resolvedDisabled = Boolean(disabled || globallyDisabled);
  const forceEffectVisible = effect?.behavior === "interaction" && ["hover", "focus"].includes(previewState);
  const resolvedEffect = effect ? {
    ...effect,
    behavior: forceEffectVisible ? "persistent" as const : effect.behavior,
    enabled: effect.enabled !== false && !resolvedDisabled && ariaDisabled !== true && ariaDisabled !== "true"
  } : null;
  const isNativeButton = Component === "button";

  return (
    <Component
      {...props}
      className={`interactive ${className}`}
      data-body={body}
      data-preview-state={previewState}
      disabled={isNativeButton ? resolvedDisabled : undefined}
      aria-disabled={!isNativeButton && resolvedDisabled ? true : ariaDisabled}
      tabIndex={!isNativeButton && resolvedDisabled ? -1 : props.tabIndex}
    >
      <span className="material-layer" aria-hidden="true">
        {resolvedEffect ? <LivingGradientLayer effect={resolvedEffect} /> : null}
      </span>
      {media ? <span className="media-layer" aria-hidden="true">{media}</span> : null}
      <span className="content-layer">{children}</span>
    </Component>
  );
}
