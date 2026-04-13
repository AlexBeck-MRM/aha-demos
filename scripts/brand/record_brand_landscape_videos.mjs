import fs from "fs/promises";
import path from "path";
import { spawnSync } from "child_process";
import { chromium, firefox, webkit } from "playwright";

const viewport = { width: 1920, height: 1200 };
const targetDurationSec = 10;
const catalogCandidates = [
  path.join(process.cwd(), "output", "playwright", "brand-landscape-images", "catalogue.md"),
  path.join(process.cwd(), "output", "playwright", "brand-landscape", "catalogue.md")
];
const videoRoot = path.join(process.cwd(), "output", "playwright", "brand-landscape-videos");
const videoTempRoot = path.join(videoRoot, "_tmp");

const hardBlockSignals = [
  /just a moment/i,
  /performing security verification/i,
  /verify you are human/i,
  /attention required/i,
  /checking your browser/i,
  /request blocked/i,
  /sorry,\s*you have been blocked/i,
  /access denied/i,
  /performance & security by cloudflare/i
];
const browserFactories = { firefox, chromium, webkit };
const browserOrder = ["firefox", "chromium", "webkit"];
const captureUrlOverrides = new Map([
  ["breakthrough t1d", "https://web.archive.org/web/20250201022911/https://www.breakthrought1d.org/"],
  ["the als association", "https://web.archive.org/web/20250201042504/https://www.als.org/"],
  ["ashoka", "https://web.archive.org/web/20250123101720/http://www.ashoka.org/en-gb"]
]);

function toPosix(inputPath) {
  return inputPath.split(path.sep).join("/");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

function splitRow(rowLine) {
  return rowLine
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
}

function extractUrlFromMarkdownLink(cell) {
  const match = cell.match(/\((https?:\/\/[^)]+)\)/i);
  return match ? match[1] : "";
}

function extractPathFromMarkdownLink(cell) {
  const match = cell.match(/\(([^)]+)\)/);
  return match ? match[1] : "";
}

function linkCell(value) {
  return `[${value}](${value})`;
}

function fileExists(target) {
  return fs
    .access(target)
    .then(() => true)
    .catch(() => false);
}

function runCommand(command, args) {
  const result = spawnSync(command, args, { stdio: "pipe", encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`${command} failed: ${result.stderr || result.stdout || "unknown error"}`);
  }
  return result.stdout.trim();
}

function probeDuration(filePath) {
  const output = runCommand("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    filePath
  ]);
  return Number.parseFloat(output || "0") || 0;
}

function normalizeVideo(rawVideoPath, outputVideoPath) {
  const duration = probeDuration(rawVideoPath);
  const startAt = duration > targetDurationSec ? duration - targetDurationSec : 0;
  runCommand("ffmpeg", [
    "-y",
    "-v",
    "error",
    "-ss",
    startAt.toFixed(3),
    "-i",
    rawVideoPath,
    "-t",
    String(targetDurationSec),
    "-vf",
    "fps=30,scale=1920:1200:flags=lanczos",
    "-vsync",
    "cfr",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "23",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
    outputVideoPath
  ]);
}

async function findCatalogPath() {
  for (const candidate of catalogCandidates) {
    if (await fileExists(candidate)) {
      return candidate;
    }
  }
  throw new Error("Could not find catalogue.md in expected locations.");
}

function detectImageRoot(rows) {
  for (const row of rows) {
    const screenshotPath = extractPathFromMarkdownLink(row.screenshotCell || "");
    if (!screenshotPath || screenshotPath === "-") {
      continue;
    }
    const marker = `/${row.category}/`;
    const markerIndex = screenshotPath.indexOf(marker);
    if (markerIndex > 0) {
      return screenshotPath.slice(0, markerIndex);
    }
  }
  return "output/playwright/brand-landscape-images";
}

