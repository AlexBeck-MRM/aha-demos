const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const assert = require("node:assert/strict");
const url = process.argv[2] || "http://127.0.0.1:4178/reference/evidence/prototypes/aha-spatial-tabs-cards-playground-2026-06-29/";
const qaOutput = require("node:path").resolve(process.env.QA_OUTPUT || "output/adaptive-colour-qa");
require("node:fs").mkdirSync(qaOutput, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1e3 }, deviceScaleFactor: 2 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(url);
    await page.waitForFunction(() => typeof cards !== "undefined" && document.querySelectorAll("[data-image-id]").length === cards.length);
    const expectedCount = await page.evaluate(() => cards.length);
    await page.waitForFunction((count) => {
      const surfaces = [...document.querySelectorAll("[data-image-id]")];
      return surfaces.length === count && surfaces.every((surface) => surface.dataset.toneSource === "automatic" && Number(surface.dataset.contrast) >= 4.5);
    }, expectedCount);
    let checks = 0;
    for (const target of [4.5, 5.8, 7, 7.1]) for (const setting of ["minimum", "maximum"]) {
      await page.locator("#targetContrast").fill(String(target));
      for (const key of ["overlayAVerticalCoverage", "overlayAHorizontalCoverage", "overlayBVerticalCoverage", "overlayBHorizontalCoverage"]) {
        const range = page.locator("#" + key);
        await range.fill(await range.getAttribute(setting === "minimum" ? "min" : "max"));
      }
      await page.waitForTimeout(120);
      assert.ok(await page.locator("[data-image-id]").evaluateAll((es) => es.every((e) => +e.dataset.contrast >= +e.dataset.targetContrast)));
      checks += expectedCount;
    }
    await page.locator("[data-reset-config]").click();
    await page.locator("summary").filter({ hasText: "Colour override" }).click();
    await page.locator("[data-override-enabled]").check();
    await page.locator("[data-override-colour]").fill("#ffffff");
    await page.waitForTimeout(100);
    assert.ok(await page.locator('[data-image-id="habits"]').evaluate((e) => e.dataset.toneSource === "override" && +e.dataset.contrast >= 4.5));
    checks++;
    await page.locator("[data-override-enabled]").uncheck();
    await page.evaluate(() => {
      const image = document.querySelector('[data-image-id="horizontal-right"] img');
      image.src = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="400"><path fill="red" d="M0 0h500v400H0z"/><path fill="blue" d="M500 0h500v400H500z"/></svg>');
    });
    await page.waitForFunction(() => document.querySelector('[data-image-id="horizontal-right"]').dataset.sampleTone === "#0000ff");
    checks++;
    await page.evaluate(() => document.querySelector('[data-image-id="card-horizontal"] .image-body').textContent = "Long copy that must remain readable. ".repeat(40));
    await page.waitForFunction(() => document.querySelector('[data-image-id="card-horizontal"]').dataset.fallbackReason === "space");
    checks++;
    assert.ok(await page.locator('[data-image-id="card-horizontal"]').evaluate((e) => +e.dataset.contrast >= +e.dataset.targetContrast));
    await page.evaluate(() => document.querySelector('[data-image-id="bright"] img').src = "missing-image-test.png");
    await page.waitForFunction(() => document.querySelector('[data-image-id="bright"]').dataset.fallbackReason === "image");
    checks++;
    assert.ok(await page.locator('[data-image-id="bright"]').evaluate((e) => e.dataset.toneSource === "fallback" && e.dataset.contentPlacement === "below" && +e.dataset.contrast >= 4.5));
    await page.locator('[data-image-id="bright"] .image-body').evaluate(node => { node.style.color = 'black'; });
    await page.waitForFunction(() => document.querySelector('[data-image-id="bright"]').dataset.verification === 'unverified');
    assert.equal(await page.locator('[data-image-id="bright"]').getAttribute('data-contrast'), '');
    checks++;
    await page.locator('[data-image-id="bright"] .image-body').evaluate(node => { node.style.removeProperty('color'); });
    await page.waitForFunction(() => document.querySelector('[data-image-id="bright"]').dataset.verification === 'verified');
    checks++;
    await page.evaluate(() => document.querySelector('[data-image-id="bright"] img').src = "assets/figma/card-women-1.webp");
    await page.waitForFunction(() => document.querySelector('[data-image-id="bright"]').dataset.toneSource === "automatic");
    checks++;
    await page.evaluate(() => document.querySelector('[data-image-id="habits"] .image-body').innerHTML = '<span style="opacity:.5"><strong>Nested text</strong></span>');
    await page.waitForFunction(() => document.querySelector('[data-image-id="habits"]').dataset.error === 'unsupported-text-style');
    assert.ok(await page.locator('[data-image-id="habits"]').evaluate(e => e.dataset.verification === "unverified" && e.dataset.contrast === ""));
    checks++;
    // A solid fallback must not label unsupported foreground paint as verified.
    const stacked = page.locator('[data-image-id="horizontal-mobile"]');
    assert.equal(await stacked.getAttribute('data-content-placement'), 'below');
    for (const markup of ['<span style="color:rgb(0,0,0)">Dark text</span>', '<span style="opacity:.5">Translucent text</span>']) {
      await stacked.locator('.image-body').evaluate((node, html) => { node.innerHTML = html; }, markup);
      await page.waitForFunction(() => document.querySelector('[data-image-id="horizontal-mobile"]').dataset.error === 'unsupported-text-style');
      assert.ok(await stacked.evaluate(node => node.dataset.verification === 'unverified' && node.dataset.contrast === ''));
      checks++;
      await stacked.locator('.image-body').evaluate(node => { node.textContent = 'Text on the approved solid panel.'; });
      await page.waitForFunction(() => document.querySelector('[data-image-id="horizontal-mobile"]').dataset.verification === 'verified');
      checks++;
    }
    assert.deepEqual(errors, []);
    await page.goto(url + "integration.html");
    await page.waitForFunction(() => document.querySelector("#result").textContent.startsWith("automatic"));
    await page.locator("#contrast").fill("7.1");
    await page.waitForFunction(() => +document.querySelector("#example").dataset.targetContrast === 7.1);
    assert.ok(await page.locator("#example").evaluate((e) => +e.dataset.contrast >= 7.1));
    checks++;
    await page.screenshot({ path: require("node:path").join(qaOutput, "minimal-integration.png") });
    console.log(JSON.stringify({ examples: expectedCount, behaviourChecks: checks, consoleErrors: errors }, null, 2));
  } finally {
    await browser.close();
  }
})();
