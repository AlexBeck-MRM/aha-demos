import type { CSSProperties } from "react";
import type { LivingGradientEffect } from "../../living-gradient/LivingGradient";

export const primaryGradientEffect = {
  kind: "living-gradient",
  behavior: "interaction",
  tone: "text"
} satisfies LivingGradientEffect;

export const persistentGradientEffect = {
  kind: "living-gradient",
  behavior: "persistent",
  tone: "text"
} satisfies LivingGradientEffect;

export const markGradientEffect = {
  kind: "living-gradient",
  behavior: "persistent",
  tone: "mark"
} satisfies LivingGradientEffect;

export function asset(name: string) {
  return `${new URL("assets/", window.location.href).toString()}${name}`;
}

export function imageStyle(name: string, extra: CSSProperties = {}) {
  return { "--image": `url("${asset(name)}")`, ...extra } as CSSProperties;
}
