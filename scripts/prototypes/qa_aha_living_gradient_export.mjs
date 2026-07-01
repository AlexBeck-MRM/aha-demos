#!/usr/bin/env node

import { createReadStream } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import { chromium } from "playwright";

const ROOT = process.cwd();
const DEFAULT_PROTOTYPE = "reference/evidence/prototypes/aha-living-gradient-playground-2026-06-26/index.html";
const DEFAULT_OUT = ".artifacts/reports/aha-living-gradient-export-qa.json";

const MIME_TYPES = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml; charset=utf-8"],
]);

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 960, deviceScaleFactor: 2 },
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 2 },
];
const PRESETS = ["A", "B", "C", "D"];
const BLUR_VARIANTS = [
  { name: "zero", value: 0 },
  { name: "default", value: null },
  { name: "high", value: 96 },
];
const GRADE_VARIANTS = [true, false];
const SAMPLE_RATIOS = [0, 0.25, 0.5, 0.75];
const TARGETS = ["background", "logo"];
const MAX_DIFF_RATIO = 0.01;
const MAX_LOGO_DIFF_RATIO = 0.022;
const MAX_EDGE_DELTA_RATIO = 0.02;
const MAX_EDGE_ABSOLUTE_DELTA = 0.00075;

function parseArgs(argv) {
  const args = {
    prototype: DEFAULT_PROTOTYPE,
    out: DEFAULT_OUT,
    exhaustive: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--prototype") args.prototype = argv[++index];
    if (arg === "--out") args.out = argv[++index];
    if (arg === "--exhaustive") args.exhaustive = true;
  }
  return args;
}

function startServer(root) {
  const server = http.createServer(async (request, response) => {
    const parsedUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    let pathname = decodeURIComponent(parsedUrl.pathname);
    if (pathname === "/") pathname = `/${DEFAULT_PROTOTYPE}`;
    const filePath = path.normalize(path.join(root, pathname));
    const relative = path.relative(root, filePath);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    try {
      const fileStat = await stat(filePath);
      if (!fileStat.isFile()) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
    } catch {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    const mimeType = MIME_TYPES.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": mimeType,
    });
    createReadStream(filePath)
      .on("error", () => {
        if (!response.headersSent) response.writeHead(404);
        response.end("Not found");
      })
      .pipe(response);
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({ server, port: address.port });
    });
  });
}

function decodePngDataUrl(dataUrl) {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  return PNG.sync.read(Buffer.from(base64, "base64"));
}

function edgeMetric(png, options = {}) {
  let total = 0;
  let count = 0;
  for (let y = 1; y < png.height - 1; y += 1) {
    for (let x = 1; x < png.width - 1; x += 1) {
      const index = (png.width * y + x) * 4;
      const right = index + 4;
      const down = index + png.width * 4;
      const a = png.data[index + 3] / 255;
      const b = png.data[right + 3] / 255;
      const c = png.data[down + 3] / 255;
      if (options.opaqueOnly && (a < 0.98 || b < 0.98 || c < 0.98)) continue;
      if (a < 0.02 && b < 0.02 && c < 0.02) continue;
      const luma = lumaAt(png.data, index);
      total += Math.abs(luma - lumaAt(png.data, right));
      total += Math.abs(luma - lumaAt(png.data, down));
      count += 2;
    }
  }
  return count > 0 ? total / count : 0;
}

function lumaAt(data, index) {
  return (data[index] * 0.2126 + data[index + 1] * 0.7152 + data[index + 2] * 0.0722) / 255;
}

function countUniqueColors(png, sampleStep = 4) {
  const colors = new Set();
  for (let y = 0; y < png.height; y += sampleStep) {
    for (let x = 0; x < png.width; x += sampleStep) {
      const index = (png.width * y + x) * 4;
      if (png.data[index + 3] === 0) continue;
      colors.add(`${png.data[index]},${png.data[index + 1]},${png.data[index + 2]},${png.data[index + 3]}`);
    }
  }
  return colors.size;
}

function alphaAt(png, x, y) {
  const index = (png.width * y + x) * 4;
  return png.data[index + 3];
}