async function readCatalogue() {
  const cataloguePath = await findCatalogPath();
  const text = await fs.readFile(cataloguePath, "utf8");
  const lines = text.split("\n");

  const headerIndex = lines.findIndex((line) => line.startsWith("| Category |"));
  if (headerIndex < 0) {
    throw new Error("No catalogue table header found.");
  }

  const dividerIndex = headerIndex + 1;
  if (!lines[dividerIndex] || !lines[dividerIndex].startsWith("| ---")) {
    throw new Error("No catalogue table divider found.");
  }

  const rows = [];
  let cursor = dividerIndex + 1;
  while (cursor < lines.length && lines[cursor].trim().startsWith("|")) {
    const cells = splitRow(lines[cursor]);
    if (cells.length >= 8) {
      if (cells.length >= 9) {
        rows.push({
          category: cells[0],
          brand: cells[1],
          urlCell: cells[2],
          screenshotCell: cells[3],
          videoCell: cells[4],
          captureMethod: cells[5],
          logoCell: cells[6],
          statusCell: cells[7],
          notesCell: cells[8]
        });
      } else {
        rows.push({
          category: cells[0],
          brand: cells[1],
          urlCell: cells[2],
          screenshotCell: cells[3],
          videoCell: "-",
          captureMethod: cells[4],
          logoCell: cells[5],
          statusCell: cells[6],
          notesCell: cells[7]
        });
      }
    }
    cursor += 1;
  }

  const imageRoot = detectImageRoot(rows);

  const enrichedRows = rows.map((row) => {
    const websiteUrl = extractUrlFromMarkdownLink(row.urlCell);
    if (!websiteUrl) {
      throw new Error(`Missing URL for ${row.brand}`);
    }
    let screenshotPath = extractPathFromMarkdownLink(row.screenshotCell);
    if (!screenshotPath || screenshotPath === "-") {
      screenshotPath = toPosix(path.join(imageRoot, row.category, `${slugify(row.brand)}.png`));
    }
    return {
      ...row,
      websiteUrl,
      screenshotPath,
      videoPath: toPosix(path.join("output/playwright/brand-landscape-videos", row.category, `${slugify(row.brand)}.mp4`))
    };
  });

  return { cataloguePath, lines, headerIndex, dividerIndex, rows: enrichedRows, tailIndex: cursor, imageRoot };
}

async function ensureOutputFolders(rows, imageRoot) {
  await fs.mkdir(videoRoot, { recursive: true });
  await fs.rm(videoTempRoot, { recursive: true, force: true });
  await fs.mkdir(videoTempRoot, { recursive: true });

  const categories = [...new Set(rows.map((row) => row.category))];
  await Promise.all(
    categories.flatMap((category) => [
      fs.mkdir(path.join(videoRoot, category), { recursive: true }),
      fs.mkdir(path.join(process.cwd(), imageRoot, category), { recursive: true })
    ])
  );
}

