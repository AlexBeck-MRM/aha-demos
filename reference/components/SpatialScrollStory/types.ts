import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

// Keep the runtime key contract beside the public type. The lab uses this same list to reject
// hand-edited control/config JSON that no longer matches what the component can actually apply.
export const SPATIAL_MOTION_SETTING_KEYS = [
  "imageDepthPx",
  "titleDepthRatio",
  "sheetRadiusPx",
  "shadeOpacity",
  "kenBurnsZoom",
  "kenBurnsPan",
  "kenBurnsDurationMs",
  "backgroundTitleEntryLineVh",
  "backgroundTitleExitLineVh",
  "surfaceTitleEntryLineVh",
  "titleTravelPx",
  "titleScaleIn",
  "titleScaleOut",
  "surfaceTitleScaleIn",
  "titleBlurInPx",
  "titleBlurOutPx",
  "titleRevealSpanVh",
] as const;

export type SpatialMotionSettingKey = (typeof SPATIAL_MOTION_SETTING_KEYS)[number];
export type SpatialMotionSettings = Record<SpatialMotionSettingKey, number>;

export type SpatialScrollStoryProps = HTMLAttributes<HTMLDivElement> & {
  settings: SpatialMotionSettings;
  ambientPaused?: boolean;
  /** Test/preview override. User preference is always detected automatically. */
  forceReducedMotion?: boolean;
  children: ReactNode;
};

export type FocalPoint = {
  x: number;
  y: number;
};

export type ParallaxImageSectionProps = HTMLAttributes<HTMLElement> & {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt?: string;
  focalPoint?: FocalPoint;
  height?: CSSProperties["height"];
  motionIndex?: number;
  priority?: boolean;
  children?: ReactNode;
};

export type ParallaxBackdropSectionProps = HTMLAttributes<HTMLElement> & {
  backdrop: ReactNode;
  height?: CSSProperties["height"];
  shade?: boolean;
  children?: ReactNode;
};

export type ForegroundSectionProps = HTMLAttributes<HTMLElement> & {
  height?: CSSProperties["height"];
  children: ReactNode;
};

export type ScrollRevealLine = {
  text: string;
  accent?: boolean;
};

export type ScrollRevealTitleProps = Omit<HTMLAttributes<HTMLHeadingElement>, "children"> & {
  as?: "h1" | "h2" | "h3";
  lines: ScrollRevealLine[];
  tone?: "image" | "surface";
  introOnMount?: boolean;
};

export type ScrollRevealGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  delay?: number;
};
