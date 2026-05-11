#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import { chromium, firefox, webkit } from "playwright";

const DEFAULTS = {
  targets: "reference/data/aha_space_competitors_top10_us.csv",
  outputDir: "reference/evidence/screenshots/aha-space-competitors-us-2026-04",
  manifest: "reference/evidence/screenshots/aha-space-competitors-us-2026-04/manifest.csv",
  viewportWidth: 1200,
  viewportHeight: 800,
  timeoutMs: 35000,
};

const browserOrder = ["chromium", "firefox", "webkit"];
const browserFactories = { chromium, firefox, webkit };
const blockedPattern =
  /(access denied|performing security verification|just a moment|verify you are human|sorry,\s*you have been blocked|request blocked|captcha|cloudflare)/i;

function parseArgs(argv) {
  const options = {
    ...DEFAULTS,
    only: new Set(),
    skipExisting: false,
  };

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
    if (arg === "--manifest") {
      options.manifest = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--timeout-ms") {
      options.timeoutMs = Number(argv[i + 1]);
      i += 1;
      continue;
    }
    if (arg === "--only") {
      const raw = argv[i + 1] ?? "";
      raw
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .forEach((value) => options.only.add(value));
      i += 1;
      continue;
    }
    if (arg === "--skip-existing") {
      options.skipExisting = true;
      continue;
    }
    if (arg === "--help") {
      console.log(`Usage: node scripts/brand/capture_competitor_homepages.mjs [options]

Options:
  --targets <path>       CSV with brand, slug, homepage_url
  --output-dir <path>    Screenshot output folder
  --manifest <path>      Manifest CSV path
  --only <slug[,slug]>   Capture only specific slugs
  --skip-existing        Skip screenshots that already exist
  --timeout-ms <ms>      Navigation timeout in milliseconds`);
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

  return lines.slice(1).map((line, index) => {
    const fields = parseCsvLine(line);
    const row = {};
    headers.forEach((header, fieldIndex) => {
      row[header] = fields[fieldIndex] ?? "";
    });
    if (!row.brand || !row.slug || !row.homepage_url) {
      throw new Error(`Invalid target row at line ${index + 2}`);
    }
    return row;
  });
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toRelPath(absPath) {
  return path.relative(process.cwd(), absPath).split(path.sep).join("/");
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
      if (await button.isVisible({ timeout: 500 })) {
        await button.click({ timeout: 2000 });
        await page.waitForTimeout(250);
      }
    } catch {}
  }

  for (const pattern of [/cookie/i, /consent/i, /privacy/i, /cookies/i]) {
    const button = page.getByRole("button", { name: pattern }).first();
    try {
      if (await button.isVisible({ timeout: 300 })) {
        await button.click({ timeout: 1200 });
        await page.waitForTimeout(200);
      }
    } catch {}
  }

  const closeSelectors = [
    'button[aria-label*="close" i]',
    '[role="button"][aria-label*="close" i]',
    'button[title*="close" i]',
    'button:has-text("×")',
    'button:has-text("✕")',
    '[class*="close" i]',
    '[class*="dismiss" i]',
  ];

  for (const selector of closeSelectors) {
    const el = page.locator(selector).first();
    try {
      if (await el.isVisible({ timeout: 500 })) {
        await el.click({ timeout: 1200 });
        await page.waitForTimeout(200);
      }
    } catch {}
  }

  await page.keyboard.press("Escape").catch(() => undefined);

  await page.evaluate(() => {
    const selectors = [
      '[id*="cookie" i]',
      '[class*="cookie" i]',
      '[id*="consent" i]',
      '[class*="consent" i]',
      '[id*="privacy" i]',
      '[class*="privacy" i]',
      '[id*="gdpr" i]',
      '[class*="gdpr" i]',
      '[id*="newsletter" i]',
      '[class*="newsletter" i]',
      '[id*="popup" i]',
      '[class*="popup" i]',
      '[aria-label*="cookie" i]',
      '[aria-label*="consent" i]',
    ];

    const viewportArea = window.innerWidth * window.innerHeight;
    for (const selector of selectors) {
      for (const node of document.querySelectorAll(selector)) {
        if (!(node instanceof HTMLElement)) continue;
        const style = window.getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        const area = rect.width * rect.height;
        if (style.display === "none" || style.visibility === "hidden") continue;
        const text = (node.textContent || "").slice(0, 800);
        const hasSignal = /(cookie|privacy|consent|gdpr|newsletter|subscribe)/i.test(text);
        const isOverlay = (style.position === "fixed" || style.position === "sticky") && area > viewportArea * 0.08;
        if (hasSignal || isOverlay) {
          node.style.display = "none";
          node.style.visibility = "hidden";
          node.style.pointerEvents = "none";
        }
      }
    }
  });
}

