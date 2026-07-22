import rawControlGroups from "./visual-language-body-controls.json";
import {
  bodyStyleIds,
  bodyStyleSettingKeys,
  visualLanguageConfig,
  type BodyStyleId,
  type BodyStyleSettingKey,
  type BodyStyles,
} from "./visualLanguage";

export const BODY_CONFIG_SCHEMA = "aha-visual-language-bodies/v1";
export const BODY_SURFACE_NAME = "AHA Visual Language Body System";
export const BODY_SAVE_ENDPOINT = "/__visual-language-lab/save-bodies";
export const BODY_STORAGE_KEY = "aha-visual-language-bodies:v1";

export type BodyNumericControl = {
  type: "range";
  key: BodyStyleSettingKey;
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  scale?: number;
  precision?: number;
};

export type BodyControlGroup = {
  id: BodyStyleId;
  title: string;
  open: boolean;
  controls: BodyNumericControl[];
};

export type BodyStyleConfig = {
  schema: typeof BODY_CONFIG_SCHEMA;
  surface: typeof BODY_SURFACE_NAME;
  bodies: BodyStyles;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function assertControlGroups(value: unknown): asserts value is BodyControlGroup[] {
  if (!Array.isArray(value)) throw new Error("Body control schema must be an array.");

  const expectedIds = new Set<string>(bodyStyleIds);
  const expectedKeys = new Set<string>(bodyStyleSettingKeys);
  const seenIds = new Set<string>();

  for (const group of value) {
    if (!isRecord(group) || typeof group.id !== "string" || !expectedIds.has(group.id)
      || typeof group.title !== "string" || typeof group.open !== "boolean"
      || !Array.isArray(group.controls) || seenIds.has(group.id)) {
      throw new Error("Body control schema contains an invalid group.");
    }
    seenIds.add(group.id);

    const seenKeys = new Set<string>();
    for (const control of group.controls) {
      if (!isRecord(control) || control.type !== "range" || typeof control.key !== "string"
        || !expectedKeys.has(control.key) || seenKeys.has(control.key)
        || typeof control.label !== "string" || typeof control.min !== "number"
        || typeof control.max !== "number" || typeof control.step !== "number"
        || !Number.isFinite(control.min) || !Number.isFinite(control.max)
        || !Number.isFinite(control.step) || control.min > control.max || control.step <= 0
        || (control.unit !== undefined && typeof control.unit !== "string")
        || (control.scale !== undefined && (typeof control.scale !== "number" || !Number.isFinite(control.scale)))
        || (control.precision !== undefined && (typeof control.precision !== "number"
          || !Number.isInteger(control.precision) || control.precision < 0))) {
        throw new Error(`Body control schema contains an invalid control in ${group.id}.`);
      }
      seenKeys.add(control.key);
    }

    if (seenKeys.size !== bodyStyleSettingKeys.length) {
      throw new Error(`Body control group ${group.id} must define every body edge setting once.`);
    }
  }

  if (seenIds.size !== bodyStyleIds.length) {
    throw new Error("Body control schema must define Body 1, Body 2, and Body 3 once.");
  }
}

const controlGroupInput: unknown = rawControlGroups;
assertControlGroups(controlGroupInput);
export const bodyControlGroups = controlGroupInput;

export function normalizeBodyStyles(candidate: unknown): BodyStyles {
  const candidateRecord = isRecord(candidate) ? candidate : {};
  const next = structuredClone(visualLanguageConfig.bodies);

  for (const group of bodyControlGroups) {
    const rawBodyCandidate = candidateRecord[group.id];
    const bodyCandidate: Record<string, unknown> = isRecord(rawBodyCandidate) ? rawBodyCandidate : {};
    for (const control of group.controls) {
      const value = Number(bodyCandidate[control.key]);
      if (Number.isFinite(value)) {
        next[group.id][control.key] = Math.min(control.max, Math.max(control.min, value));
      }
    }
  }

  return next;
}

export const authoredBodyStyles = normalizeBodyStyles(visualLanguageConfig.bodies);

export function buildBodyStyleConfig(bodies: BodyStyles): BodyStyleConfig {
  return {
    schema: BODY_CONFIG_SCHEMA,
    surface: BODY_SURFACE_NAME,
    bodies: normalizeBodyStyles(bodies),
  };
}

export function formatBodyControlValue(value: number, control: BodyNumericControl) {
  const scaled = value * (control.scale ?? 1);
  const precision = control.precision ?? (Number.isInteger(control.step) ? 0 : 2);
  return `${scaled.toFixed(precision)}${control.unit ?? ""}`;
}
