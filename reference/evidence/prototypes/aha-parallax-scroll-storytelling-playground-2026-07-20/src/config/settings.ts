import {
  SPATIAL_MOTION_SETTING_KEYS,
  type SpatialMotionSettingKey,
  type SpatialMotionSettings,
} from "../../../../../components/SpatialScrollStory";
import rawConfig from "./parallax-story.json";
import rawControlGroups from "./parallax-story-controls.json";

export const CONFIG_SCHEMA = "aha-parallax-scroll-storytelling/v1";
export const SURFACE_NAME = "AHA Parallax Scroll Storytelling Lab";
export const SAVE_ENDPOINT = "/__parallax-story-lab/save-settings";
export const STORAGE_KEY = "aha-parallax-scroll-storytelling-lab:v1";

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

  return next;
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
