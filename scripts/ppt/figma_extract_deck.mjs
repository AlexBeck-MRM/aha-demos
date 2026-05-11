import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';
import {
  PILOT_FILE_KEY,
  PILOT_NODE_ID,
  PILOT_SLIDE_IDS,
  PILOT_VARIABLES,
  assetCatalog,
  pilotSlides,
  isPilotRequest,
} from './ppt-pilot-source.mjs';

const MW_SANS_DIR = path.join(process.env.HOME || '', 'Library/Mobile Documents/com~apple~CloudDocs/Downloads (iCloud)/Manual Library/MW Sans');

function parseArgs(argv) {
  const args = { slides: PILOT_SLIDE_IDS.join(',') };
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key.startsWith('--')) continue;
    args[key.slice(2)] = value;
    i += 1;
  }
  return args;
}

function htmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderTextContent(item) {
  if (Array.isArray(item.text)) {
    return `<ul>${item.text.map((entry) => `<li>${htmlEscape(entry)}</li>`).join('')}</ul>`;
  }
  return htmlEscape(item.text).replaceAll('\n', '<br>');
}

function styleFromItem(item) {
  const token = PILOT_VARIABLES[item.style.fontToken] || { family: 'Arial', size: 24, weight: 400, lineHeight: 28 };
  const fontWeight = item.style.weight || token.weight || 400;
  return [
    `left:${item.x}px`,
    `top:${item.y}px`,
    `width:${item.w}px`,
    `height:${item.h}px`,
    `font-family:'MW Sans', Arial, sans-serif`,
    `font-size:${token.size}px`,
    `line-height:${(token.lineHeight / token.size).toFixed(4)}`,
    `font-weight:${fontWeight}`,
    `color:${item.style.color}`,
    `text-align:${item.style.align || 'left'}`,
    'position:absolute',
    'margin:0',
    'white-space:pre-wrap',
  ].join(';');
}

function renderFixed(item, assets) {
  if (item.type === 'image') {
    return `<img class="fixed-image" src="/${assets[item.assetKey]}" style="position:absolute;left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px;object-fit:contain;" alt="" />`;
  }
  if (item.type === 'text') {
    return `<div class="fixed-text" style="${styleFromItem(item)}">${renderTextContent(item)}</div>`;
  }
  if (item.type === 'rect') {
    const border = item.line && item.line.transparency !== 100 ? `border:${item.line.width || 1}px solid ${item.line.color}` : 'border:none';
    return `<div class="rect" style="position:absolute;left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px;background:${item.fill};border-radius:${item.radius || 0}px;${border};"></div>`;
  }
  if (item.type === 'line') {
    return `<div class="line" style="position:absolute;left:${item.x}px;top:${item.y}px;width:${item.w}px;height:1px;background:${item.line.color};"></div>`;
  }
  if (item.type === 'vgrid') {
    const parts = [];
    const step = item.w / item.count;
    for (let i = 0; i <= item.count; i += 1) {
      const x = item.startX + step * i;
      parts.push(`<div class="vline" style="position:absolute;left:${x}px;top:${item.y}px;width:1px;height:${item.h}px;background:${item.color};"></div>`);
    }
    return parts.join('');
  }
  if (item.type === 'pill') {
    return `<div class="pill" style="position:absolute;left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px;background:${item.fill};border-radius:${item.radius}px;"></div>`;
  }
  return '';
}

function renderPlaceholder(item) {
  const token = PILOT_VARIABLES[item.style.fontToken] || { family: 'Arial', size: 24, weight: 400, lineHeight: 28 };
  const padding = item.padding || { top: 0, right: 0, bottom: 0, left: 0 };
  const extra = Array.isArray(item.text) ? 'display:block;' : '';
  const listReset = Array.isArray(item.text)
    ? 'padding-left:40px;margin:0;'
    : '';
  return `<div data-placeholder-id="${item.id}" style="${styleFromItem(item)};padding:${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px;box-sizing:border-box;${extra}">${Array.isArray(item.text) ? `<ul style="${listReset}">${item.text.map((entry) => `<li>${htmlEscape(entry)}</li>`).join('')}</ul>` : renderTextContent(item)}</div>`;
}

function renderSlideHtml(slide, assets) {
  const bg = slide.background.type === 'image'
    ? `background-image:url('/${assets[slide.background.assetKey]}');background-size:cover;background-position:center;`
    : `background:${slide.background.color};`;
  const overlay = slide.background.overlay
    ? `<div style="position:absolute;inset:0;background:${slide.background.overlay.color};opacity:${slide.background.overlay.opacity};"></div>`
    : '';
  const fixed = slide.fixed.map((item) => renderFixed(item, assets)).join('');
  const placeholders = slide.placeholders.map((item) => renderPlaceholder(item)).join('');
  return `<section class="slide" data-slide-id="${slide.id}" style="${bg}">${overlay}${fixed}${placeholders}</section>`;
}

