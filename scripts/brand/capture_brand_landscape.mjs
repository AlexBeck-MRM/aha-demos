import fs from "fs/promises";
import path from "path";
import { chromium, firefox, webkit } from "playwright";

const viewport = { width: 1920, height: 1200 };
const outputRoot = path.join(process.cwd(), "output", "playwright", "brand-landscape");
const cataloguePath = path.join(outputRoot, "catalogue.md");

const categories = [
  "01-healthcare-nonprofit",
  "02-editorial-health",
  "03-community-charity",
  "04-adjacent-purpose"
];

const brands = [
  { category: "01-healthcare-nonprofit", brand: "Breakthrough T1D", url: "https://www.breakthrought1d.org" },
  { category: "01-healthcare-nonprofit", brand: "Feeding America", url: "https://www.feedingamerica.org" },
  { category: "01-healthcare-nonprofit", brand: "American Cancer Society", url: "https://www.cancer.org" },
  { category: "01-healthcare-nonprofit", brand: "The ALS Association", url: "https://www.als.org" },
  { category: "01-healthcare-nonprofit", brand: "American Red Cross", url: "https://www.redcross.org" },
  { category: "01-healthcare-nonprofit", brand: "Mayo Clinic", url: "https://www.mayoclinic.org" },
  { category: "01-healthcare-nonprofit", brand: "St. Jude Children's Research Hospital", url: "https://www.stjude.org" },
  { category: "01-healthcare-nonprofit", brand: "Make-A-Wish America", url: "https://wish.org" },
  { category: "01-healthcare-nonprofit", brand: "American Heart Association", url: "https://www.heart.org" },
  { category: "01-healthcare-nonprofit", brand: "American Lung Association", url: "https://www.lung.org" },
  { category: "01-healthcare-nonprofit", brand: "American Diabetes Association", url: "https://diabetes.org" },
  { category: "01-healthcare-nonprofit", brand: "Alzheimer's Association", url: "https://www.alz.org" },
  { category: "01-healthcare-nonprofit", brand: "Susan G. Komen", url: "https://www.komen.org" },
  { category: "01-healthcare-nonprofit", brand: "National MS Society", url: "https://www.nationalmssociety.org" },
  { category: "01-healthcare-nonprofit", brand: "Parkinson's Foundation", url: "https://www.parkinson.org" },
  { category: "01-healthcare-nonprofit", brand: "March of Dimes", url: "https://www.marchofdimes.org" },
  { category: "02-editorial-health", brand: "Healthline", url: "https://www.healthline.com" },
  { category: "02-editorial-health", brand: "WebMD", url: "https://www.webmd.com" },
  { category: "02-editorial-health", brand: "Verywell Health", url: "https://www.verywellhealth.com" },
  { category: "02-editorial-health", brand: "Cleveland Clinic Health Essentials", url: "https://health.clevelandclinic.org" },
  { category: "02-editorial-health", brand: "Harvard Health Publishing", url: "https://www.health.harvard.edu" },
  { category: "02-editorial-health", brand: "Johns Hopkins Health", url: "https://www.hopkinsmedicine.org/health" },
  { category: "03-community-charity", brand: "Save the Children", url: "https://www.savethechildren.org" },
  { category: "03-community-charity", brand: "UNICEF", url: "https://www.unicef.org" },
  { category: "03-community-charity", brand: "Direct Relief", url: "https://www.directrelief.org" },
  { category: "03-community-charity", brand: "Doctors Without Borders", url: "https://www.doctorswithoutborders.org" },
  { category: "03-community-charity", brand: "Ronald McDonald House Charities", url: "https://www.rmhc.org" },
  { category: "03-community-charity", brand: "Habitat for Humanity", url: "https://www.habitat.org" },
  { category: "03-community-charity", brand: "Ashoka", url: "https://www.ashoka.org" },
  { category: "03-community-charity", brand: "Acumen", url: "https://acumen.org" },
  { category: "03-community-charity", brand: "Skoll Foundation", url: "https://skoll.org" },
  { category: "03-community-charity", brand: "IDEO.org", url: "https://www.ideo.org" },
  { category: "03-community-charity", brand: "Bridgespan Group", url: "https://www.bridgespan.org" },
  { category: "04-adjacent-purpose", brand: "Patagonia", url: "https://www.patagonia.com", logoRequired: true, note: "New adjacent example" },
  { category: "04-adjacent-purpose", brand: "Ben & Jerry's", url: "https://www.benjerry.com", logoRequired: true, note: "New adjacent example" },
  { category: "04-adjacent-purpose", brand: "TOMS", url: "https://www.toms.com", logoRequired: true, note: "New adjacent example" },
  { category: "04-adjacent-purpose", brand: "Bombas", url: "https://www.bombas.com", logoRequired: true, note: "New adjacent example" }
];

