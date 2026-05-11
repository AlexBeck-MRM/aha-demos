import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1760, height: 2880 },
  deviceScaleFactor: 1,
});

await page.goto(pathToFileURL(path.join(__dirname, "high-blood-pressure-page-mid-density-mockup.html")).href);
await page.evaluate(() => document.fonts.ready);

await page.locator(".frame").screenshot({
  path: path.join(__dirname, "high-blood-pressure-page-mid-density-mockup.jpg"),
  type: "jpeg",
  quality: 92,
  animations: "disabled",
});

await browser.close();

console.log("high-blood-pressure-page-mid-density-mockup.jpg");