async function copyFonts(fontsDir) {
  await fs.mkdir(fontsDir, { recursive: true });
  const desired = [
    'mwsans-regular-webfont.woff2',
    'mwsans-semibold-webfont.woff2',
    'mwsans-regular-webfont.woff',
    'mwsans-semibold-webfont.woff',
  ];
  const available = [];
  for (const name of desired) {
    const source = path.join(MW_SANS_DIR, name);
    try {
      await fs.copyFile(source, path.join(fontsDir, name));
      available.push(name);
    } catch {
      // Ignore missing fonts and rely on system fallback.
    }
  }
  return available;
}

async function download(url, targetPath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.writeFile(targetPath, buffer);
}

async function startServer(rootDir) {
  const server = http.createServer(async (request, response) => {
    const reqPath = decodeURIComponent((request.url || '/').split('?')[0]);
    const filePath = path.join(rootDir, reqPath === '/' ? 'source-preview.html' : reqPath);
    try {
      const data = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      const types = {
        '.html': 'text/html; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.json': 'application/json; charset=utf-8',
      };
      response.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
      response.end(data);
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });
  await new Promise((resolve) => server.listen(4174, '127.0.0.1', resolve));
  return server;
}

async function renderSourceScreenshots(outDir, deck) {
  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
@font-face { font-family: 'MW Sans'; src: url('/fonts/mwsans-regular-webfont.woff2') format('woff2'), url('/fonts/mwsans-regular-webfont.woff') format('woff'); font-weight: 400; font-style: normal; }
@font-face { font-family: 'MW Sans'; src: url('/fonts/mwsans-semibold-webfont.woff2') format('woff2'), url('/fonts/mwsans-semibold-webfont.woff') format('woff'); font-weight: 600 700; font-style: normal; }
html, body { margin: 0; padding: 0; background: #111; }
body { display: flex; flex-direction: column; gap: 24px; align-items: center; padding: 24px; }
.slide { position: relative; width: 1920px; height: 1080px; overflow: hidden; background-repeat: no-repeat; }
ul { margin: 0; }
li { margin: 0 0 12px 0; }
</style>
</head>
<body>
${deck.slides.map((slide) => renderSlideHtml(slide, deck.assets)).join('')}
</body>
</html>`;
  await fs.writeFile(path.join(outDir, 'source-preview.html'), html, 'utf8');
  const server = await startServer(outDir);
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 2000, height: 1160 }, deviceScaleFactor: 1 });
    await page.goto('http://127.0.0.1:4174/source-preview.html', { waitUntil: 'networkidle' });
    for (const slide of deck.slides) {
      const locator = page.locator(`[data-slide-id="${slide.id}"]`);
      await locator.screenshot({ path: path.join(outDir, 'screenshots', `${slide.name.toLowerCase().replaceAll(' ', '-')}.png`) });
    }
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const slides = (args.slides || '').split(',').map((item) => item.trim()).filter(Boolean);
  const outDir = path.resolve(args.out || '.artifacts/build/figma');
  if (!isPilotRequest(args['file-key'], args['node-id'], slides)) {
    throw new Error(`This pilot extractor only supports file ${PILOT_FILE_KEY}, node ${PILOT_NODE_ID}, and slides ${PILOT_SLIDE_IDS.join(',')}.`);
  }

  const assetsDir = path.join(outDir, 'assets');
  const screenshotsDir = path.join(outDir, 'screenshots');
  const fontsDir = path.join(outDir, 'fonts');
  await fs.mkdir(assetsDir, { recursive: true });
  await fs.mkdir(screenshotsDir, { recursive: true });
  await copyFonts(fontsDir);

  const assets = {};
  for (const [assetKey, url] of Object.entries(assetCatalog)) {
    const target = path.join('assets', `${assetKey}.png`);
    await download(url, path.join(outDir, target));
    assets[assetKey] = target;
  }

  const deck = {
    extractedAt: new Date().toISOString(),
    fileKey: PILOT_FILE_KEY,
    nodeId: PILOT_NODE_ID,
    variables: PILOT_VARIABLES,
    assets,
    slides: pilotSlides,
  };

  await fs.writeFile(path.join(outDir, 'deck.json'), JSON.stringify(deck, null, 2));
  await renderSourceScreenshots(outDir, deck);
  console.log(`deck written: ${path.relative(process.cwd(), path.join(outDir, 'deck.json'))}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