async function forceHideOverlays(page) {
  await page.evaluate(() => {
    const viewportArea = window.innerWidth * window.innerHeight;
    document.documentElement.style.overflow = "auto";
    document.body.style.overflow = "auto";

    for (const node of document.querySelectorAll("body *")) {
      if (!(node instanceof HTMLElement)) continue;
      const style = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      const text = (node.textContent || "").slice(0, 800);
      const area = Math.max(0, rect.width) * Math.max(0, rect.height);
      const isFixedLike = style.position === "fixed" || style.position === "sticky";
      const isDialogLike =
        node.getAttribute("role") === "dialog" ||
        node.getAttribute("aria-modal") === "true" ||
        /dialog|modal|popup|cookie|consent|privacy|newsletter|subscribe/i.test(
          `${node.id} ${node.className} ${text}`
        );
      const tooLarge = area > viewportArea * 0.06;
      const onScreen = rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;

      if (onScreen && (isDialogLike || (isFixedLike && tooLarge))) {
        node.style.display = "none";
        node.style.visibility = "hidden";
        node.style.pointerEvents = "none";
      }
    }
  });
}

async function pageHealthCheck(page) {
  const title = await page.title().catch(() => "");
  const bodyText = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
  const navStats = await page.evaluate(() => {
    const selectors = ["header a", "nav a", '[role="navigation"] a'];
    let visibleLinks = 0;
    for (const selector of selectors) {
      for (const node of document.querySelectorAll(selector)) {
        if (!(node instanceof HTMLElement)) continue;
        const rect = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        if (style.display === "none" || style.visibility === "hidden") continue;
        if (rect.width < 20 || rect.height < 10) continue;
        if (rect.bottom < 0 || rect.right < 0 || rect.top > window.innerHeight || rect.left > window.innerWidth) continue;
        visibleLinks += 1;
      }
    }
    return { visibleLinks };
  });
  const blockMatch = `${title} ${bodyText.slice(0, 3000)}`.match(blockedPattern);
  const blocked = Boolean(blockMatch) && navStats.visibleLinks < 4;

  const overlayStats = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll("body *")];
    const viewportArea = window.innerWidth * window.innerHeight;
    let largeModalCount = 0;
    let consentLikeCount = 0;

    for (const node of nodes) {
      if (!(node instanceof HTMLElement)) continue;
      const style = window.getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity || "1") < 0.1) continue;
      const rect = node.getBoundingClientRect();
      if (rect.width < 40 || rect.height < 40) continue;
      if (style.position !== "fixed") continue;
      const text = (node.textContent || "").slice(0, 800);
      const area = rect.width * rect.height;
      const coversLargeCenter =
        area > viewportArea * 0.2 &&
        rect.left < window.innerWidth * 0.85 &&
        rect.top < window.innerHeight * 0.85 &&
        rect.right > window.innerWidth * 0.15 &&
        rect.bottom > window.innerHeight * 0.15;
      if (coversLargeCenter) {
        largeModalCount += 1;
      }
      if (/(cookie|privacy|consent|gdpr|subscribe|newsletter)/i.test(text)) {
        consentLikeCount += 1;
      }
    }

    return { largeModalCount, consentLikeCount };
  });

  return {
    blocked,
    blockedReason: blocked ? `${blockMatch?.[0] || title || "blocked content"} ${bodyText.slice(0, 120).replace(/\s+/g, " ")}` : "",
    overlayIssue: overlayStats.largeModalCount > 0 || overlayStats.consentLikeCount > 0,
  };
}