async function addStabilityStyles(page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        scroll-behavior: auto !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        caret-color: transparent !important;
      }
      video { animation: none !important; }
    `
  });
}

async function dismissPopups(page) {
  const initialTitle = await page.title().catch(() => "");
  if (/just a moment|security verification|verify you are human/i.test(initialTitle)) {
    return;
  }

  const labels = [
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
    "Not now"
  ];

  for (let pass = 0; pass < 3; pass += 1) {
    for (const label of labels) {
      const button = page.getByRole("button", { name: new RegExp(`^${label}$`, "i") }).first();
      try {
        if (await button.isVisible({ timeout: 250 })) {
          await button.click({ timeout: 1200 });
          await page.waitForTimeout(120);
        }
      } catch {
        continue;
      }
    }

    const selectors = [
      'button[aria-label*="close" i]',
      '[role="button"][aria-label*="close" i]',
      'button[title*="close" i]',
      '[data-testid*="close" i]',
      '[class*="cookie" i] button',
      '[id*="cookie" i] button',
      '[class*="consent" i] button',
      '[id*="consent" i] button',
      '[class*="gdpr" i] button',
      'button:has-text("×")',
      'button:has-text("✕")'
    ];
    for (const selector of selectors) {
      const locator = page.locator(selector).first();
      try {
        if (await locator.isVisible({ timeout: 250 })) {
          await locator.click({ timeout: 1200 });
          await page.waitForTimeout(120);
        }
      } catch {
        continue;
      }
    }

    await page.keyboard.press("Escape").catch(() => undefined);

    await page.evaluate(() => {
      const targets = [
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
        '[role="dialog"]',
        '[aria-modal="true"]'
      ];

      const viewportArea = window.innerWidth * window.innerHeight;
      for (const selector of targets) {
        for (const element of document.querySelectorAll(selector)) {
          if (!(element instanceof HTMLElement)) {
            continue;
          }
          const style = window.getComputedStyle(element);
          if (style.display === "none" || style.visibility === "hidden") {
            continue;
          }
          const rect = element.getBoundingClientRect();
          const area = rect.width * rect.height;
          const text = (element.textContent || "").slice(0, 1400);
          const isLikelyBlocking =
            (style.position === "fixed" || style.position === "sticky") && area > viewportArea * 0.08;
          const isKnownPopup = /(cookie|consent|privacy|gdpr|newsletter|subscribe|alert)/i.test(text);
          if (isLikelyBlocking || isKnownPopup) {
            element.style.display = "none";
            element.style.visibility = "hidden";
            element.style.pointerEvents = "none";
          }
        }
      }
    });
    await page.waitForTimeout(120);
  }
}

async function isBlocked(page) {
  const currentUrl = page.url().toLowerCase();
  const title = await page.title().catch(() => "");
  const body = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");
  const signalText = `${title}\n${body.slice(0, 4000)}`;
  if (currentUrl.includes("/cdn-cgi/challenge-platform/")) {
    return true;
  }
  return hardBlockSignals.some((pattern) => pattern.test(signalText));
}

async function waitUntilUnblocked(page, timeoutMs = 15_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (!(await isBlocked(page))) {
      return true;
    }
    await page.waitForTimeout(1200);
  }
  return !(await isBlocked(page));
}

async function clickMenuDrawers(page) {
  const candidates = await page
    .locator('header button, nav button, [role="navigation"] button, button[aria-expanded], button[aria-controls], [aria-haspopup="true"]')
    .elementHandles();

  const scored = [];
  for (const handle of candidates) {
    try {
      const data = await handle.evaluate((node) => {
        const element = node;
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        if (style.display === "none" || style.visibility === "hidden") {
          return null;
        }
        const rawLabel = (element.getAttribute("aria-label") || element.textContent || "").trim();
        const classText = `${element.className || ""} ${element.id || ""}`.toLowerCase();
        const hasPopupAttrs =
          element.getAttribute("aria-haspopup") === "true" ||
          element.hasAttribute("aria-expanded") ||
          element.hasAttribute("aria-controls");
        return {
          x: rect.x,
          y: rect.y,
          w: rect.width,
          h: rect.height,
          label: rawLabel,
          classText,
          hasPopupAttrs
        };
      });
      if (!data) {
        continue;
      }
      if (data.y > 300 || data.w < 20 || data.h < 18 || data.w > 420) {
        continue;
      }

      const label = data.label.toLowerCase();
      if (!label || /(donate|login|sign in|search|cart|shop now|register)/i.test(label)) {
        continue;
      }

      let score = 0;
      if (data.hasPopupAttrs) {
        score += 3;
      }
      if (/(menu|drawer|hamburger|toggle|expand|accordion|nav)/i.test(data.classText)) {
        score += 2;
      }
      if (/(about|resources|what we do|get involved|our work|research|learn|support)/i.test(label)) {
        score += 1;
      }
      if (score <= 0) {
        continue;
      }

      scored.push({ handle, ...data, score });
    } catch {
      continue;
    }
  }

  scored.sort((a, b) => b.score - a.score || a.x - b.x);
  const selected = [];
  for (const entry of scored) {
    const duplicate = selected.some((picked) => Math.abs(picked.x - entry.x) < 28 && Math.abs(picked.y - entry.y) < 18);
    if (!duplicate) {
      selected.push(entry);
    }
    if (selected.length >= 4) {
      break;
    }
  }

  for (const entry of selected) {
    try {
      await entry.handle.click({ timeout: 1400 });
      await page.waitForTimeout(580);
      await dismissPopups(page);
      await page.keyboard.press("Escape").catch(() => undefined);
      await page.waitForTimeout(180);
    } catch {
      continue;
    }
  }
}

async function steppedScroll(page, fromY, toY, totalMs) {
  const steps = 14;
  for (let index = 1; index <= steps; index += 1) {
    const progress = index / steps;
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - ((-2 * progress + 2) ** 2) / 2;
    const target = Math.round(fromY + (toY - fromY) * eased);
    await page.evaluate((y) => window.scrollTo(0, y), target);
    await page.waitForTimeout(Math.floor(totalMs / steps));
    if (index % 4 === 0) {
      await dismissPopups(page);
    }
  }
}

async function recordSequence(page) {
  const startedAt = Date.now();
  await page.evaluate(() => window.scrollTo(0, 0));
  await dismissPopups(page);
  await page.waitForTimeout(900);
  await clickMenuDrawers(page);
  await dismissPopups(page);

  const maxScroll = await page.evaluate(() => Math.max(0, document.documentElement.scrollHeight - window.innerHeight));
  const downTarget = Math.min(maxScroll, Math.max(420, Math.floor(maxScroll * 0.55)));

  if (downTarget > 0) {
    await steppedScroll(page, 0, downTarget, 3600);
    await page.waitForTimeout(260);
    await steppedScroll(page, downTarget, 0, 3300);
  } else {
    await page.waitForTimeout(2600);
  }

  await dismissPopups(page);

  const elapsed = Date.now() - startedAt;
  const remaining = targetDurationSec * 1000 - elapsed;
  if (remaining > 0) {
    await page.waitForTimeout(remaining);
  }
}

async function captureWithBrowser(row, browser, engineName) {
  const rawPath = path.join(videoTempRoot, `${slugify(row.brand)}-${engineName}.webm`);
  const outAbsPath = path.join(process.cwd(), row.videoPath);
  const screenshotAbsPath = path.join(process.cwd(), row.screenshotPath);
  const navigationUrl = captureUrlOverrides.get(row.brand.toLowerCase()) || row.websiteUrl;
  const usedArchiveUrl = navigationUrl.includes("web.archive.org");

  const context = await browser.newContext({
    viewport,
    locale: "en-US",
    colorScheme: "light",
    reducedMotion: "reduce",
    recordVideo: { dir: videoTempRoot, size: viewport },
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
  });

  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  const page = await context.newPage();
  const pageVideo = page.video();
  page.setDefaultNavigationTimeout(90_000);
  page.setDefaultTimeout(35_000);

  try {
    await page.goto(navigationUrl, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await Promise.allSettled([
      page.waitForLoadState("load", { timeout: 30_000 }),
      page.waitForLoadState("networkidle", { timeout: 30_000 })
    ]);

    if (!(await waitUntilUnblocked(page))) {
      throw new Error("blocked_page");
    }

    await addStabilityStyles(page);
    await dismissPopups(page);
    await page.waitForTimeout(220);

    if (await isBlocked(page)) {
      await page.goto(navigationUrl, { waitUntil: "domcontentloaded", timeout: 90_000 });
      await Promise.allSettled([
        page.waitForLoadState("load", { timeout: 30_000 }),
        page.waitForLoadState("networkidle", { timeout: 30_000 })
      ]);
      if (!(await waitUntilUnblocked(page))) {
        throw new Error("blocked_page");
      }
      await addStabilityStyles(page);
      await dismissPopups(page);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: screenshotAbsPath, fullPage: false });

    await recordSequence(page);

    await context.close();
    const sourceVideoPath = await pageVideo.path();
    await fs.rename(sourceVideoPath, rawPath).catch(async () => {
      await fs.copyFile(sourceVideoPath, rawPath);
      await fs.unlink(sourceVideoPath);
    });

    normalizeVideo(rawPath, outAbsPath);
    await fs.rm(rawPath, { force: true });

    return {
      status: "captured",
      method: `playwright-${engineName}`,
      note: usedArchiveUrl ? "Captured from Wayback snapshot to avoid live anti-bot blocking." : ""
    };
  } catch (error) {
    await context.close().catch(() => undefined);
    await fs.rm(rawPath, { force: true }).catch(() => undefined);
    return {
      status: "failed",
      method: `playwright-${engineName}`,
      note: String(error.message || error)
    };
  }
}

async function captureWithFallback(row, chromiumBrowser) {
  const rawPath = path.join(videoTempRoot, `${slugify(row.brand)}-fallback.webm`);
  const outAbsPath = path.join(process.cwd(), row.videoPath);
  const screenshotAbsPath = path.join(process.cwd(), row.screenshotPath);

  try {
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(row.websiteUrl)}&screenshot=true&meta=false`;
    const apiResponse = await fetch(apiUrl);
    if (!apiResponse.ok) {
      throw new Error(`microlink_api_${apiResponse.status}`);
    }
    const payload = await apiResponse.json();
    const screenshotUrl = payload?.data?.screenshot?.url;
    if (!screenshotUrl) {
      throw new Error("microlink_missing_screenshot_url");
    }

    const context = await chromiumBrowser.newContext({
      viewport,
      locale: "en-US",
      colorScheme: "light",
      reducedMotion: "reduce",
      recordVideo: { dir: videoTempRoot, size: viewport }
    });

    const page = await context.newPage();
    const pageVideo = page.video();

    await page.goto(screenshotUrl, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await page.waitForTimeout(450);
    await page.screenshot({ path: screenshotAbsPath, fullPage: false });

    await recordSequence(page);
    await context.close();

    const sourceVideoPath = await pageVideo.path();
    await fs.rename(sourceVideoPath, rawPath).catch(async () => {
      await fs.copyFile(sourceVideoPath, rawPath);
      await fs.unlink(sourceVideoPath);
    });

    normalizeVideo(rawPath, outAbsPath);
    await fs.rm(rawPath, { force: true });

    return {
      status: "captured",
      method: "microlink-video-fallback",
      note: "Fallback video from remote rendered snapshot."
    };
  } catch (error) {
    await fs.rm(rawPath, { force: true }).catch(() => undefined);
    return {
      status: "failed",
      method: "microlink-video-fallback",
      note: String(error.message || error)
    };
  }
}

