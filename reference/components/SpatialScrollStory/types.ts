import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export const BACKDROP_CONTENT_RATIO = 0.5;
export const MIN_TITLE_REVEAL_SPAN_VH = 1;

// Keep the runtime key contract beside the public type. The lab uses this same list to reject
// hand-edited control/config JSON that no longer matches what the component can actually apply.
export const SPATIAL_MOTION_SETTING_KEYS = [
  "backdropTravelVh",
  "sheetRadiusPx",
  "shadeOpacity",
  "backdropTitleStartVh",
  "backdropTitleFullVh",
  "pageTitleStartVh",
  "pageTitleFullVh",
  "titleTravelPx",
  "backdropTitleScaleIn",
  "pageTitleScaleIn",
  "titleBlurInPx",
] as const;

export type SpatialMotionSettingKey = (typeof SPATIAL_MOTION_SETTING_KEYS)[number];
export type SpatialMotionSettings = Record<SpatialMotionSettingKey, number> & {
  /** @deprecated Ignored: headings have no exit animation. */
  backdropTitleExitStartVh?: number;
  /** @deprecated Ignored: headings have no exit animation. */
  backdropTitleScaleOut?: number;
  /** @deprecated Ignored: headings have no exit animation. */
  titleBlurOutPx?: number;
};

export type SpatialScrollStoryProps = HTMLAttributes<HTMLDivElement> & {
  settings: SpatialMotionSettings;
  /** Diagnostic labels are opt-in for shared consumers; the playground enables them by default. */
  showLayerLabels?: boolean;
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
  /** @deprecated Ignored: reveals now follow scroll only, including initially visible titles. */
  introOnMount?: boolean;
};

export type ScrollRevealGroupProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Fraction of the entry window (0–0.5), not a time delay. */
  delay?: number;
};
