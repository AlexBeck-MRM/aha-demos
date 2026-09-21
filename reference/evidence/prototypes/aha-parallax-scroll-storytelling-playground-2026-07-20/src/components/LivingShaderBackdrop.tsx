import {
  LivingGradientLayer,
  type LivingGradientEffect,
} from "../../../aha-soft-skeuomorphic-hover-system-2026-07-06/src/living-gradient/LivingGradient";

const persistentShader: LivingGradientEffect = {
  kind: "living-gradient",
  behavior: "persistent",
  tone: "mark",
};

export function LivingShaderBackdrop() {
  return (
    <div className="living-shader-backdrop">
      <LivingGradientLayer effect={persistentShader} />
    </div>
  );
}
