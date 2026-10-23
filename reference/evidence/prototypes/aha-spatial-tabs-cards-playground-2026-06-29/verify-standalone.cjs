const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const { PNG } = require(process.env.PNGJS_MODULE || "pngjs");
const colour = require("./engine.js");
const url = process.argv[2] || "http://127.0.0.1:4178/reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/";
const output = path.resolve(process.env.QA_OUTPUT || "output/adaptive-colour-qa");

async function run() {
  const browser = await chromium.launch({ headless: true });
  const report = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 2.5 });
    const requests = [];
    page.on("request", (request) => requests.push(request.url()));
    await page.goto(`${url}component-fixture.html`);
    await page.waitForFunction(() => document.querySelector("#example").dataset.toneSource === "automatic");
    assert.equal(requests.some((request) => /\/styles\.css/.test(request)), false);
    assert.equal(requests.filter((request) => /\.js\?/.test(request)).length, 1);
    await page.locator("#contrast").fill("7.1");
    await page.waitForFunction(() => Number(document.querySelector("#example").dataset.targetContrast) === 7.1);
    for (const shift of [0, 1]) {
      await page.evaluate((left) => {
        document.querySelector("#example").style.marginLeft = `${left}px`;
        controller.refresh();
      }, shift);
      await page.waitForTimeout(100);
      const regions = await page.locator("#example .image-copy").evaluate((text) => [...text.children].flatMap((node) => {
        const range = document.createRange();
        range.selectNodeContents(node);
        return [...range.getClientRects()].map((rect) => ({ left: rect.left + scrollX - 2, top: rect.top + scrollY - 2, right: rect.right + scrollX + 2, bottom: rect.bottom + scrollY + 2 }));
      }));
      const hidden = await page.addStyleTag({ content: ".image-copy { visibility:hidden!important }" });
      const screenshot = PNG.sync.read(await page.screenshot({ fullPage: true }));
      let contrast = 21;
      for (const rect of regions) {
        for (let y = Math.floor(rect.top * 2.5); y < Math.ceil(rect.bottom * 2.5); y++) {
          for (let x = Math.floor(rect.left * 2.5); x < Math.ceil(rect.right * 2.5); x++) {
            const index = (y * screenshot.width + x) * 4;
            contrast = Math.min(contrast, colour.whiteContrast([screenshot.data[index], screenshot.data[index + 1], screenshot.data[index + 2]]));
          }
        }
      }
      await hidden.evaluate((element) => element.remove());
      assert.ok(contrast >= 7.1, `Fractional-DPR rendered contrast ${contrast}`);
      report.push({ dpr: 2.5, cssShift: shift, renderedContrast: contrast });
    }
    await page.evaluate(() => controller.update({ stacked: true }));
    await page.waitForTimeout(100);
    assert.ok(await page.locator("#example").evaluate((surface) => surface.querySelector(".image-copy").getBoundingClientRect().right <= surface.getBoundingClientRect().right));
    await page.evaluate(() => {
      document.querySelector("#example").style.width = "640px";
      controller.update({ stacked: false, direction: "right", aspect: 2, coverage: 0.8 });
    });
    await page.waitForTimeout(100);
    const layout = await page.locator("#example").evaluate((surface) => ({
      mode: surface.dataset.layout,
      padding: parseFloat(getComputedStyle(surface.querySelector(".image-content")).paddingRight),
      width: surface.getBoundingClientRect().width,
    }));
    assert.equal(layout.mode, "horizontal");
    assert.ok(Math.abs(layout.padding - layout.width * 0.06) < 0.1);
    fs.mkdirSync(output, { recursive: true });
    await page.screenshot({ path: path.join(output, "standalone-horizontal.png") });
    fs.writeFileSync(path.join(output, "standalone-report.json"), `${JSON.stringify(report, null, 2)}\n`);
    console.log("Standalone CSS, one-script loading, stacked text, horizontal spacing and fractional-DPR contrast passed.");
  } finally {
    await browser.close();
  }
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