const browserFactories = { firefox, chromium, webkit };
const browserOrder = ["firefox", "chromium", "webkit"];
const blockedPattern = /(access denied|performing security verification|just a moment|verify you are human|sorry,\s*you have been blocked|request blocked|captcha|cloudflare)/i;
const consentPattern = /(accept|agree|consent|allow|continue|got it|close|dismiss|ok|okay|yes)/i;

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

function toRelPath(absPath) {
  return path.relative(process.cwd(), absPath).split(path.sep).join("/");
}

function websiteFilename(item) {
  return `${slugify(item.brand)}.png`;
}

function logoRawFilename(item) {
  return `${slugify(item.brand)}-logo-raw.png`;
}

function logoFinalFilename(item) {
  return `${slugify(item.brand)}-logo-300.png`;
}

async function resetOutput() {
  await fs.rm(outputRoot, { recursive: true, force: true });
  await fs.mkdir(outputRoot, { recursive: true });
  await Promise.all(categories.map((category) => fs.mkdir(path.join(outputRoot, category), { recursive: true })));
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
    "No thanks"
  ];

  for (const label of textButtons) {
    const button = page.getByRole("button", { name: new RegExp(`^${label}$`, "i") }).first();
    try {
      if (await button.isVisible({ timeout: 500 })) {
        await button.click({ timeout: 2000 });
        await page.waitForTimeout(250);
      }
    } catch {
      continue;
    }
  }

  const closeSelectors = [
    'button[aria-label*="close" i]',
    '[role="button"][aria-label*="close" i]',
    'button[title*="close" i]',
    'button:has-text("×")',
    'button:has-text("✕")',
    '[class*="close" i]',
    '[class*="dismiss" i]'
  ];

  for (const selector of closeSelectors) {
    const el = page.locator(selector).first();
    try {
      if (await el.isVisible({ timeout: 500 })) {
        await el.click({ timeout: 1200 });
        await page.waitForTimeout(200);
      }
    } catch {
      continue;
    }
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
      '[class*="popup" i]'
    ];

    const viewportArea = window.innerWidth * window.innerHeight;
    for (const selector of selectors) {
      for (const node of document.querySelectorAll(selector)) {
        if (!(node instanceof HTMLElement)) {
          continue;
        }
        const style = window.getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        const area = rect.width * rect.height;
        if (style.display === "none" || style.visibility === "hidden") {
          continue;
        }
        const hasSignal = /(cookie|privacy|consent|gdpr|newsletter|subscribe)/i.test((node.textContent || "").slice(0, 800));
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

async function pageHealthCheck(page) {
  const title = await page.title().catch(() => "");
  const bodyText = await page.locator("body").innerText({ timeout: 5000 }).catch(() => "");

  const blocked = blockedPattern.test(`${title} ${bodyText.slice(0, 3000)}`);

  const overlayStats = await page.evaluate(() => {
    const nodes = [...document.querySelectorAll("body *")];
    const viewportArea = window.innerWidth * window.innerHeight;
    let largeModalCount = 0;
    let consentLikeCount = 0;

    for (const node of nodes) {
      if (!(node instanceof HTMLElement)) {
        continue;
      }
      const style = window.getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity || "1") < 0.1) {
        continue;
      }
      const rect = node.getBoundingClientRect();
      if (rect.width < 40 || rect.height < 40) {
        continue;
      }
      const isFixed = style.position === "fixed";
      if (!isFixed) {
        continue;
      }
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
    blockedReason: blocked ? `${title || "blocked content"} ${bodyText.slice(0, 120).replace(/\s+/g, " ")}` : "",
    overlayIssue: overlayStats.largeModalCount > 0 || overlayStats.consentLikeCount > 0
  };
}

async function captureWithBrowser(item, browser) {
  const context = await browser.newContext({
    viewport,
    locale: "en-US",
    colorScheme: "light",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
  });

  const page = await context.newPage();
  page.setDefaultNavigationTimeout(90000);
  page.setDefaultTimeout(35000);

  try {
    await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 90000 });
    await Promise.allSettled([
      page.waitForLoadState("load", { timeout: 30000 }),
      page.waitForLoadState("networkidle", { timeout: 30000 })
    ]);
    await page.waitForTimeout(1400);
    await dismissPopups(page);
    await page.waitForTimeout(600);

    const check = await pageHealthCheck(page);
    if (check.blocked) {
      throw new Error(`blocked:${check.blockedReason}`);
    }
    if (check.overlayIssue) {
      throw new Error("overlay:modal_or_consent_detected");
    }

    await page.evaluate(() => window.scrollTo({ top: 0, left: 0, behavior: "instant" }));
    const outputAbsPath = path.join(outputRoot, item.category, websiteFilename(item));
    await page.screenshot({ path: outputAbsPath, fullPage: false });

    await context.close();
    return {
      status: "captured",
      method: `playwright-${browser.browserType().name()}`,
      screenshot: toRelPath(outputAbsPath),
      note: ""
    };
  } catch (error) {
    await context.close();
    return {
      status: "failed",
      method: `playwright-${browser.browserType().name()}`,
      screenshot: "",
      note: String(error.message || error)
    };
  }
}

