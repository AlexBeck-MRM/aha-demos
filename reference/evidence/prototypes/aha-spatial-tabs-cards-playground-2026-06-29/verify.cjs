const test = require("node:test");
const assert = require("node:assert/strict");
const E = require("./engine.js");
const S = require("./settings.js");
test("grey samples stay grey; transparent pixels cannot introduce a colour", () => {
  const sample = E.averageColour(Uint8ClampedArray.from([100, 100, 100, 255, 255, 0, 0, 0, 200, 200, 200, 128]));
  assert.equal(sample[0], sample[1]);
  assert.equal(sample[1], sample[2]);
  const tone = E.solveTone(sample, 4.5);
  assert.equal(tone.rgb[0], tone.rgb[1]);
  assert.equal(tone.rgb[1], tone.rgb[2]);
  assert.throws(() => E.averageColour(Uint8ClampedArray.from([255, 0, 0, 0])));
});
test("the actual cover crop respects focal position for portrait and horizontal layouts", () => {
  assert.deepEqual(E.cropGeometry(1e3, 500, 200, 400, [1, 0.5]), { x: -600, y: 0, width: 800, height: 400 });
  assert.deepEqual(E.cropGeometry(500, 1e3, 400, 200, [0.5, 1]), { x: 0, y: -600, width: 400, height: 800 });
  assert.throws(() => E.cropGeometry(0, 500, 200, 400));
});
test("all slider values meet their unrounded target and higher contrast never lightens a shade", () => {
  for (const sample of [[255, 255, 255], [210, 80, 40], [60, 180, 140], [10, 10, 10]]) {
    let previous = sample;
    for (let tenth = 45; tenth <= 71; tenth++) {
      const result = E.solveTone(sample, tenth / 10);
      assert.ok(result.passes && E.whiteContrast(result.rgb) >= tenth / 10);
      result.rgb.forEach((channel, i) => assert.ok(channel <= previous[i]));
      previous = result.rgb;
    }
  }
});
test("white photograph and weak gradient fail explicitly, never return a false pass", () => {
  const field = Float32Array.from([255 * 0.9, 255 * 0.9, 255 * 0.9, 0.1]);
  assert.equal(E.solveTone([100, 100, 100], 4.5, (rgb) => E.contrastAgainstPhoto(field, rgb)).passes, false);
  assert.throws(() => E.contrastField({ density: 1, width: 1, height: 1, pixels: new Uint8ClampedArray(4) }, [], {}));
});
test("left and right gradients mirror, and CSS and analysis share identical stops", () => {
  const args = { width: 1e3, height: 400, coverage: 0.8, opacity: 0.8 };
  const left = E.gradientModel({ ...args, direction: "left" }), right = E.gradientModel({ ...args, direction: "right" });
  for (let x = 0; x <= 1e3; x += 25) for (let y = 0; y <= 400; y += 25) assert.ok(Math.abs(E.gradientAlpha(left, x, y) - E.gradientAlpha(right, 1e3 - x, y)) < 1e-10);
  assert.ok(E.gradientCss(left).includes("in srgb"));
});
test("old config adopts AA; new config and validated overrides survive save/reload", () => {
  assert.equal(S.migrateConfig({ schema: "aha-adaptive-colour/v4", state: { ...S.defaults, targetContrast: 7 } }).state.targetContrast, 4.5);
  const payload = { schema: S.schema, state: { ...S.defaults, targetContrast: 7.1 }, overrides: { habits: "#cccccc", bad: "red" } };
  const result = S.migrateConfig(payload);
  assert.equal(result.state.targetContrast, 7.1);
  assert.deepEqual(result.overrides, { habits: "#cccccc" });
  assert.equal(S.normalizeState({ targetContrast: 100 }).targetContrast, 7.1);
  assert.equal(S.normalizeState({ targetContrast: false }).targetContrast, 4.5);
});
test("bounded readback retains full-image contrast coordinates", () => {
  const pixels = Uint8ClampedArray.from([10, 20, 30, 255, 80, 90, 100, 255, 180, 190, 200, 255, 230, 240, 250, 255]);
  const metadata = { height: 1, density: 1, offsetX: 0, offsetY: 0, originY: 0 };
  const full = { ...metadata, width: 4, originX: 0, pixels };
  const bounded = { ...metadata, width: 2, originX: 1, pixels: pixels.slice(4, 12) };
  const regions = [{ left: 1, top: 0, right: 3, bottom: 1 }];
  const model = E.gradientModel({ width: 4, height: 1, coverage: 1, opacity: 0.9 });
  assert.deepEqual(E.contrastField(bounded, regions, model), E.contrastField(full, regions, model));
});
test("a short-circuited search still reports the true final worst contrast", () => {
  const field = Float32Array.from([0, 0, 0, 1, 70, 70, 70, 0.7, 20, 30, 40, 0.8]);
  const result = E.solveTone([240, 220, 200], 4.5, (rgb, minimum) => E.contrastAgainstPhoto(field, rgb, minimum));
  assert.equal(result.passes, true);
  assert.equal(result.contrast, E.contrastAgainstPhoto(field, result.rgb));
  assert.ok(result.contrast >= 4.5);
});
test("single-file browser delivery matches its sources and exposes the component", () => {
  const fs = require("node:fs");
  const path = require("node:path");
  const crypto = require("node:crypto");
  const source = ["engine.js", "adapter.js"].map((name) => fs.readFileSync(path.join(__dirname, name), "utf8")).join("\n");
  const checksum = crypto.createHash("sha256").update(source).digest("hex");
  const bundle = fs.readFileSync(path.join(__dirname, "adaptive-colour.min.js"), "utf8");
  assert.ok(bundle.includes(`Source SHA256: ${checksum}`));
  const scope = { window: {} };
  require("node:vm").runInNewContext(bundle, scope);
  assert.equal(typeof scope.window.attachAdaptiveColour, "function");
  assert.throws(() => scope.window.attachAdaptiveColour({ querySelector: () => ({}) }, { targetContrast: 3 }), /Contrast must/);
});
