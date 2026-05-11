import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 3800, height: 2700 },
  deviceScaleFactor: 1,
});

await page.goto(pathToFileURL(path.join(__dirname, "board.html")).href);
await page.evaluate(() => document.fonts.ready);

await page.locator("#nav-board").screenshot({
  path: path.join(__dirname, "healthy-living-nav-a-b-vertical.png"),
  animations: "disabled",
});

await browser.close();

console.log("healthy-living-nav-a-b-vertical.png");
