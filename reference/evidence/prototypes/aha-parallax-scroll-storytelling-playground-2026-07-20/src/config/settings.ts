import {
  MIN_TITLE_REVEAL_SPAN_VH,
  SPATIAL_MOTION_SETTING_KEYS,
  type SpatialMotionSettingKey,
  type SpatialMotionSettings,
} from "../../../../../components/SpatialScrollStory";
import rawConfig from "./parallax-story.json";
import rawControlGroups from "./parallax-story-controls.json";

export const CONFIG_SCHEMA = "aha-parallax-scroll-storytelling/v5";
export const SURFACE_NAME = "AHA Parallax Scroll Storytelling Lab";
export const SAVE_ENDPOINT = "/__parallax-story-lab/save-settings";
export const STORAGE_KEY = "aha-parallax-scroll-storytelling-lab:v5";
export const V4_STORAGE_KEY = "aha-parallax-scroll-storytelling-lab:v4";
export const V3_STORAGE_KEY = "aha-parallax-scroll-storytelling-lab:v3";
export const V2_STORAGE_KEY = "aha-parallax-scroll-storytelling-lab:v2";
export const LEGACY_STORAGE_KEY = "aha-parallax-scroll-storytelling-lab:v1";

export type NumericSettingKey = SpatialMotionSettingKey;

export type NumericControl = {
  type: "range";
  key: NumericSettingKey;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  scale?: number;
  precision?: number;
};

export type ControlGroup = {
  id: string;
  title: string;
  open: boolean;
  controls: NumericControl[];
};

export type ParallaxStoryConfig = {
  schema: typeof CONFIG_SCHEMA;
  surface: typeof SURFACE_NAME;
  state: SpatialMotionSettings;
};

const TITLE_REVEAL_LINE_PAIRS = [
  { start: "backdropTitleStartVh", full: "backdropTitleFullVh" },
  { start: "pageTitleStartVh", full: "pageTitleFullVh" },
] as const satisfies ReadonlyArray<{
  start: NumericSettingKey;
  full: NumericSettingKey;
}>;