function rowKey(row) {
  return `${row.category}||${row.brand}`;
}

async function writeCatalogue(parsed, resultMap) {
  const before = parsed.lines.slice(0, parsed.headerIndex);
  const after = parsed.lines.slice(parsed.tailIndex);

  const generatedIndex = before.findIndex((line) => line.startsWith("- Generated:"));
  if (generatedIndex >= 0) {
    before[generatedIndex] = `- Generated: ${new Date().toISOString()}`;
  }
  const videoMetaIndex = before.findIndex((line) => line.startsWith("- Video choreography:"));
  if (videoMetaIndex >= 0) {
    before[videoMetaIndex] = "- Video choreography: 10s loop (hero pause, menu click/open, down/up scroll).";
  } else {
    before.push("- Video choreography: 10s loop (hero pause, menu click/open, down/up scroll).");
  }

  const table = [];
  table.push("| Category | Brand | URL | Screenshot | Video (10s) | Capture Method | Logo (300x300) | Status | Notes |");
  table.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");

  for (const row of parsed.rows) {
    const result = resultMap.get(rowKey(row));
    const screenshotCell = linkCell(row.screenshotPath);
    const existingVideoPath = extractPathFromMarkdownLink(row.videoCell || "");
    const videoCell = result
      ? result.status === "captured"
        ? linkCell(row.videoPath)
        : "-"
      : existingVideoPath
        ? linkCell(existingVideoPath)
        : row.videoCell || "-";
    const captureMethod = result ? result.method : row.captureMethod || "-";
    const status = result ? result.status : row.statusCell || "failed";
    let notes = row.notesCell && row.notesCell !== "-" ? row.notesCell : "";
    if (result?.status === "failed") {
      notes = notes ? `${notes}; Video capture failed: ${result.note}` : `Video capture failed: ${result.note}`;
    } else if (result?.note) {
      notes = notes ? `${notes}; ${result.note}` : result.note;
    }
    if (!notes) {
      notes = "-";
    }
    notes = notes.replace(/\|/g, "\\|");

    table.push(
      `| ${row.category} | ${row.brand} | ${row.urlCell} | ${screenshotCell} | ${videoCell} | ${captureMethod} | ${row.logoCell} | ${status} | ${notes} |`
    );
  }

  const merged = [...before, ...table, ...after].join("\n").replace(/\n+$/, "\n");
  await fs.writeFile(parsed.cataloguePath, merged, "utf8");
}

