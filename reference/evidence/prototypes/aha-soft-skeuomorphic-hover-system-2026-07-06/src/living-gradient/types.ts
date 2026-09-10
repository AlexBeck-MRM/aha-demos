export type LivingGradientBehavior = "interaction" | "persistent";

export type LivingGradientEffect = {
  kind: "living-gradient";
  behavior: LivingGradientBehavior;
  enabled?: boolean;
  tone?: "text" | "mark";
};

export type LivingGradientTargetOptions = Pick<LivingGradientEffect, "behavior" | "enabled" | "tone">;
