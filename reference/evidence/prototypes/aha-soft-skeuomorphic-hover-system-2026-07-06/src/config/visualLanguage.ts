import rawConfig from "./visual-language.json";

export type PreviewState = "rest" | "hover" | "focus" | "disabled";

export type MotionFamily = {
  scale: number;
  duration: number;
  spring: number;
  settle: number;
};

export type CardMotionFamily = MotionFamily & {
  mediaScale: number;
};

export const bodyStyleIds = ["body1", "body2", "body3"] as const;
export const bodyStyleSettingKeys = [
  "lightOffsetY",
  "lightBlur",
  "lightSpread",
  "lightOpacity",
  "shadowDepth",
  "shadowBlur",
  "shadowSpread",
  "shadowOpacity",
] as const;

export type BodyStyleId = typeof bodyStyleIds[number];
export type BodyStyleSettingKey = typeof bodyStyleSettingKeys[number];

export type BodyStyleSettings = Record<BodyStyleSettingKey, number>;
export type BodyStyles = Record<BodyStyleId, BodyStyleSettings>;

export type SectionConfig = {
  id: string;
  title: string;
  category: string;
  purpose: string;
  motion: string;
  figmaNodeId: string;
  figmaLabel: string;
};

export type VisualLanguageConfig = {
  lab: {
    title: string;
    shortTitle: string;
    status: string;
    lastUpdated: string;
  };
  motion: {
    compact: MotionFamily;
    surface: MotionFamily;
    cards: CardMotionFamily;
    reducedMotion: boolean;
  };
  colors: {
    selected: string;
  };
  layout: {
    controlHeight: number;
    compactControlHeight: number;
  };
  bodies: BodyStyles;
  shader: {
    interactionOpacity: number;
    revealDuration: number;
    revealBlur: number;
  };
  figma: {
    fileKey: string;
    fileName: string;
    styleguideNodeId: string;
    secondaryButtonNodeId: string;
  };
  navigation: Array<{ label: string; target: string }>;
  previewStates: Array<{ id: PreviewState; label: string }>;
  sections: SectionConfig[];
};

export const visualLanguageConfig = rawConfig as VisualLanguageConfig;

export type VisualLanguageSettings = Pick<
  VisualLanguageConfig,
  "motion" | "colors" | "layout" | "bodies" | "shader"
>;

export function createVisualLanguageSettings(): VisualLanguageSettings {
  return structuredClone({
    motion: visualLanguageConfig.motion,
    colors: visualLanguageConfig.colors,
    layout: visualLanguageConfig.layout,
    bodies: visualLanguageConfig.bodies,
    shader: visualLanguageConfig.shader,
  });
}

export const sectionConfigById = new Map(
  visualLanguageConfig.sections.map((section) => [section.id, section])
);

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function easingFromMotion(spring: number, settle: number) {
  const bounce = clamp(spring, 0, 1);
  const soft = clamp(settle, 0, 1);
  const x1 = 0.18 + soft * 0.06;
  const y1 = 0.8 + soft * 0.1;
  const x2 = 0.18 - bounce * 0.06;
  const y2 = 1 + bounce * 0.12;

  return `cubic-bezier(${x1.toFixed(2)}, ${y1.toFixed(2)}, ${x2.toFixed(2)}, ${y2.toFixed(2)})`;
}

export function figmaUrl(nodeId: string) {
  const { fileKey, fileName } = visualLanguageConfig.figma;
  return `https://www.figma.com/design/${fileKey}/${fileName}?node-id=${nodeId.replace(":", "-")}`;
}
