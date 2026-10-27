const test = require("node:test");
const assert = require("node:assert/strict");
const S = require("./settings.js");

test("old config adopts AA; new config and validated overrides survive save/reload", () => {
  assert.equal(S.migrateConfig({ schema: "aha-adaptive-colour/v4", state: { ...S.defaults, targetContrast: 7 } }).state.targetContrast, 4.5);
  const payload = { schema: S.schema, state: { ...S.defaults, targetContrast: 7.1 }, overrides: { habits: "#cccccc", bad: "red" } };
  const result = S.migrateConfig(payload);
  assert.equal(result.state.targetContrast, 7.1);
  assert.deepEqual(result.overrides, { habits: "#cccccc" });
  assert.equal(S.normalizeState({ targetContrast: 100 }).targetContrast, 7.1);
  assert.equal(S.normalizeState({ targetContrast: false }).targetContrast, 4.5);
});
test("single-file browser delivery matches its sources and exposes the component", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const crypto = require("node:crypto");
  const source = ["gradient-colour.js", "adapter.js"].map((name) => fs.readFileSync(path.join(__dirname, name), "utf8")).join("\n");
  const checksum = crypto.createHash("sha256").update(source).digest("hex");
  const bundle = fs.readFileSync(path.join(__dirname, "adaptive-colour.min.js"), "utf8");
  assert.ok(bundle.includes(`Source SHA256: ${checksum}`));
  const scope = { window: {} };
  require("node:vm").runInNewContext(bundle, scope);
  assert.equal(typeof scope.window.attachAdaptiveColour, "function");
  assert.throws(() => scope.window.attachAdaptiveColour({ querySelector: () => ({}) }, { targetContrast: 3 }), /Contrast must/);
});
