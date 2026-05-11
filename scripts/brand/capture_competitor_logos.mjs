#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { chromium, firefox, webkit } from "playwright";

const DEFAULTS = {
  targets: "reference/data/aha_space_competitors_top10_us.csv",
  outputDir: "reference/evidence/logos/aha-space-competitors-us-2026-04",
  timeoutMs: 35000,
};

const browserOrder = ["chromium", "firefox", "webkit"];
const browserFactories = { chromium, firefox, webkit };

function parseArgs(argv) {
  const options = { ...DEFAULTS, only: new Set() };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--targets") {
      options.targets = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--output-dir") {
      options.outputDir = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--only") {
      const raw = argv[i + 1] ?? "";
      raw.split(",").map((value) => value.trim()).filter(Boolean).forEach((value) => options.only.add(value));
      i += 1;
      continue;
    }
    if (arg === "--help") {
      console.log("Usage: node scripts/brand/capture_competitor_logos.mjs [--only slug1,slug2]");
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  return options;
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values;
}

async function readTargets(csvPath) {
  const content = await fs.readFile(csvPath, "utf8");
  const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const fields = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = fields[index] ?? "";
    });
    return row;
  });
}

async function dismissPopups(page) {
  const textButtons = [
    "Accept",
    "Accept all",
    "Allow all",
    "I agree",
    "Agree",
    "Continue",
    "Got it",
    "Dismiss",
    "Close",
    "No thanks",
    "Not now",
    "Reject all",
    "Only necessary",
    "Use necessary cookies only",
    "Accept selection",
    "Allow selection",
    "Alle akzeptieren",
    "Akzeptieren",
    "Ich stimme zu",
    "Verstanden",
    "Nur notwendige Cookies verwenden",
    "Cookies zulassen",
  ];
  for (const label of textButtons) {
    const button = page.getByRole("button", { name: new RegExp(`^${label}$`, "i") }).first();
    try {
      if (await button.isVisible({ timeout: 400 })) {
        await button.click({ timeout: 1200 });
        await page.waitForTimeout(200);
      }
    } catch {}
  }

  const keywordButtons = [/cookie/i, /consent/i, /privacy/i, /cookies/i];
  for (const pattern of keywordButtons) {
    const button = page.getByRole("button", { name: pattern }).first();
    try {
      if (await button.isVisible({ timeout: 300 })) {
        await button.click({ timeout: 1200 });
        await page.waitForTimeout(200);
      }
    } catch {}
  }

  await page.keyboard.press("Escape").catch(() => undefined);
}

function candidateScore(box, selector, index) {
  const area = box.width * box.height;
  const topLeftBonus = Math.max(0, 400 - box.x) + Math.max(0, 180 - box.y);
  const widthPenalty = Math.abs(box.width - 180);
  const heightPenalty = Math.abs(box.height - 48) * 3;
  const selectorBonus = /svg|img/.test(selector) ? 120 : 0;
  return area + topLeftBonus + selectorBonus - widthPenalty - heightPenalty - index * 10;
}

async function bestLogoCandidate(page, selectors) {
  const candidates = [];

  for (const selector of selectors) {
    const count = await page.locator(selector).count().catch(() => 0);
    for (let index = 0; index < Math.min(count, 4); index += 1) {
      const locator = page.locator(selector).nth(index);
      try {
        if (!(await locator.isVisible({ timeout: 300 }))) continue;
        const box = await locator.boundingBox();
        if (!box) continue;
        if (box.x > 420 || box.y > 220) continue;
        if (box.width < 55 || box.height < 18) continue;
        if (box.width > 420 || box.height > 180) continue;
        candidates.push({ locator, selector, box, score: candidateScore(box, selector, index) });
      } catch {}
    }
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0] ?? null;
}

async function captureLogo(target, browser, options, outputPath) {
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 },
    locale: "en-US",
    colorScheme: "light",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();
  page.setDefaultNavigationTimeout(options.timeoutMs);
  page.setDefaultTimeout(12000);

  const selectors = [
    'header a[href="/"] img',
    'header a[href="/"] svg',
    'header a[href="/"] picture img',
    'header a[href="/"]',
    'header a[href="."] img',
    'header a[href="."] svg',
    'header a[href="."]',
    'header img[alt*="logo" i]',
    'img[alt*="logo" i]',
    'header [class*="logo" i] img',
    'header [class*="logo" i] svg',
    'header [class*="logo" i]',
    'header [class*="brand" i] img',
    'header [class*="brand" i] svg',
    'header [class*="brand" i]',
    'img[src*="logo" i]',
    'header svg[aria-label*="logo" i]',
    'header svg',
    'a[href="/"] svg',
    'a[href="/"] img',
    '.navbar-brand img',
    '.navbar-brand svg',
    '.navbar-brand',
    '.site-logo img',
    '.site-logo svg',
    '.site-logo',
  ];

  try {
    await page.goto(target.homepage_url, { waitUntil: "domcontentloaded", timeout: options.timeoutMs });
    await Promise.allSettled([
      page.waitForLoadState("load", { timeout: 12000 }),
      page.waitForLoadState("networkidle", { timeout: 12000 }),
    ]);
    await page.waitForTimeout(1000);
    await dismissPopups(page);
    await page.waitForTimeout(300);

    const candidate = await bestLogoCandidate(page, selectors);
    if (candidate) {
      await candidate.locator.screenshot({ path: outputPath });
      await context.close();
      return {
        status: "captured",
        method: `playwright-${browser.browserType().name()}`,
        selector: candidate.selector,
      };
    }

    const fallback = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(target.homepage_url)}&sz=256`;
    const response = await fetch(fallback);
    if (response.ok) {
      const bytes = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(outputPath, bytes);
      await context.close();
      return { status: "captured", method: "favicon-fallback", selector: "favicon" };
    }

    await context.close();
    return { status: "failed", method: `playwright-${browser.browserType().name()}`, selector: "" };
  } catch {
    await context.close();
    return { status: "failed", method: `playwright-${browser.browserType().name()}`, selector: "" };
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const targets = (await readTargets(options.targets)).filter((target) => options.only.size === 0 || options.only.has(target.slug));
  const outputDirAbs = path.resolve(options.outputDir);
  await fs.mkdir(outputDirAbs, { recursive: true });

  const browsers = {};
  for (const name of browserOrder) {
    browsers[name] = await browserFactories[name].launch({
      headless: true,
      args: name === "chromium" ? ["--disable-blink-features=AutomationControlled"] : [],
    });
  }

  for (const target of targets) {
    const outputPath = path.join(outputDirAbs, `${target.slug}.png`);
    process.stdout.write(`Capturing logo ${target.brand}\n`);
    let result = null;
    for (const name of browserOrder) {
      result = await captureLogo(target, browsers[name], options, outputPath);
      if (result.status === "captured") break;
    }
    process.stdout.write(`  -> ${result?.status ?? "failed"} ${result?.selector ?? ""}\n`);
  }

  await Promise.all(Object.values(browsers).map((browser) => browser.close()));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