async function captureViaMicrolink(item, chromiumBrowser) {
  try {
    const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(item.url)}&screenshot=true&meta=false`;
    const response = await fetch(apiUrl, { method: "GET" });
    if (!response.ok) {
      throw new Error(`microlink_api_${response.status}`);
    }
    const payload = await response.json();
    const screenshotUrl = payload?.data?.screenshot?.url;
    if (!screenshotUrl) {
      throw new Error("microlink_missing_screenshot_url");
    }

    const context = await chromiumBrowser.newContext({ viewport, locale: "en-US", colorScheme: "light" });
    const page = await context.newPage();
    await page.goto(screenshotUrl, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(1200);

    const outputAbsPath = path.join(outputRoot, item.category, websiteFilename(item));
    await page.screenshot({ path: outputAbsPath, fullPage: false });
    await context.close();

    return {
      status: "captured",
      method: "microlink-fallback",
      screenshot: toRelPath(outputAbsPath),
      note: "Captured via fallback renderer."
    };
  } catch (error) {
    return {
      status: "failed",
      method: "microlink-fallback",
      screenshot: "",
      note: String(error.message || error)
    };
  }
}

async function captureBrand(item, browserMap) {
  const attempts = [];
  for (const engine of browserOrder) {
    const result = await captureWithBrowser(item, browserMap[engine]);
    if (result.status === "captured") {
      return { ...item, ...result, attempts };
    }
    attempts.push(`${result.method}: ${result.note}`);
  }

  const fallback = await captureViaMicrolink(item, browserMap.chromium);
  if (fallback.status === "captured") {
    return { ...item, ...fallback, attempts };
  }

  attempts.push(`microlink-fallback: ${fallback.note}`);
  return {
    ...item,
    status: "failed",
    method: "all-failed",
    screenshot: "",
    note: attempts.join(" | "),
    attempts
  };
}

async function captureLogoRaw(item, browserMap) {
  const logoAbsRawPath = path.join(outputRoot, item.category, logoRawFilename(item));
  const logoSelectors = [
    'header img[alt*="logo" i]',
    'img[alt*="logo" i]',
    'header [class*="logo" i] img',
    'img[src*="logo" i]',
    'header a[href="/"] img',
    'header svg',
    'svg[aria-label*="logo" i]',
    'header [class*="logo" i] svg',
    'a[href="/"] svg'
  ];

  for (const engine of browserOrder) {
    const browser = browserMap[engine];
    const context = await browser.newContext({
      viewport,
      locale: "en-US",
      colorScheme: "light",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    });
    await context.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    });
    const page = await context.newPage();

    try {
      await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 90000 });
      await Promise.allSettled([page.waitForLoadState("load", { timeout: 20000 }), page.waitForTimeout(1200)]);
      await dismissPopups(page);

      for (const selector of logoSelectors) {
        const locator = page.locator(selector).first();
        try {
          if (!(await locator.isVisible({ timeout: 700 }))) {
            continue;
          }
          const box = await locator.boundingBox();
          if (!box) {
            continue;
          }
          if (box.width < 40 || box.height < 16 || box.width > 900 || box.height > 500) {
            continue;
          }
          await locator.screenshot({ path: logoAbsRawPath });
          await context.close();
          return { logoRaw: toRelPath(logoAbsRawPath), logoStatus: "captured", logoNote: `logo selector ${selector}` };
        } catch {
          continue;
        }
      }

      const fallbackIcon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(item.url)}&sz=256`;
      const response = await fetch(fallbackIcon, { method: "GET" });
      if (response.ok) {
        const bytes = Buffer.from(await response.arrayBuffer());
        await fs.writeFile(logoAbsRawPath, bytes);
        await context.close();
        return { logoRaw: toRelPath(logoAbsRawPath), logoStatus: "captured", logoNote: "favicon fallback" };
      }
      throw new Error("no logo selectors matched");
    } catch (error) {
      await context.close();
      if (engine === browserOrder[browserOrder.length - 1]) {
        return { logoRaw: "", logoStatus: "failed", logoNote: String(error.message || error) };
      }
    }
  }

  return { logoRaw: "", logoStatus: "failed", logoNote: "logo capture failed on all engines" };
}

