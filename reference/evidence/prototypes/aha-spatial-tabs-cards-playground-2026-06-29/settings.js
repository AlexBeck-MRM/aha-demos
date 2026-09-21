(function (root) {
  "use strict";

  const schema = "aha-adaptive-colour/v4";
  const photoPeaks = Object.freeze({ A: 0.9, B: 0.8 });
  const defaults = Object.freeze({
    overlayAVerticalCoverage: 60,
    overlayAHorizontalCoverage: 80,
    overlayBVerticalCoverage: 40,
    overlayBHorizontalCoverage: 80,
  });
  const ranges = Object.freeze({
    overlayAVerticalCoverage: [30, 80],
    overlayAHorizontalCoverage: [50, 100],
    overlayBVerticalCoverage: [30, 80],
    overlayBHorizontalCoverage: [50, 100],
  });

  function number(value) {
    if (value === null || value === "" || typeof value === "boolean") return undefined;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : undefined;
  }

  function normalizeState(candidate = {}) {
    const input = candidate && typeof candidate === "object" ? candidate : {};
    return Object.fromEntries(Object.entries(ranges).map(([key, [min, max]]) => {
      const value = number(input[key]) ?? defaults[key];
      return [key, Math.min(max, Math.max(min, value))];
    }));
  }

  function migrateConfig(payload = {}) {
    const source = payload?.state ?? payload;
    const input = source && typeof source === "object" && !Array.isArray(source) ? source : {};
    const notes = [];
    const candidate = { ...input };
    const legacy = Object.keys(input).some((key) => !Object.hasOwn(defaults, key));

    function assign(key, value) {
      if (number(input[key]) === undefined && value !== undefined) candidate[key] = value;
    }

    // Previous defaults follow the new contract. One intentional custom value
    // survives consolidation; conflicting old values need one explicit default.
    function consolidate(entries, fallback, label) {
      const custom = [...new Set(entries.flatMap(([key, previousDefault]) => {
        const value = number(input[key]);
        return value === undefined || value === previousDefault ? [] : [value];
      }))];
      if (custom.length > 1) {
        notes.push(`${label}: conflicting earlier values use the new default.`);
        return fallback;
      }
      return custom[0] ?? fallback;
    }

    assign("overlayAVerticalCoverage", number(input.cardGradientHeight));
    if (number(input.overlayBVerticalCoverage) === undefined) assign("overlayBVerticalCoverage", consolidate([
      ["landscapeGradientHeight", 40], ["horizontalMobileBlendHeight", 40],
    ], 40, "Overlay B vertical height"));
    const sideWidth = number(input.sideGradientWidth);
    const olderWidth = number(input.horizontalGradientWidth);
    assign("overlayBHorizontalCoverage", sideWidth !== undefined
      ? (sideWidth === 85 ? 80 : sideWidth)
      : (olderWidth === 60 ? 80 : olderWidth));

    const state = normalizeState(candidate);
    for (const key of Object.keys(defaults)) {
      const value = number(candidate[key]);
      if (value !== undefined && value !== state[key]) notes.push(`${key}: kept within the family range.`);
    }
    if (legacy) {
      notes.unshift("Earlier settings updated to the current overlay controls.");
      notes.push("Photo peaks are fixed at 90% for A and 80% for B. Both families share the curve, 60° direction, 50% sampling depth and 7:1 contrast target. The separate portrait recipe is retired.");
    }
    return { schema, state, notes };
  }

  const api = Object.freeze({ schema, photoPeaks, defaults, ranges, normalizeState, migrateConfig });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.AdaptiveColourSettings = api;
})(typeof window === "undefined" ? this : window);
