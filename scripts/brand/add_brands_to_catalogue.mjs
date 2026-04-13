import fs from "fs/promises";
import path from "path";

const candidates = [
  path.join(process.cwd(), "output", "playwright", "brand-landscape-images", "catalogue.md"),
  path.join(process.cwd(), "output", "playwright", "brand-landscape", "catalogue.md")
];

const additions = [
  {
    category: "01-healthcare-nonprofit",
    brand: "British Heart Foundation",
    url: "https://www.bhf.org.uk",
    notes: "Added March 2026."
  },
  {
    category: "03-community-charity",
    brand: "Charity: Water",
    url: "https://www.charitywater.org",
    notes: "Added March 2026."
  },
  {
    category: "04-adjacent-purpose",
    brand: "Virta Health",
    url: "https://www.virtahealth.com",
    notes: "Assumed this is the requested 'Virtual' brand."
  },
  {
    category: "02-editorial-health",
    brand: "My Health Pro",
    url: "https://myhealth-pro.com",
    notes: "Added March 2026."
  },
  {
    category: "02-editorial-health",
    brand: "Nutrition.org",
    url: "https://www.nutrition.org",
    notes: "Added March 2026."
  },
  {
    category: "04-adjacent-purpose",
    brand: "Strava",
    url: "https://www.strava.com",
    notes: "Added March 2026."
  }
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

function splitRow(line) {
  return line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
}

async function findCatalogPath() {
  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }
  throw new Error("Catalogue not found.");
}

function detectImageRoot(rows) {
  for (const row of rows) {
    const screenshotCell = row[3] || "";
    const match = screenshotCell.match(/\(([^)]+)\)/);
    if (!match) {
      continue;
    }
    const screenshotPath = match[1];
    const marker = `/${row[0]}/`;
    const markerIndex = screenshotPath.indexOf(marker);
    if (markerIndex > 0) {
      return screenshotPath.slice(0, markerIndex);
    }
  }
  return "output/playwright/brand-landscape-images";
}

async function main() {
  const catalogPath = await findCatalogPath();
  const text = await fs.readFile(catalogPath, "utf8");
  const lines = text.split("\n");
  const headerIndex = lines.findIndex((line) => line.startsWith("| Category |"));
  const dividerIndex = headerIndex + 1;

  if (headerIndex < 0 || !lines[dividerIndex]?.startsWith("| ---")) {
    throw new Error("Invalid catalogue format.");
  }

  const rows = [];
  let cursor = dividerIndex + 1;
  while (cursor < lines.length && lines[cursor].trim().startsWith("|")) {
    const cells = splitRow(lines[cursor]);
    if (cells.length >= 8) {
      rows.push(cells);
    }
    cursor += 1;
  }

  const imageRoot = detectImageRoot(rows);
  const existingKeys = new Set(rows.map((cells) => `${cells[0]}||${cells[1].toLowerCase()}`));

  let addedCount = 0;
  for (const item of additions) {
    const key = `${item.category}||${item.brand.toLowerCase()}`;
    if (existingKeys.has(key)) {
      continue;
    }
    const screenshotPath = `${imageRoot}/${item.category}/${slugify(item.brand)}.png`;
    rows.push([
      item.category,
      item.brand,
      `[${item.url}](${item.url})`,
      `[${screenshotPath}](${screenshotPath})`,
      "-",
      "pending",
      "-",
      "pending",
      item.notes
    ]);
    existingKeys.add(key);
    addedCount += 1;
  }

  const before = lines.slice(0, headerIndex);
  const after = lines.slice(cursor);
  const table = [];
  table.push("| Category | Brand | URL | Screenshot | Video (10s) | Capture Method | Logo (300x300) | Status | Notes |");
  table.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const row of rows) {
    const normalized = row.length >= 9 ? row : [...row.slice(0, 4), "-", row[4], row[5], row[6], row[7] || "-"];
    table.push(`| ${normalized.join(" | ")} |`);
  }

  const generatedIndex = before.findIndex((line) => line.startsWith("- Generated:"));
  if (generatedIndex >= 0) {
    before[generatedIndex] = `- Generated: ${new Date().toISOString()}`;
  }

  const merged = [...before, ...table, ...after].join("\n").replace(/\n+$/, "\n");
  await fs.writeFile(catalogPath, merged, "utf8");
  process.stdout.write(`Updated: ${catalogPath}\n`);
  process.stdout.write(`Added rows: ${addedCount}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
