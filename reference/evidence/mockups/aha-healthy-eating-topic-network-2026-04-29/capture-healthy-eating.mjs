import { chromium } from "playwright";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "../../../..");

const startUrl = "https://www.heart.org/en/healthy-living/healthy-eating";
const screenshotDir = path.join(repoRoot, "reference/evidence/screenshots/aha-healthy-eating-topic-network-2026-04-29");
const mockupDir = path.join(repoRoot, "reference/evidence/mockups/aha-healthy-eating-topic-network-2026-04-29");
const recipeCaptureLimit = 3;
const maxPages = 260;

mkdirSync(screenshotDir, { recursive: true });
mkdirSync(mockupDir, { recursive: true });

const htmlLikeExtensions = new Set(["", ".html", ".htm"]);
const assetExtensions = new Set([
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".svg",
  ".webp",
  ".mp4",
  ".mov",
  ".zip",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
]);

function csvEscape(value) {
  const string = value == null ? "" : String(value);
  return /[",\n\r]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
}

function toCsv(rows, headers) {
  return [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n") + "\n";
}

function normalizeUrl(rawUrl, baseUrl = startUrl) {
  try {
    const url = new URL(rawUrl, baseUrl);
    url.hash = "";
    url.search = "";
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (url.hostname === "heart.org") url.hostname = "www.heart.org";
    return url.href.replace(/\/$/, "");
  } catch {
    return null;
  }
}

function extensionOf(urlString) {
  try {
    return path.extname(new URL(urlString).pathname).toLowerCase();
  } catch {
    return "";
  }
}

function isNonHtmlOrNonPageResource(urlString) {
  const ext = extensionOf(urlString);
  if (assetExtensions.has(ext)) return true;
  if (ext && !htmlLikeExtensions.has(ext)) return true;
  return false;
}

function isHealthyEatingUrl(urlString) {
  const url = new URL(urlString);
  return url.hostname === "www.heart.org" && url.pathname.startsWith("/en/healthy-living/healthy-eating");
}

function isRecipeUrl(urlString) {
  const url = new URL(urlString);
  return url.hostname === "recipes.heart.org" || url.hostname === "recipes.heart.org";
}

function isCandidatePage(urlString) {
  if (!urlString || isNonHtmlOrNonPageResource(urlString)) return false;
  const url = new URL(urlString);
  if (isHealthyEatingUrl(urlString)) return true;
  if (url.hostname === "recipes.heart.org") return true;
  return false;
}

function slugForUrl(urlString) {
  const url = new URL(urlString);
  const host = url.hostname.replace(/^www\./, "").replaceAll(".", "-");
  const pathSlug = url.pathname
    .replace(/^\/+|\/+$/g, "")
    .replaceAll("/", "-")
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .slice(0, 132);
  return `${host}-${pathSlug || "root"}`;
}

function classifyBucket(urlString) {
  const url = new URL(urlString);
  const pathname = url.pathname;
  if (url.hostname === "recipes.heart.org") return "recipes-sample";
  if (pathname.endsWith("/healthy-eating")) return "healthy-eating-root";
  if (pathname.includes("/add-color")) return "add-color";
  if (pathname.includes("/cooking-skills")) return "cooking-skills";
  if (pathname.includes("/eat-smart")) return "eat-smart";
  if (pathname.includes("/healthy-food-facts")) return "healthy-food-facts";
  if (pathname.includes("/heart-check-foods")) return "heart-check-foods";
  if (pathname.includes("/losing-weight")) return "losing-weight";
  if (pathname.includes("/recipes")) return "recipes-link";
  return "other-healthy-eating";
}

function sourceTypeForAnchor(anchor) {
  const context = `${anchor.closestRole || ""} ${anchor.closestClass || ""} ${anchor.closestId || ""}`.toLowerCase();
  if (context.includes("nav") || context.includes("sidebar") || context.includes("rail") || context.includes("menu")) return "sidebar";
  if (context.includes("footer") || context.includes("header")) return "global";
  return "inline";
}

async function dismissOverlays(page) {
  const selectors = [
    "button:has-text('Accept')",
    "button:has-text('I Accept')",
    "button:has-text('Accept All')",
    "button:has-text('Agree')",
    "button:has-text('Close')",
    "[aria-label='close']",
    "[aria-label='Close']",
  ];
  for (const selector of selectors) {
    try {
      const locator = page.locator(selector).first();
      if (await locator.isVisible({ timeout: 800 })) {
        await locator.click({ timeout: 1200 });
        await page.waitForTimeout(300);
      }
    } catch {
      // Best effort only.
    }
  }
}

async function extractLinks(page, pageUrl) {
  const anchors = await page.$$eval("a[href]", (nodes) =>
    nodes.map((node) => {
      const closest = node.closest("nav, aside, footer, header, [class*='side'], [class*='rail'], [class*='menu']");
      return {
        href: node.getAttribute("href") || "",
        text: (node.textContent || "").replace(/\s+/g, " ").trim(),
        closestRole: closest?.tagName || "",
        closestClass: closest?.getAttribute("class") || "",
        closestId: closest?.getAttribute("id") || "",
      };
    }),
  );

  return anchors
    .map((anchor) => {
      const url = normalizeUrl(anchor.href, pageUrl);
      return url
        ? {
            url,
            text: anchor.text,
            source_type: sourceTypeForAnchor(anchor),
          }
        : null;
    })
    .filter(Boolean);
}

async function titleForPage(page) {
  try {
    return await page.title();
  } catch {
    return "";
  }
}

function buildTree(capturedRows) {
  const root = {
    label: "Healthy Eating",
    url: startUrl,
    children: new Map(),
    pages: [],
  };

  for (const row of capturedRows) {
    const url = new URL(row.final_url);
    if (url.hostname === "recipes.heart.org") {
      if (!root.children.has("Recipe samples")) {
        root.children.set("Recipe samples", { label: "Recipe samples", pages: [], children: new Map() });
      }
      root.children.get("Recipe samples").pages.push(row);
      continue;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const after = parts.slice(parts.indexOf("healthy-eating") + 1);
    if (after.length === 0) {
      root.pages.push(row);
      continue;
    }
    const first = after[0];
    const label = first
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    if (!root.children.has(label)) {
      root.children.set(label, { label, pages: [], children: new Map() });
    }
    root.children.get(label).pages.push(row);
  }
  return root;
}

function renderSitemap(capturedRows, summary) {
  const tree = buildTree(capturedRows);
  const branches = [...tree.children.values()].sort((a, b) => a.label.localeCompare(b.label));
  const width = 2600;
  const branchHeight = 78;
  const pageRowHeight = 46;
  const gap = 24;
  const branchBlocks = branches.map((branch) => {
    const shown = branch.pages.slice(0, 14);
    return {
      branch,
      shown,
      omitted: Math.max(0, branch.pages.length - shown.length),
      height: branchHeight + shown.length * pageRowHeight + (branch.pages.length > shown.length ? pageRowHeight : 0),
    };
  });
  const height = Math.max(1500, 320 + branchBlocks.reduce((sum, block) => sum + block.height + gap, 0));

  let y = 260;
  const blocks = branchBlocks
    .map((block) => {
      const x = 760;
      const headerY = y;
      const rows = block.shown
        .map((row, index) => {
          const rowY = headerY + branchHeight + index * pageRowHeight;
          const label = row.title.replace(/\s+\|\s+American Heart Association$/i, "").slice(0, 86);
          return `
            <rect x="${x + 26}" y="${rowY}" width="1620" height="${pageRowHeight - 8}" rx="8" fill="#fff" stroke="#d5dbe3" stroke-width="2"/>
            <text x="${x + 46}" y="${rowY + 27}" class="page">${escapeXml(label)}</text>
          `;
        })
        .join("");
      const omittedRow = block.omitted
        ? `
            <rect x="${x + 26}" y="${headerY + branchHeight + block.shown.length * pageRowHeight}" width="1620" height="${pageRowHeight - 8}" rx="8" fill="#f8f9fb" stroke="#d5dbe3" stroke-width="2"/>
            <text x="${x + 46}" y="${headerY + branchHeight + block.shown.length * pageRowHeight + 27}" class="omitted">+ ${block.omitted} more captured pages in this branch</text>
          `
        : "";
      const connectorStartX = headerY + 33 <= 406 ? 730 : 402;
      const blockSvg = `
        <path d="M ${connectorStartX} ${headerY + 33} H ${x - 22}" stroke="#1f2933" stroke-width="3" fill="none"/>
        <rect x="${x}" y="${headerY}" width="1690" height="${block.height}" rx="18" fill="#ffffff" stroke="#c9d1dc" stroke-width="3"/>
        <rect x="${x}" y="${headerY}" width="1690" height="62" rx="18" fill="#3f4653"/>
        <text x="${x + 26}" y="${headerY + 40}" class="branch">${escapeXml(block.branch.label)} (${block.branch.pages.length})</text>
        ${rows}
        ${omittedRow}
      `;
      y += block.height + gap;
      return blockSvg;
    })
    .join("");

  const branchNames = branches.map((branch) => `${branch.label} (${branch.pages.length})`).join(" • ");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <style>
    .eyebrow { font: 800 24px Arial, sans-serif; fill: #c8102e; letter-spacing: 2px; }
    .title { font: 800 58px Arial, sans-serif; fill: #20242c; }
    .note { font: 400 26px Arial, sans-serif; fill: #66717f; }
    .root { font: 800 34px Arial, sans-serif; fill: #fff; }
    .rootMeta { font: 700 22px Arial, sans-serif; fill: #ffe9ed; }
    .branch { font: 800 28px Arial, sans-serif; fill: #fff; }
    .page { font: 700 22px Arial, sans-serif; fill: #20242c; }
    .omitted { font: 700 22px Arial, sans-serif; fill: #66717f; }
    .small { font: 700 20px Arial, sans-serif; fill: #66717f; }
  </style>
  <rect width="${width}" height="${height}" fill="#f5f1ea"/>
  <text x="72" y="82" class="eyebrow">HEALTHY EATING STATUS QUO</text>
  <text x="72" y="154" class="title">Current Healthy Eating page network</text>
  <text x="72" y="202" class="note">Captured ${summary.capturedCount} HTML pages from the current Healthy Eating branch, with recipe pages capped at ${recipeCaptureLimit} samples.</text>
  <rect x="72" y="260" width="660" height="146" rx="18" fill="#c8102e"/>
  <text x="104" y="316" class="root">Healthy Eating</text>
  <text x="104" y="356" class="rootMeta">${summary.healthyEatingCount} AHA pages + ${summary.recipeCount} recipe samples</text>
  <text x="104" y="392" class="rootMeta">${summary.excludedCount} excluded non-page/out-of-scope links logged</text>
  <path d="M 402 406 V ${Math.max(420, height - 90)}" stroke="#1f2933" stroke-width="3" fill="none"/>
  ${blocks}
  <text x="72" y="${height - 42}" class="small">${escapeXml(branchNames.slice(0, 220))}${branchNames.length > 220 ? "..." : ""}</text>
</svg>`;

  const svgPath = path.join(mockupDir, "healthy-eating-current-sitemap.svg");
  const htmlPath = path.join(mockupDir, "healthy-eating-current-sitemap.html");
  writeFileSync(svgPath, svg);
  writeFileSync(
    htmlPath,
    `<!doctype html><html><head><meta charset="utf-8"><title>Healthy Eating Current Sitemap</title></head><body style="margin:0">${svg}</body></html>`,
  );
  return { svgPath, htmlPath };
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function screenshotSequence(row) {
  const filename = path.basename(row.screenshot_file || "");
  const match = filename.match(/^(\d+)__/);
  return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
}

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 1,
});

const discovered = new Map();
const queue = [];
const captured = new Map();
const linkInventory = new Map();
let recipeCaptured = 0;

function recordLink({ url, text, source_type, from_url, include, exclude_reason }) {
  const key = url;
  const existing = linkInventory.get(key) || {
    include: include ? "yes" : "no",
    exclude_reason: exclude_reason || "",
    source_types: new Set(),
    texts: new Set(),
    url,
    from_urls: new Set(),
  };
  if (!include && existing.include !== "yes") existing.exclude_reason = exclude_reason || existing.exclude_reason;
  if (include) existing.include = "yes";
  if (source_type) existing.source_types.add(source_type);
  if (text) existing.texts.add(text);
  if (from_url) existing.from_urls.add(from_url);
  linkInventory.set(key, existing);
}

function enqueue(url, reason = "crawl") {
  if (captured.has(url) || discovered.has(url)) return;
  const isRecipe = new URL(url).hostname === "recipes.heart.org";
  if (isRecipe && recipeCaptured + [...discovered.keys()].filter((candidate) => {
    try {
      return new URL(candidate).hostname === "recipes.heart.org";
    } catch {
      return false;
    }
  }).length >= recipeCaptureLimit) {
    return;
  }
  discovered.set(url, { reason });
  queue.push(url);
}

enqueue(startUrl, "start");

while (queue.length > 0 && captured.size < maxPages) {
  const url = queue.shift();
  if (captured.has(url)) continue;
  const isRecipe = new URL(url).hostname === "recipes.heart.org";
  if (isRecipe && recipeCaptured >= recipeCaptureLimit) continue;
  const row = {
    input_url: url,
    final_url: "",
    title: "",
    status: "pending",
    error: "",
    bucket: "",
    source_types: "",
    link_texts: "",
    screenshot_file: "",
  };

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
    await page.waitForLoadState("networkidle", { timeout: 12_000 }).catch(() => {});
    await dismissOverlays(page);
    await page.waitForTimeout(450);

    const finalUrl = normalizeUrl(page.url());
    row.final_url = finalUrl || page.url();
    row.title = await titleForPage(page);
    row.bucket = classifyBucket(row.final_url);

    const order = captured.size + 1;
    const filename = `${String(order).padStart(2, "0")}__${slugForUrl(row.final_url)}.png`;
    const screenshotPath = path.join(screenshotDir, filename);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    row.screenshot_file = path.relative(repoRoot, screenshotPath);
    row.status = "ok";

    const matchingInventory = linkInventory.get(url);
    if (matchingInventory) {
      row.source_types = [...matchingInventory.source_types].sort().join("|");
      row.link_texts = [...matchingInventory.texts].filter(Boolean).slice(0, 8).join(" | ");
    } else if (url === startUrl) {
      row.source_types = "start";
      row.link_texts = "Healthy Eating";
    }

    captured.set(url, row);
    if (isRecipe) recipeCaptured += 1;

    const links = await extractLinks(page, row.final_url);
    for (const link of links) {
      const include = isCandidatePage(link.url);
      let exclude_reason = "";
      if (!include) {
        exclude_reason = isNonHtmlOrNonPageResource(link.url)
          ? "non-html-or-non-page-resource"
          : "outside-healthy-eating-scope";
      }
      if (new URL(link.url).hostname === "recipes.heart.org" && recipeCaptured >= recipeCaptureLimit) {
        exclude_reason = "recipe-capture-limit";
      }
      recordLink({ ...link, from_url: row.final_url, include, exclude_reason });
      if (include) {
        const host = new URL(link.url).hostname;
        if (host !== "recipes.heart.org" || recipeCaptured < recipeCaptureLimit) enqueue(link.url);
      }
    }
  } catch (error) {
    row.status = "error";
    row.error = error?.message || String(error);
    captured.set(url, row);
  }
}

await browser.close();

const capturedRows = [...captured.values()].sort((a, b) => screenshotSequence(a) - screenshotSequence(b));
const manifestRows = capturedRows.map((row, index) => ({
  order: index + 1,
  source_types: row.source_types,
  link_texts: row.link_texts,
  input_url: row.input_url,
  final_url: row.final_url,
  title: row.title,
  bucket: row.bucket,
  screenshot_file: row.screenshot_file,
  status: row.status,
  error: row.error,
}));

const linkRows = [...linkInventory.values()]
  .sort((a, b) => a.url.localeCompare(b.url))
  .map((row) => ({
    include: row.include,
    exclude_reason: row.include === "yes" ? "" : row.exclude_reason,
    source_types: [...row.source_types].sort().join("|"),
    texts: [...row.texts].filter(Boolean).slice(0, 12).join(" | "),
    url: row.url,
    from_urls: [...row.from_urls].slice(0, 10).join(" | "),
  }));

writeFileSync(
  path.join(screenshotDir, "manifest.csv"),
  toCsv(manifestRows, [
    "order",
    "source_types",
    "link_texts",
    "input_url",
    "final_url",
    "title",
    "bucket",
    "screenshot_file",
    "status",
    "error",
  ]),
);

writeFileSync(
  path.join(screenshotDir, "link_inventory.csv"),
  toCsv(linkRows, ["include", "exclude_reason", "source_types", "texts", "url", "from_urls"]),
);

writeFileSync(path.join(screenshotDir, "manifest.json"), JSON.stringify(manifestRows, null, 2));

const summary = {
  generatedAt: new Date().toISOString(),
  startUrl,
  capturedCount: manifestRows.filter((row) => row.status === "ok").length,
  healthyEatingCount: manifestRows.filter((row) => row.status === "ok" && row.bucket !== "recipes-sample").length,
  recipeCount: manifestRows.filter((row) => row.status === "ok" && row.bucket === "recipes-sample").length,
  errorCount: manifestRows.filter((row) => row.status !== "ok").length,
  includedLinkCount: linkRows.filter((row) => row.include === "yes").length,
  excludedCount: linkRows.filter((row) => row.include === "no").length,
  bucketSummary: manifestRows.reduce((acc, row) => {
    acc[row.bucket] = (acc[row.bucket] || 0) + 1;
    return acc;
  }, {}),
};

writeFileSync(path.join(mockupDir, "healthy-eating-current-network-summary.json"), JSON.stringify(summary, null, 2));

const { svgPath, htmlPath } = renderSitemap(manifestRows.filter((row) => row.status === "ok"), summary);

const sitemapPage = await chromium.launch();
const sitemapBrowserPage = await sitemapPage.newPage({
  viewport: { width: 2600, height: 1800 },
  deviceScaleFactor: 1,
});
await sitemapBrowserPage.goto(pathToFileURL(htmlPath).href);
await sitemapBrowserPage.screenshot({
  path: path.join(mockupDir, "healthy-eating-current-sitemap.png"),
  fullPage: true,
});
await sitemapPage.close();

console.log(JSON.stringify({ summary, screenshotDir, mockupDir, svgPath }, null, 2));