type LegacySpatialMotionSettings = Partial<{
  sheetRadiusPx: number;
  shadeOpacity: number;
  backgroundTitleEntryLineVh: number;
  backgroundTitleExitLineVh: number;
  surfaceTitleEntryLineVh: number;
  titleTravelPx: number;
  titleScaleIn: number;
  titleScaleOut: number;
  surfaceTitleScaleIn: number;
  titleBlurInPx: number;
  titleRevealSpanVh: number;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertControlGroups(value: unknown): asserts value is ControlGroup[] {
  if (!Array.isArray(value)) throw new Error("Parallax control schema must be an array.");

  const expectedKeys = new Set<string>(SPATIAL_MOTION_SETTING_KEYS);
  const seenKeys = new Set<string>();
  for (const group of value) {
    if (!isRecord(group) || typeof group.id !== "string" || typeof group.title !== "string"
      || typeof group.open !== "boolean" || !Array.isArray(group.controls)) {
      throw new Error("Parallax control schema contains an invalid group.");
    }

    for (const control of group.controls) {
      if (!isRecord(control) || control.type !== "range" || typeof control.key !== "string"
        || !expectedKeys.has(control.key) || typeof control.label !== "string"
        || typeof control.min !== "number" || !Number.isFinite(control.min)
        || typeof control.max !== "number" || !Number.isFinite(control.max)
        || typeof control.step !== "number" || !Number.isFinite(control.step)
        || control.min > control.max || control.step <= 0
        || (control.unit !== undefined && typeof control.unit !== "string")
        || (control.scale !== undefined && (typeof control.scale !== "number" || !Number.isFinite(control.scale)))
        || (control.precision !== undefined && (!Number.isInteger(control.precision) || Number(control.precision) < 0))) {
        throw new Error(`Parallax control schema contains an invalid control in ${group.id}.`);
      }
      if (seenKeys.has(control.key)) throw new Error(`Duplicate parallax control: ${control.key}.`);
      seenKeys.add(control.key);
    }
  }

  if (seenKeys.size !== SPATIAL_MOTION_SETTING_KEYS.length) {
    throw new Error("Parallax control schema must define every motion setting exactly once.");
  }
}

const controlGroupInput: unknown = rawControlGroups;
assertControlGroups(controlGroupInput);
export const controlGroups = controlGroupInput;
export const controls = controlGroups.flatMap((group) => group.controls);

function assertAuthoredConfig(value: unknown): asserts value is ParallaxStoryConfig {
  if (!isRecord(value) || value.schema !== CONFIG_SCHEMA || value.surface !== SURFACE_NAME
    || !isRecord(value.state)) {
    throw new Error("The authored parallax config has an invalid envelope.");
  }

  const stateKeys = Object.keys(value.state);
  if (stateKeys.length !== controls.length
    || stateKeys.some((key) => !SPATIAL_MOTION_SETTING_KEYS.includes(key as NumericSettingKey))) {
    throw new Error("The authored parallax config does not match the control schema.");
  }

  for (const control of controls) {
    const candidate = value.state[control.key];
    if (typeof candidate !== "number" || !Number.isFinite(candidate)
      || candidate < control.min || candidate > control.max) {
      throw new Error(`The authored value for ${control.key} is outside its allowed range.`);
    }
  }

  const state = value.state as Record<NumericSettingKey, number>;
  const hasInvalidTitlePair = TITLE_REVEAL_LINE_PAIRS.some(
    ({ start, full }) => state[full] > state[start] - MIN_TITLE_REVEAL_SPAN_VH,
  );
  if (hasInvalidTitlePair) {
    throw new Error("The authored title Full-in lines must be at least 1vh above their Start lines.");
  }
}

// Fail at startup when hand-edited JSON drifts from the settings contract; a silent cast would
// defer the failure until a slider or scroll scene happens to consume the malformed value.
const authoredConfigInput: unknown = rawConfig;
assertAuthoredConfig(authoredConfigInput);
export const authoredConfig = authoredConfigInput;

export function normalizeSettings(candidate: Partial<SpatialMotionSettings> = {}) {
  const next = { ...authoredConfig.state };

  controls.forEach((control) => {
    const value = Number(candidate[control.key]);
    if (Number.isFinite(value)) {
      next[control.key] = Math.min(control.max, Math.max(control.min, value));
    }
  });

  TITLE_REVEAL_LINE_PAIRS.forEach(({ start, full }) => {
    next[full] = Math.min(next[full], next[start] - MIN_TITLE_REVEAL_SPAN_VH);
  });

  return next;
}

export function getConstrainedControlRange(
  control: NumericControl,
  settings: SpatialMotionSettings,
) {
  let { min, max } = control;
  const pair = TITLE_REVEAL_LINE_PAIRS.find(
    ({ start, full }) => control.key === start || control.key === full,
  );

  if (!pair) return { min, max };
  if (control.key === pair.start) {
    min = Math.max(min, settings[pair.full] + MIN_TITLE_REVEAL_SPAN_VH);
  } else {
    max = Math.min(max, settings[pair.start] - MIN_TITLE_REVEAL_SPAN_VH);
  }

  return { min, max };
}

export function migrateLegacySettings(candidate: LegacySpatialMotionSettings = {}) {
  const backdropStart = Number.isFinite(candidate.backgroundTitleEntryLineVh)
    ? Number(candidate.backgroundTitleEntryLineVh)
    : authoredConfig.state.backdropTitleStartVh;
  const pageStart = Number.isFinite(candidate.surfaceTitleEntryLineVh)
    ? Number(candidate.surfaceTitleEntryLineVh)
    : authoredConfig.state.pageTitleStartVh;
  const revealSpan = Number.isFinite(candidate.titleRevealSpanVh)
    ? Number(candidate.titleRevealSpanVh)
    : 50;

  return normalizeSettings({
    backdropTravelVh: authoredConfig.state.backdropTravelVh,
    sheetRadiusPx: candidate.sheetRadiusPx,
    shadeOpacity: candidate.shadeOpacity,
    backdropTitleStartVh: backdropStart,
    backdropTitleFullVh: backdropStart - revealSpan,
    pageTitleStartVh: pageStart,
    pageTitleFullVh: pageStart - revealSpan * 0.6,
    titleTravelPx: candidate.titleTravelPx,
    backdropTitleScaleIn: candidate.titleScaleIn,
    pageTitleScaleIn: candidate.surfaceTitleScaleIn,
    titleBlurInPx: candidate.titleBlurInPx,
  });
}

export function migratePriorSettings(candidate: Partial<SpatialMotionSettings> = {}) {
  return normalizeSettings({
    ...candidate,
    titleTravelPx: authoredConfig.state.titleTravelPx,
    backdropTitleScaleIn: authoredConfig.state.backdropTitleScaleIn,
    pageTitleScaleIn: authoredConfig.state.pageTitleScaleIn,
    titleBlurInPx: authoredConfig.state.titleBlurInPx,
    pageTitleStartVh: authoredConfig.state.pageTitleStartVh,
    pageTitleFullVh: authoredConfig.state.pageTitleFullVh,
    backdropTitleStartVh: authoredConfig.state.backdropTitleStartVh,
    backdropTitleFullVh: authoredConfig.state.backdropTitleFullVh,
  });
}

export function buildConfig(state: SpatialMotionSettings): ParallaxStoryConfig {
  return {
    schema: CONFIG_SCHEMA,
    surface: SURFACE_NAME,
    state: normalizeSettings(state),
  };
}

export function formatControlValue(value: number, control: NumericControl) {
  const scaled = value * (control.scale ?? 1);
  const precision = control.precision ?? (Number.isInteger(control.step) ? 0 : 2);
  return `${scaled.toFixed(precision)}${control.unit ?? ""}`;
}