async function captureWithBrowser(target, browser, options, screenshotAbs) {
  const context = await browser.newContext({
    viewport: {
      width: options.viewportWidth,
      height: options.viewportHeight,
    },
    locale: "en-US",
    colorScheme: "light",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  const page = await context.newPage();
  page.setDefaultNavigationTimeout(options.timeoutMs);
  page.setDefaultTimeout(Math.min(options.timeoutMs, 15000));

  try {
    await page.goto(target.homepage_url, { waitUntil: "domcontentloaded", timeout: options.timeoutMs });
    await Promise.allSettled([
      page.waitForLoadState("load", { timeout: 12000 }),
      page.waitForLoadState("networkidle", { timeout: 12000 }),
    ]);
    await page.waitForTimeout(1400);
    await dismissPopups(page);
    await page.waitForTimeout(600);

    let check = await pageHealthCheck(page);
    if (check.overlayIssue) {
      await forceHideOverlays(page);
      await page.waitForTimeout(300);
      check = await pageHealthCheck(page);
    }
    if (check.blocked) {
      throw new Error(`blocked:${check.blockedReason}`);
    }
    if (check.overlayIssue) {
      throw new Error("overlay:modal_or_consent_detected");
    }

    await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
    await page.screenshot({ path: screenshotAbs, fullPage: false });
    const finalUrl = page.url();

    await context.close();
    return {
      status: "captured",
      finalUrl,
      captureMethod: `playwright-${browser.browserType().name()}`,
      error: "",
    };
  } catch (error) {
    await context.close();
    return {
      status: "failed",
      finalUrl: "",
      captureMethod: `playwright-${browser.browserType().name()}`,
      error: String(error.message || error),
    };
  }
}

async function writeManifest(manifestPath, rows) {
  const header = [
    "brand",
    "slug",
    "input_url",
    "final_url",
    "screenshot_file",
    "status",
    "capture_method",
    "error",
  ];

  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(header.map((key) => csvEscape(row[key] ?? "")).join(","));
  }
  await fs.writeFile(manifestPath, `${lines.join("\n")}\n`, "utf8");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const targets = await readTargets(options.targets);
  const filteredTargets = targets.filter((target) => options.only.size === 0 || options.only.has(target.slug));
  const outputDirAbs = path.resolve(options.outputDir);
  const manifestAbs = path.resolve(options.manifest);

  await fs.mkdir(outputDirAbs, { recursive: true });

  const browsers = {};
  for (const name of browserOrder) {
    browsers[name] = await browserFactories[name].launch({
      headless: true,
      args: name === "chromium" ? ["--disable-blink-features=AutomationControlled"] : [],
    });
  }

  const rows = [];

  for (const target of filteredTargets) {
    process.stdout.write(`Capturing ${target.brand} (${target.slug})\n`);
    const screenshotAbs = path.join(outputDirAbs, `${target.slug}.png`);
    if (options.skipExisting && existsSync(screenshotAbs)) {
      rows.push({
        brand: target.brand,
        slug: target.slug,
        input_url: target.homepage_url,
        final_url: "",
        screenshot_file: toRelPath(screenshotAbs),
        status: "skipped_existing",
        capture_method: "",
        error: "",
      });
      continue;
    }

    let result = null;
    for (const browserName of browserOrder) {
      process.stdout.write(`  trying ${browserName}\n`);
      result = await captureWithBrowser(target, browsers[browserName], options, screenshotAbs);
      if (result.status === "captured") {
        break;
      }
    }

    rows.push({
      brand: target.brand,
      slug: target.slug,
      input_url: target.homepage_url,
      final_url: result?.finalUrl ?? "",
      screenshot_file: result?.status === "captured" ? toRelPath(screenshotAbs) : "",
      status: result?.status ?? "failed",
      capture_method: result?.captureMethod ?? "",
      error: result?.error ?? "",
    });
    process.stdout.write(`  -> ${result?.status ?? "failed"}${result?.error ? ` (${result.error})` : ""}\n`);
  }

  await Promise.all(Object.values(browsers).map((browser) => browser.close()));
  await writeManifest(manifestAbs, rows);

  const captured = rows.filter((row) => row.status === "captured").length;
  const failed = rows.filter((row) => row.status === "failed").length;
  process.stdout.write(`Captured: ${captured}\n`);
  process.stdout.write(`Failed: ${failed}\n`);
  process.stdout.write(`Manifest: ${toRelPath(manifestAbs)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
