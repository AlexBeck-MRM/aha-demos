(function(root) {
  "use strict";
  const schema = "aha-adaptive-colour/v5";
  const photoPeaks = Object.freeze({ A: 0.9, B: 0.8 });
  const defaults = Object.freeze({
    targetContrast: 4.5,
    overlayAVerticalCoverage: 60,
    overlayAHorizontalCoverage: 80,
    overlayBVerticalCoverage: 40,
    overlayBHorizontalCoverage: 80
  });
  const ranges = Object.freeze({
    targetContrast: [4.5, 7.1],
    overlayAVerticalCoverage: [30, 80],
    overlayAHorizontalCoverage: [50, 100],
    overlayBVerticalCoverage: [30, 80],
    overlayBHorizontalCoverage: [50, 100]
  });
  function number(value) {
    if (value === null || value === "" || typeof value === "boolean") return void 0;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : void 0;
  }
  function normalizeState(candidate = {}) {
    const input = candidate && typeof candidate === "object" ? candidate : {};
    return Object.fromEntries(Object.entries(ranges).map(([key, [min, max]]) => {
      const value = number(input[key]) ?? defaults[key];
      return [key, Math.min(max, Math.max(min, value))];
    }));
  }
  function normalizeOverrides(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([key, colour]) => /^[a-z0-9-]{1,40}$/.test(key) && typeof colour === "string" && /^#[0-9a-f]{6}$/i.test(colour)));
  }
  function migrateConfig(payload = {}) {
    const source = payload?.state ?? payload;
    const input = source && typeof source === "object" && !Array.isArray(source) ? source : {};
    const notes = [];
    const candidate = { ...input };
    const legacy = Object.keys(input).some((key) => !Object.hasOwn(defaults, key));
    function assign(key, value) {
      if (number(input[key]) === void 0 && value !== void 0) candidate[key] = value;
    }
    function consolidate(entries, fallback, label) {
      const custom = [...new Set(entries.flatMap(([key, previousDefault]) => {
        const value = number(input[key]);
        return value === void 0 || value === previousDefault ? [] : [value];
      }))];
      if (custom.length > 1) {
        notes.push(`${label}: conflicting earlier values use the new default.`);
        return fallback;
      }
      return custom[0] ?? fallback;
    }
    assign("overlayAVerticalCoverage", number(input.cardGradientHeight));
    if (number(input.overlayBVerticalCoverage) === void 0) assign("overlayBVerticalCoverage", consolidate([
      ["landscapeGradientHeight", 40],
      ["horizontalMobileBlendHeight", 40]
    ], 40, "Overlay B vertical height"));
    const sideWidth = number(input.sideGradientWidth);
    const olderWidth = number(input.horizontalGradientWidth);
    assign("overlayBHorizontalCoverage", sideWidth !== void 0 ? sideWidth === 85 ? 80 : sideWidth : olderWidth === 60 ? 80 : olderWidth);
    if (payload?.schema !== schema) {
      candidate.targetContrast = defaults.targetContrast;
      notes.push("Contrast now defaults to AA (4.5:1); use the live control to compare up to 7.1:1.");
    }
    const state = normalizeState(candidate);
    for (const key of Object.keys(defaults)) {
      const value = number(candidate[key]);
      if (value !== void 0 && value !== state[key]) notes.push(`${key}: kept within the family range.`);
    }
    if (legacy) {
      notes.unshift("Earlier settings updated to the current overlay controls.");
      notes.push("Photo peaks are fixed at 90% for A and 80% for B. Both families share the curve, 60° direction, 50% sampling depth and a selectable contrast target. The separate portrait recipe is retired.");
    }
    return { schema, state, overrides: normalizeOverrides(payload?.overrides), notes };
  }
  const api = Object.freeze({ schema, photoPeaks, defaults, ranges, normalizeState, normalizeOverrides, migrateConfig });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.AdaptiveColourSettings = api;
})(typeof window === "undefined" ? this : window);