function comparePair(pair) {
  const preview = decodePngDataUrl(pair.preview.dataUrl);
  const comparison = decodePngDataUrl(pair.comparison.dataUrl);
  const alphaPng = pair.target === "logo" && pair.export.dataUrl
    ? decodePngDataUrl(pair.export.dataUrl)
    : null;
  if (preview.width !== comparison.width || preview.height !== comparison.height) {
    throw new Error(`Mismatched comparison dimensions: ${preview.width}x${preview.height} vs ${comparison.width}x${comparison.height}`);
  }
  const diff = new PNG({ width: preview.width, height: preview.height });
  const diffPixels = pixelmatch(preview.data, comparison.data, diff.data, preview.width, preview.height, {
    threshold: 0.04,
    includeAA: true,
  });
  const totalPixels = preview.width * preview.height;
  const edgeOptions = pair.target === "logo" ? { opaqueOnly: true } : {};
  const previewEdge = edgeMetric(preview, edgeOptions);
  const comparisonEdge = edgeMetric(comparison, edgeOptions);
  const edgeDeltaAbsolute = Math.abs(previewEdge - comparisonEdge);
  const edgeDeltaRatio = previewEdge > 0
    ? edgeDeltaAbsolute / previewEdge
    : 0;
  const logoAlpha = alphaPng ? analyzeLogoAlpha(alphaPng, pair.export.exportRect) : pair.export.alphaMetadata;
  return {
    diffPixels,
    totalPixels,
    diffRatio: diffPixels / totalPixels,
    previewEdge,
    comparisonEdge,
    edgeDeltaAbsolute,
    edgeDeltaRatio,
    previewUniqueColors: countUniqueColors(preview),
    comparisonUniqueColors: countUniqueColors(comparison),
    logoTransparentCorners: alphaPng
      ? [
          alphaAt(alphaPng, 0, 0),
          alphaAt(alphaPng, Math.max(0, alphaPng.width - 1), 0),
          alphaAt(alphaPng, 0, Math.max(0, alphaPng.height - 1)),
          alphaAt(alphaPng, Math.max(0, alphaPng.width - 1), Math.max(0, alphaPng.height - 1)),
        ]
      : logoAlpha?.corners ?? null,
    logoAlpha,
  };
}

function analyzeLogoAlpha(png, exportRect) {
  let outsideNonTransparent = 0;
  let transparentRgbUnsafe = 0;
  let interiorOpaque = 0;
  let interiorTransparent = 0;
  let edgeAlphaPixels = 0;

  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const index = (png.width * y + x) * 4;
      const alpha = png.data[index + 3];
      const insideExportRect = x >= exportRect.x
        && x < exportRect.x + exportRect.width
        && y >= exportRect.y
        && y < exportRect.y + exportRect.height;
      if (!insideExportRect && alpha !== 0) outsideNonTransparent += 1;
      if (alpha === 0 && (png.data[index] !== 255 || png.data[index + 1] !== 255 || png.data[index + 2] !== 255)) {
        transparentRgbUnsafe += 1;
      }
      if (insideExportRect && alpha > 250) interiorOpaque += 1;
      if (insideExportRect && alpha === 0) interiorTransparent += 1;
      if (insideExportRect && alpha > 0 && alpha < 255) edgeAlphaPixels += 1;
    }
  }

  return {
    outsideNonTransparent,
    transparentRgbUnsafe,
    interiorOpaque,
    interiorTransparent,
    edgeAlphaPixels,
  };
}