async function writeCatalogue(results) {
  const lines = [];
  lines.push("# Brand Website Screenshot Catalogue");
  lines.push("");
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push(`- Viewport: ${viewport.width}x${viewport.height}`);
  lines.push("- Category folders: max 4");
  lines.push("");
  lines.push("| Category | Brand | URL | Screenshot | Capture Method | Logo (300x300) | Status | Notes |");
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");

  for (const result of results) {
    const urlCell = `[${result.url}](${result.url})`;
    const screenshotCell = result.screenshot ? `[${result.screenshot}](${result.screenshot})` : "-";
    const logoCell = result.logo300 ? `[${result.logo300}](${result.logo300})` : "-";
    const note = (result.note || result.logoNote || "").replace(/\|/g, "\\|") || "-";
    lines.push(
      `| ${result.category} | ${result.brand} | ${urlCell} | ${screenshotCell} | ${result.method || "-"} | ${logoCell} | ${result.status} | ${note} |`
    );
  }

  lines.push("");
  await fs.writeFile(cataloguePath, `${lines.join("\n")}\n`, "utf8");
}

async function main() {
  await resetOutput();

  const browserMap = {
    firefox: await firefox.launch({ headless: true }),
    chromium: await chromium.launch({ headless: true, args: ["--disable-blink-features=AutomationControlled"] }),
    webkit: await webkit.launch({ headless: true })
  };

  const results = [];
  for (const item of brands) {
    process.stdout.write(`Capturing website: ${item.brand}\n`);
    const captured = await captureBrand(item, browserMap);
    process.stdout.write(` -> ${captured.status} (${captured.method})\n`);

    if (item.logoRequired) {
      process.stdout.write(`Capturing logo: ${item.brand}\n`);
      const logoCapture = await captureLogoRaw(item, browserMap);
      captured.logoRaw = logoCapture.logoRaw;
      captured.logoStatus = logoCapture.logoStatus;
      captured.logoNote = logoCapture.logoNote;
      captured.logo300 = logoCapture.logoRaw ? toRelPath(path.join(outputRoot, item.category, logoFinalFilename(item))) : "";
      process.stdout.write(` -> logo ${logoCapture.logoStatus}\n`);
    } else {
      captured.logoRaw = "";
      captured.logoStatus = "n/a";
      captured.logoNote = "";
      captured.logo300 = "";
    }

    results.push(captured);
  }

  await Promise.all(Object.values(browserMap).map((browser) => browser.close()));
  await writeCatalogue(results);

  const capturedCount = results.filter((item) => item.status === "captured").length;
  const failedCount = results.filter((item) => item.status === "failed").length;
  process.stdout.write(`\nComplete. Captured: ${capturedCount}, Failed: ${failedCount}\n`);
  process.stdout.write(`Catalogue: ${toRelPath(cataloguePath)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
