#!/usr/bin/env node

import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

let chromium;
let firefox;
try {
  ({ chromium, firefox } = await import('playwright'));
} catch {
  console.error('Missing dependency: playwright');
  console.error('Run: npm install playwright && npx playwright install chromium firefox');
  process.exit(1);
}

const DEFAULTS = {
  targets: 'data/brand_capture_targets.csv',
  manifest: 'evidence/capture_manifest.csv',
  screenshotsDir: 'evidence/screenshots',
  recordingsDir: 'evidence/recordings',
  rawRecordingsDir: 'evidence/recordings_raw',
  trimScript: 'scripts/brand/trim_videos.sh',
  timeoutMs: 45000,
};

function printUsage() {
  console.log(`Usage: node scripts/brand/capture_brand_assets.mjs [options]\n
Options:
  --targets <path>        Path to capture targets CSV (default: ${DEFAULTS.targets})
  --manifest <path>       Path to output manifest CSV (default: ${DEFAULTS.manifest})
  --only <slug[,slug]>    Capture only one or more slugs
  --skip-existing         Skip capture if screenshot and mp4 already exist
  --timeout-ms <number>   Navigation timeout in ms (default: ${DEFAULTS.timeoutMs})
  --help                  Show this message`);
}

function parseArgs(argv) {
  const opts = {
    targets: DEFAULTS.targets,
    manifest: DEFAULTS.manifest,
    screenshotsDir: DEFAULTS.screenshotsDir,
    recordingsDir: DEFAULTS.recordingsDir,
    rawRecordingsDir: DEFAULTS.rawRecordingsDir,
    trimScript: DEFAULTS.trimScript,
    timeoutMs: DEFAULTS.timeoutMs,
    skipExisting: false,
    only: new Set(),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help') {
      printUsage();
      process.exit(0);
    }
    if (arg === '--skip-existing') {
      opts.skipExisting = true;
      continue;
    }
    if (arg === '--targets') {
      opts.targets = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--manifest') {
      opts.manifest = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--timeout-ms') {
      opts.timeoutMs = Number(argv[i + 1]);
      i += 1;
      continue;
    }
    if (arg === '--only') {
      const raw = argv[i + 1] ?? '';
      raw.split(',').map((v) => v.trim()).filter(Boolean).forEach((slug) => opts.only.add(slug));
      i += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!Number.isFinite(opts.timeoutMs) || opts.timeoutMs <= 0) {
    throw new Error(`Invalid --timeout-ms value: ${opts.timeoutMs}`);
  }

  return opts;
}

function parseCsvLine(line) {
  const fields = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      fields.push(field);
      field = '';
      continue;
    }

    field += char;
  }

  fields.push(field);
  return fields;
}