async function main() {
  const onlyOutliers = process.argv.includes("--only-outliers");
  const brandArg = process.argv.find((entry) => entry.startsWith("--brand="));
  const brandFilter = brandArg ? brandArg.slice("--brand=".length).trim().toLowerCase() : "";
  const parsed = await readCatalogue();
  await ensureOutputFolders(parsed.rows, parsed.imageRoot);
  let rowsToProcess = onlyOutliers
    ? parsed.rows.filter(
        (row) =>
          /microlink-video-fallback|pending|failed/i.test(`${row.captureMethod} ${row.statusCell}`)
      )
    : parsed.rows;
  if (brandFilter) {
    rowsToProcess = rowsToProcess.filter((row) => row.brand.toLowerCase().includes(brandFilter));
  }
  if (rowsToProcess.length === 0) {
    process.stdout.write("No outliers found for recapture.\n");
    return;
  }

  const browsers = {};
  for (const engine of browserOrder) {
    browsers[engine] = await browserFactories[engine].launch({
      headless: true,
      args: engine === "chromium" ? ["--disable-blink-features=AutomationControlled"] : undefined
    });
  }

  const results = new Map();

  process.stdout.write(
    `Mode: ${onlyOutliers ? "outlier-only" : "full"} (${rowsToProcess.length} brand${rowsToProcess.length === 1 ? "" : "s"})\n`
  );

  for (const row of rowsToProcess) {
    process.stdout.write(`Recording: ${row.brand}\n`);

    let result = null;
    for (const engine of browserOrder) {
      const attempt = await captureWithBrowser(row, browsers[engine], engine);
      if (attempt.status === "captured") {
        result = attempt;
        break;
      }
      process.stdout.write(`    ${engine} failed: ${attempt.note}\n`);
    }

    if (!result) {
      result = await captureWithFallback(row, browsers.chromium);
    }

    results.set(rowKey(row), result);
    process.stdout.write(` -> ${result.status} (${result.method})\n`);
  }

  await Promise.all(Object.values(browsers).map((browser) => browser.close()));
  await fs.rm(videoTempRoot, { recursive: true, force: true });
  await writeCatalogue(parsed, results);

  const capturedCount = [...results.values()].filter((result) => result.status === "captured").length;
  const failedCount = [...results.values()].filter((result) => result.status !== "captured").length;
  process.stdout.write(`\nVideo capture complete. Captured: ${capturedCount}, Failed: ${failedCount}\n`);
  process.stdout.write(`Catalogue updated: ${toPosix(path.relative(process.cwd(), parsed.cataloguePath))}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