async function setControlState(page, { preset, blur, grade }) {
  await page.evaluate(({ preset: nextPreset, blur: nextBlur, grade: nextGrade }) => {
    const presetButton = document.querySelector(`[data-preset-card="${nextPreset}"]`);
    if (!presetButton) throw new Error(`Missing preset control ${nextPreset}`);
    presetButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const presetState = window.__ahaLivingGradientExportDebug.getConfig().state;
    if (presetState.preset !== nextPreset) {
      throw new Error(`Preset ${nextPreset} did not apply; got ${presetState.preset}`);
    }
    const blurInput = document.querySelector('[data-control-key="shaderBlur"]');
    if (blurInput && nextBlur !== null) {
      blurInput.value = String(nextBlur);
      blurInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (!blurInput && nextBlur !== null) throw new Error("Missing shaderBlur control");
    const gradeInput = document.querySelector('[data-control-key="figmaExportGrade"]');
    if (!gradeInput) throw new Error("Missing figmaExportGrade control");
    gradeInput.checked = Boolean(nextGrade);
    gradeInput.dispatchEvent(new Event("change", { bubbles: true }));
  }, { preset, blur, grade });
}

async function assertControlState(page, { blur, grade }) {
  const actual = await page.evaluate(() => window.__ahaLivingGradientExportDebug.getConfig().state);
  const mismatches = [];
  if (blur !== null && Math.round(actual.shaderBlur) !== Math.round(blur)) {
    mismatches.push(`shaderBlur ${actual.shaderBlur} !== ${blur}`);
  }
  if (Boolean(actual.figmaExportGrade) !== Boolean(grade)) {
    mismatches.push(`figmaExportGrade ${actual.figmaExportGrade} !== ${grade}`);
  }
  if (mismatches.length > 0) {
    throw new Error(`Control state mismatch: ${mismatches.join(", ")}`);
  }
  return actual;
}

async function runCase(page, testCase) {
  await setControlState(page, testCase);
  const state = await assertControlState(page, testCase);
  const cycleSeconds = state.duration / Math.max(state.evolutionSpeed, 0.1);
  const elapsed = cycleSeconds * testCase.sampleRatio;
  const pair = await page.evaluate(async ({ target, elapsed: nextElapsed, includeFullExportDataUrl }) => {
    return window.__ahaLivingGradientExportDebug.renderPair(target, nextElapsed, {
      includeFullExportDataUrl: target === "logo" && Boolean(includeFullExportDataUrl),
      includeAlphaMetadata: target === "logo" && Boolean(includeFullExportDataUrl),
    });
  }, { target: testCase.target, elapsed, includeFullExportDataUrl: testCase.includeFullExportDataUrl });
  const metrics = comparePair(pair);
  const exportDimensionOk = testCase.target === "background"
    ? pair.export.width === 2160 && pair.export.height === 1620
    : pair.export.width === 3240 && pair.export.height === 3240;
  const alphaOk = testCase.target !== "logo"
    || !metrics.logoTransparentCorners
    || metrics.logoTransparentCorners.every((alpha) => alpha < 1);
  const logoAlphaOk = testCase.target !== "logo"
    || !metrics.logoAlpha
    || (
      metrics.logoAlpha.outsideNonTransparent === 0
      && metrics.logoAlpha.transparentRgbUnsafe === 0
      && metrics.logoAlpha.interiorOpaque > 1000
      && metrics.logoAlpha.interiorTransparent > 1000
      && metrics.logoAlpha.edgeAlphaPixels > 0
    );
  const maxDiffRatio = testCase.target === "logo" ? MAX_LOGO_DIFF_RATIO : MAX_DIFF_RATIO;
  const edgeOk = metrics.edgeDeltaRatio <= MAX_EDGE_DELTA_RATIO
    || metrics.edgeDeltaAbsolute <= MAX_EDGE_ABSOLUTE_DELTA;
  const highBlurCase = Number(testCase.blur) >= 96;
  const colourVarietyOk = highBlurCase || (testCase.target === "logo"
    ? metrics.previewUniqueColors >= 4 && metrics.comparisonUniqueColors >= 4
    : metrics.previewUniqueColors >= 40 && metrics.comparisonUniqueColors >= 40);
  const passed = exportDimensionOk
    && alphaOk
    && logoAlphaOk
    && metrics.diffRatio <= maxDiffRatio
    && edgeOk
    && colourVarietyOk;
  return {
    ...testCase,
    elapsed: Number(elapsed.toFixed(4)),
    export: {
      width: pair.export.width,
      height: pair.export.height,
      blur: pair.export.blur,
      blurMetadata: pair.export.blurMetadata,
      transparent: pair.export.transparent,
      exportRect: pair.export.exportRect,
    },
    preview: {
      width: pair.preview.width,
      height: pair.preview.height,
      blur: pair.preview.blur,
      blurMetadata: pair.preview.blurMetadata,
    },
    metrics,
    passed,
    failures: [
      !exportDimensionOk ? "export-dimensions" : null,
      !alphaOk ? "logo-alpha-corners" : null,
      !logoAlphaOk ? "logo-alpha-integrity" : null,
      metrics.diffRatio > maxDiffRatio ? "pixel-diff" : null,
      !edgeOk ? "edge-delta" : null,
      !colourVarietyOk ? "low-colour-variety" : null,
    ].filter(Boolean),
  };
}

function buildTestCases(exhaustive) {
  const cases = [];
  const viewports = exhaustive ? VIEWPORTS : VIEWPORTS;
  const presets = exhaustive ? PRESETS : PRESETS;
  const blurVariants = exhaustive ? BLUR_VARIANTS : [BLUR_VARIANTS.find((variant) => variant.name === "default")];
  const grades = exhaustive ? GRADE_VARIANTS : [true];
  const sampleRatios = exhaustive ? SAMPLE_RATIOS : [0, 0.5];

  for (const viewport of viewports) {
    for (const preset of presets) {
      for (const blurVariant of blurVariants) {
        for (const grade of grades) {
          for (const sampleRatio of sampleRatios) {
            for (const target of TARGETS) {
              cases.push({
                viewport: viewport.name,
                preset,
                blurVariant: blurVariant.name,
                blur: blurVariant.value,
                grade,
                sampleRatio,
                target,
                includeFullExportDataUrl: !exhaustive && target === "logo",
              });
            }
          }
        }
      }
    }
  }

  if (!exhaustive) {
    [
      { viewport: "desktop", preset: "A", blurVariant: "zero", blur: 0, grade: true, sampleRatio: 0 },
      { viewport: "desktop", preset: "A", blurVariant: "high", blur: 96, grade: true, sampleRatio: 0 },
      { viewport: "desktop", preset: "A", blurVariant: "default", blur: null, grade: false, sampleRatio: 0.25 },
      { viewport: "mobile", preset: "D", blurVariant: "high", blur: 96, grade: false, sampleRatio: 0.75 },
    ].forEach((variant) => {
      TARGETS.forEach((target) => cases.push({ ...variant, target, includeFullExportDataUrl: target === "logo" }));
    });
  }

  return cases;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { server, port } = await startServer(ROOT);
  const browser = await chromium.launch({
    headless: false,
    args: ["--ignore-gpu-blocklist"],
  });
  const results = [];
  const consoleMessages = [];
  const url = `http://127.0.0.1:${port}/${args.prototype}`;

  try {
    const cases = buildTestCases(args.exhaustive);
    const casesByViewport = new Map(VIEWPORTS.map((viewport) => [viewport.name, cases.filter((testCase) => testCase.viewport === viewport.name)]));

    for (const viewport of VIEWPORTS) {
      const viewportCases = casesByViewport.get(viewport.name) ?? [];
      if (viewportCases.length === 0) continue;
      const page = await browser.newPage({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.deviceScaleFactor,
      });
      page.on("console", (message) => {
        if (["warning", "error"].includes(message.type())) {
          consoleMessages.push({ type: message.type(), text: message.text() });
        }
      });
      page.on("pageerror", (error) => {
        consoleMessages.push({ type: "pageerror", text: error.message });
      });
      page.on("requestfailed", (request) => {
        consoleMessages.push({ type: "requestfailed", text: `${request.method()} ${request.url()} ${request.failure()?.errorText ?? ""}`.trim() });
      });
      page.on("response", (response) => {
        const status = response.status();
        if (status >= 400) {
          consoleMessages.push({ type: "response", text: `${status} ${response.url()}` });
        }
      });
      await page.goto(url, { waitUntil: "load" });
      await page.evaluate(() => {
        window.localStorage.clear();
      });
      await page.reload({ waitUntil: "load" });

      for (const testCase of viewportCases) {
        results.push(await runCase(page, testCase));
      }
      await page.close();
    }
  } finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
  }

  const report = {
    generatedAt: new Date().toISOString(),
    prototype: args.prototype,
    mode: args.exhaustive ? "exhaustive" : "default",
    thresholds: {
      maxDiffRatio: MAX_DIFF_RATIO,
      maxLogoDiffRatio: MAX_LOGO_DIFF_RATIO,
      maxEdgeDeltaRatio: MAX_EDGE_DELTA_RATIO,
      maxEdgeAbsoluteDelta: MAX_EDGE_ABSOLUTE_DELTA,
    },
    consoleMessages,
    passed: consoleMessages.length === 0 && results.every((result) => result.passed),
    summary: {
      total: results.length,
      passed: results.filter((result) => result.passed).length,
      failed: results.filter((result) => !result.passed).length,
    },
    failures: results.filter((result) => !result.passed),
    results,
  };

  const outPath = path.resolve(ROOT, args.out);
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`${report.passed ? "PASS" : "FAIL"} ${report.summary.passed}/${report.summary.total} checks`);
  console.log(`Report: ${path.relative(ROOT, outPath)}`);
  if (!report.passed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