async function readTargets(csvPath) {
  const content = await fs.readFile(csvPath, 'utf8');
  const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) {
    throw new Error(`No target rows found in ${csvPath}`);
  }

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line, index) => {
    const values = parseCsvLine(line);
    const row = {};
    headers.forEach((header, i) => {
      row[header] = values[i] ?? '';
    });

    if (!row.brand || !row.slug || !row.homepage_url || !row.key_url) {
      throw new Error(`Invalid target row at line ${index + 2}`);
    }

    return row;
  });
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toOneLine(value, maxLen = 240) {
  const text = String(value ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 3)}...`;
}

async function writeManifest(manifestPath, rows) {
  const header = [
    'brand',
    'slug',
    'page_type',
    'input_url',
    'final_url',
    'screenshot_file',
    'video_file',
    'status',
    'error',
  ];

  const lines = [header.join(',')];
  for (const row of rows) {
    lines.push(header.map((key) => csvEscape(row[key] ?? '')).join(','));
  }

  await fs.writeFile(manifestPath, `${lines.join('\n')}\n`, 'utf8');
}

function asRelative(filePath) {
  return path.relative(process.cwd(), filePath) || '.';
}

async function smoothScroll(page, durationMs, direction) {
  const stepMs = 250;
  const steps = Math.max(1, Math.floor(durationMs / stepMs));

  for (let i = 0; i < steps; i += 1) {
    try {
      await page.evaluate((dir) => {
        const amount = Math.max(Math.floor(window.innerHeight * 0.12), 120);
        window.scrollBy({ top: dir === 'down' ? amount : -amount, behavior: 'auto' });
      }, direction);
    } catch (error) {
      if (/Execution context was destroyed|Target closed/.test(String(error))) {
        break;
      }
      throw error;
    }
    await page.waitForTimeout(stepMs);
  }
}

async function waitForStablePage(page, timeoutMs) {
  await page.waitForLoadState('domcontentloaded', { timeout: timeoutMs });
  await page.waitForTimeout(700);
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  }).catch(() => {});
  await page.waitForTimeout(500);
}

async function dismissModalsAndCookieBanners(page) {
  const commonSelectors = [
    '#onetrust-accept-btn-handler',
    '#onetrust-reject-all-handler',
    'button[aria-label*="Accept"]',
    'button[aria-label*="accept"]',
    'button[aria-label*="Close"]',
    'button[aria-label*="close"]',
    '[data-testid*="accept"]',
    '[data-testid*="close"]',
    '[id*="cookie"] button',
    '[class*="cookie"] button',
    '[class*="consent"] button',
    '[class*="modal"] button[aria-label*="Close"]',
    '[class*="modal"] button[aria-label*="close"]',
    'button:has-text("ACCEPT")',
    'button:has-text("Accept")',
    'button:has-text("Agree")',
    'button:has-text("Got it")',
    'button:has-text("I Agree")',
    'button:has-text("Allow all")',
  ];

  for (const selector of commonSelectors) {
    try {
      const handle = page.locator(selector).first();
      if (await handle.isVisible({ timeout: 500 }).catch(() => false)) {
        await handle.click({ timeout: 1200 }).catch(() => {});
        await page.waitForTimeout(200);
      }
    } catch {
      // Ignore selector-specific failures.
    }
  }

  const textClicks = [
    /accept all/i,
    /accept/i,
    /agree/i,
    /got it/i,
    /continue/i,
    /close/i,
    /dismiss/i,
    /not now/i,
    /reject all/i,
  ];

  await page.evaluate((patterns) => {
    const regexes = patterns.map((p) => new RegExp(p, 'i'));
    const els = Array.from(document.querySelectorAll('button, [role="button"], a'));
    for (const el of els) {
      const text = (el.textContent || '').trim();
      if (!text) continue;
      if (!regexes.some((re) => re.test(text))) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width < 10 || rect.height < 10) continue;
      if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
      try {
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      } catch {
        // ignore
      }
    }
  }, textClicks.map((r) => r.source)).catch(() => {});

  const rolePatterns = [/accept/i, /agree/i, /got it/i, /allow all/i, /reject all/i, /close/i];
  for (const pattern of rolePatterns) {
    try {
      const btn = page.getByRole('button', { name: pattern }).first();
      if (await btn.isVisible({ timeout: 400 }).catch(() => false)) {
        await btn.click({ timeout: 1200 }).catch(() => {});
        await page.waitForTimeout(180);
      }
    } catch {
      // ignore
    }
  }

  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(150);
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(350);
}

async function discoverFallbackUrl(browser, homepageUrl, timeoutMs) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  try {
    await page.goto(homepageUrl, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
    await page.waitForTimeout(1000);

    const candidate = await page.evaluate(() => {
      const keywords = [
        'donate', 'give', 'donation', 'support', 'involved', 'get involved', 'impact', 'ways to help',
        'appointment', 'find doctor', 'services', 'minuteclinic', 'rewards', 'membership', 'privacy',
        'plus', 'prime', 'app', 'join'
      ];

      const anchors = Array.from(document.querySelectorAll('a[href]'));
      const scored = anchors.map((a) => {
        const hrefRaw = a.getAttribute('href') || '';
        const text = (a.innerText || a.textContent || '').trim().toLowerCase();
        let href;
        try {
          href = new URL(hrefRaw, window.location.href).href;
        } catch {
          href = '';
        }

        if (!href || !/^https?:\/\//.test(href)) {
          return null;
        }

        const combined = `${text} ${href.toLowerCase()}`;
        let score = 0;
        for (const keyword of keywords) {
          if (combined.includes(keyword)) {
            score += 3;
          }
        }
        if (href.startsWith(window.location.origin)) {
          score += 2;
        }
        if (text.length > 0 && text.length < 80) {
          score += 1;
        }

        return { href, score };
      }).filter(Boolean);

      scored.sort((a, b) => b.score - a.score);
      return scored[0]?.href || null;
    });

    return candidate;
  } finally {
    await context.close();
  }
}

async function runTrim(trimScriptPath, inputRaw, outputMp4, startSeconds) {
  await execFileAsync(trimScriptPath, [inputRaw, outputMp4, `${startSeconds}`], {
    cwd: process.cwd(),
    env: process.env,
    maxBuffer: 10 * 1024 * 1024,
  });
}

async function captureAttempt({
  browser,
  url,
  slug,
  pageType,
  screenshotAbs,
  rawDirAbs,
  timeoutMs,
}) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: rawDirAbs,
      size: { width: 1280, height: 800 },
    },
  });

  const page = await context.newPage();
  const video = page.video();
  let finalUrl = '';
  let interactionStartSeconds = 0;
  let interactionMeta = '';
  let captureError = null;
  const captureStartMs = Date.now();

  try {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
    } catch (navError) {
      // Some sites intermittently fail in headless mode with HTTP2 transport issues.
      // Retry with a less strict milestone so we can still capture above-the-fold behavior.
      const navMessage = String(navError);
      if (!/ERR_HTTP2_PROTOCOL_ERROR|Timeout/.test(navMessage)) {
        throw navError;
      }
      await page.goto(url, { waitUntil: 'commit', timeout: timeoutMs });
      await waitForStablePage(page, timeoutMs);
    }
    await waitForStablePage(page, timeoutMs);
    await dismissModalsAndCookieBanners(page);
    await waitForStablePage(page, timeoutMs);
    finalUrl = page.url();

    await page.screenshot({ path: screenshotAbs, fullPage: true });

    // Start visible interaction segment after the page has stabilized.
    interactionStartSeconds = Math.max(0, (Date.now() - captureStartMs) / 1000);

    try {
      await page.waitForTimeout(500);
      await smoothScroll(page, 3200, 'down');
      await dismissModalsAndCookieBanners(page);
      await page.waitForTimeout(400);
      interactionMeta = 'interaction:scroll_only';
      await smoothScroll(page, 2400, 'down');
      await dismissModalsAndCookieBanners(page);
      await page.waitForTimeout(1000);
      await smoothScroll(page, 1500, 'up');
      await dismissModalsAndCookieBanners(page);
      await page.waitForTimeout(1000);
    } catch (interactionError) {
      interactionMeta = `${interactionMeta ? `${interactionMeta};` : ''}interaction_warning:${toOneLine(interactionError)}`;
      await page.waitForTimeout(1500);
    }
    finalUrl = page.url();
  } catch (error) {
    captureError = error;
  } finally {
    await context.close().catch(() => {});
  }

  let rawTempPath = '';
  if (video) {
    rawTempPath = await video.path().catch(() => '');
  }

  if (captureError) {
    throw captureError;
  }

  if (!rawTempPath || !existsSync(rawTempPath)) {
    throw new Error('Recorded video was not produced by Playwright.');
  }

  const ext = path.extname(rawTempPath) || '.webm';
  const rawOutputPath = path.join(rawDirAbs, `${slug}__${pageType}${ext}`);

  await fs.copyFile(rawTempPath, rawOutputPath);

  return {
    finalUrl,
    rawVideoPath: rawOutputPath,
    interactionStartSeconds,
    interactionMeta,
  };
}

async function captureOnePage({
  primaryBrowser,
  fallbackBrowser,
  target,
  pageType,
  inputUrl,
  screenshotAbs,
  videoAbs,
  rawDirAbs,
  timeoutMs,
  trimScriptAbs,
}) {
  let status = 'ok';
  let finalUrl = '';
  let error = '';
  let selectedUrl = inputUrl;
  let rawVideoPath = '';
  let interactionStartSeconds = 0;
  let interactionMeta = '';

  const captureWithBrowserFallback = async (url) => {
    try {
      const result = await captureAttempt({
        browser: primaryBrowser,
        url,
        slug: target.slug,
        pageType,
        screenshotAbs,
        rawDirAbs,
        timeoutMs,
      });
      return { ...result, note: '' };
    } catch (initialBrowserError) {
      const browserErrorText = String(initialBrowserError);
      if (!fallbackBrowser || !/ERR_HTTP2_PROTOCOL_ERROR|ERR_HTTP/.test(browserErrorText)) {
        throw initialBrowserError;
      }

      const fallbackResult = await captureAttempt({
        browser: fallbackBrowser,
        url,
        slug: target.slug,
        pageType,
        screenshotAbs,
        rawDirAbs,
        timeoutMs,
      });

      return {
        ...fallbackResult,
        note: `browser_fallback:firefox;initial_browser_error:${toOneLine(browserErrorText)}`,
      };
    }
  };

  try {
    const result = await captureWithBrowserFallback(selectedUrl);
    finalUrl = result.finalUrl;
    rawVideoPath = result.rawVideoPath;
    interactionStartSeconds = result.interactionStartSeconds;
    interactionMeta = result.interactionMeta;
    if (result.note) {
      error = `${error ? `${error};` : ''}${result.note}`;
    }
  } catch (initialError) {
    if (pageType !== 'key') {
      status = 'error';
      error = `capture_failed:${toOneLine(initialError)}`;
    } else {
      const fallbackUrl = await discoverFallbackUrl(primaryBrowser, target.homepage_url, timeoutMs).catch(() => null);
      if (!fallbackUrl || fallbackUrl === selectedUrl) {
        status = 'error';
        error = `capture_failed:${toOneLine(initialError)};fallback:none`;
      } else {
        try {
          selectedUrl = fallbackUrl;
          const fallbackResult = await captureWithBrowserFallback(selectedUrl);
          finalUrl = fallbackResult.finalUrl;
          rawVideoPath = fallbackResult.rawVideoPath;
          interactionStartSeconds = fallbackResult.interactionStartSeconds;
          interactionMeta = fallbackResult.interactionMeta;
          error = `fallback_used:${fallbackUrl};initial_error:${toOneLine(initialError)}${fallbackResult.note ? `;${fallbackResult.note}` : ''}`;
        } catch (fallbackError) {
          status = 'error';
          error = `capture_failed:${toOneLine(initialError)};fallback_failed:${toOneLine(fallbackError)};fallback_url:${fallbackUrl}`;
        }
      }
    }
  }

  if (status === 'ok') {
    try {
      await runTrim(trimScriptAbs, rawVideoPath, videoAbs, interactionStartSeconds);
      if (interactionMeta) {
        error = `${error ? `${error};` : ''}${interactionMeta}`;
      }
    } catch (trimError) {
      status = 'error';
      error = `${error ? `${error};` : ''}trim_failed:${toOneLine(trimError)}`;
    }
  }

  return {
    brand: target.brand,
    slug: target.slug,
    page_type: pageType,
    input_url: inputUrl,
    final_url: finalUrl,
    screenshot_file: asRelative(screenshotAbs),
    video_file: asRelative(videoAbs),
    status,
    error,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  const targetsAbs = path.resolve(options.targets);
  const manifestAbs = path.resolve(options.manifest);
  const screenshotsDirAbs = path.resolve(options.screenshotsDir);
  const recordingsDirAbs = path.resolve(options.recordingsDir);
  const rawDirAbs = path.resolve(options.rawRecordingsDir);
  const trimScriptAbs = path.resolve(options.trimScript);

  await fs.mkdir(screenshotsDirAbs, { recursive: true });
  await fs.mkdir(recordingsDirAbs, { recursive: true });
  await fs.mkdir(rawDirAbs, { recursive: true });
  await fs.mkdir(path.dirname(manifestAbs), { recursive: true });

  const allTargets = await readTargets(targetsAbs);
  const targets = allTargets.filter((target) => options.only.size === 0 || options.only.has(target.slug));

  if (targets.length === 0) {
    throw new Error('No targets selected for capture.');
  }

  const chromiumBrowser = await chromium.launch({ headless: false });
  const firefoxBrowser = await firefox.launch({ headless: false });
  const manifestRows = [];

  try {
    for (const target of targets) {
      for (const [pageType, inputUrl] of [
        ['home', target.homepage_url],
        ['key', target.key_url],
      ]) {
        const screenshotAbs = path.join(screenshotsDirAbs, `${target.slug}__${pageType}.png`);
        const videoAbs = path.join(recordingsDirAbs, `${target.slug}__${pageType}.mp4`);

        if (options.skipExisting && existsSync(screenshotAbs) && existsSync(videoAbs)) {
          manifestRows.push({
            brand: target.brand,
            slug: target.slug,
            page_type: pageType,
            input_url: inputUrl,
            final_url: '',
            screenshot_file: asRelative(screenshotAbs),
            video_file: asRelative(videoAbs),
            status: 'skipped',
            error: 'skipped_existing_files',
          });
          console.log(`skipped ${target.slug} ${pageType}`);
          continue;
        }

        console.log(`capturing ${target.slug} ${pageType} -> ${inputUrl}`);
        const row = await captureOnePage({
          primaryBrowser: chromiumBrowser,
          fallbackBrowser: firefoxBrowser,
          target,
          pageType,
          inputUrl,
          screenshotAbs,
          videoAbs,
          rawDirAbs,
          timeoutMs: options.timeoutMs,
          trimScriptAbs,
        });

        manifestRows.push(row);
        console.log(`done ${target.slug} ${pageType}: ${row.status}`);
      }
    }
  } finally {
    await chromiumBrowser.close();
    await firefoxBrowser.close();
  }

  await writeManifest(manifestAbs, manifestRows);
  console.log(`manifest written: ${asRelative(manifestAbs)}`);
}

main().catch((error) => {
  console.error(error.stack || String(error));
  process.exit(1);
});
