const browserType = require(process.env.PLAYWRIGHT_MODULE || "playwright")[process.env.BROWSER_ENGINE || "chromium"];
const { PNG } = require(process.env.PNGJS_MODULE || "pngjs");
// Independent WCAG calculation for screenshot pixels. Prepare the 256 channel
// values once; a rendered check can visit millions of pixels.
const linearChannels = Array.from({ length: 256 }, (_, channel) => {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
});
function whiteContrast([red, green, blue]) {
  const luminance = linearChannels[red] * 0.2126
    + linearChannels[green] * 0.7152
    + linearChannels[blue] * 0.0722;
  return 1.05 / (luminance + 0.05);
}

const assert = require("node:assert/strict");
const fs = require("node:fs");
const url = process.argv[2] || "http://127.0.0.1:4178/reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/";
const qaOutput = require("node:path").resolve(process.env.QA_OUTPUT || "output/adaptive-colour-qa");
require("node:fs").mkdirSync(qaOutput, { recursive: true });
(async () => {
  const browser = await browserType.launch({ headless: true });
  const report = [];
  try {
    for (const dpr of [1, 2]) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1e3 }, deviceScaleFactor: dpr });
      await page.goto(url);
      await page.waitForFunction(() => typeof cards !== "undefined" && document.querySelectorAll("[data-image-id]").length === cards.length);
    const expectedCount = await page.evaluate(() => cards.length);
      await page.waitForFunction((count) => {
        const surfaces = [...document.querySelectorAll("[data-image-id]")];
        return surfaces.length === count && surfaces.every((surface) => surface.dataset.toneSource === "automatic" && Number(surface.dataset.contrast) >= 4.5);
      }, expectedCount);
      for (const target of [4.5, 7, 7.1]) {
        await page.locator("#targetContrast").fill(String(target));
        await page.waitForFunction((t) => [...document.querySelectorAll("[data-image-id]")].every((e) => +e.dataset.targetContrast === t), target);
        const regions = await page.locator("[data-image-id]").evaluateAll((es) => es.map((e) => ({ id: e.dataset.imageId, model: +e.dataset.contrast, rects: [...e.querySelectorAll(".image-title,.image-body")].flatMap((n) => {
          const r = document.createRange();
          r.selectNodeContents(n);
          return [...r.getClientRects()].map((x) => ({ x: x.left + scrollX - 2, y: x.top + scrollY - 2, w: x.width + 4, h: x.height + 4 }));
        }) })));
        const hide = await page.addStyleTag({ content: ".image-copy {visibility:hidden!important}" });
        const png = PNG.sync.read(await page.screenshot({ fullPage: true }));
        for (const region of regions) {
          let ratio = 21;
          for (const r of region.rects) for (let y = Math.max(0, Math.floor(r.y * dpr)); y < Math.min(png.height, Math.ceil((r.y + r.h) * dpr)); y++) for (let x = Math.max(0, Math.floor(r.x * dpr)); x < Math.min(png.width, Math.ceil((r.x + r.w) * dpr)); x++) {
            const i = (y * png.width + x) * 4;
            ratio = Math.min(ratio, whiteContrast([png.data[i], png.data[i + 1], png.data[i + 2]]));
          }
          report.push({ dpr, target, id: region.id, model: region.model, rendered: ratio, pass: ratio >= target });
        }
        await hide.evaluate((e) => e.remove());
      }
      for (const width of (process.env.SKIP_RESPONSIVE ? [] : [320, 390, 768, 1121, 1440])) {
        await page.setViewportSize({ width, height: 1e3 });
        await page.waitForTimeout(150);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `overflow ${width}`);
        assert.equal(await page.locator("[data-image-id]").count(), expectedCount);
        assert.ok(await page.locator("[data-image-id]").evaluateAll((es) => es.every((e) => +e.dataset.contrast >= +e.dataset.targetContrast)), `target at ${width}`);
        await page.screenshot({ path: require("node:path").join(qaOutput, `width-${width}-dpr${dpr}.png`) });
      }
      await page.close();
    }
    fs.writeFileSync(require("node:path").join(qaOutput, "render-report.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ checks: report.length, failed: report.filter((r) => !r.pass), minimumMargin: Math.min(...report.map((r) => r.rendered - r.target)) }, null, 2));
  } finally {
    await browser.close();
  }
  assert.equal(report.filter((r) => !r.pass).length, 0, "Rendered background contrast below selected target");
})();
