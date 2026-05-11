import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputs = [
  ["#ia-board", "condition-authority-ia-sitemap.png"],
  ["#desktop-board", "condition-authority-desktop-states.png"],
  ["#mobile-board", "condition-authority-mobile-states.png"],
  ["#subpage-board", "condition-authority-subpage-navigation.png"],
];

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 3200, height: 2200 },
  deviceScaleFactor: 1,
});

await page.goto(pathToFileURL(path.join(__dirname, "board.html")).href);
await page.evaluate(() => document.fonts.ready);

for (const [selector, filename] of outputs) {
  const locator = page.locator(selector);
  await locator.screenshot({
    path: path.join(__dirname, filename),
    animations: "disabled",
  });
}

await browser.close();

console.log(outputs.map(([, filename]) => filename).join("\n"));
