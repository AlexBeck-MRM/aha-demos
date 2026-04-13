import fs from "fs/promises";
import path from "path";

const root = process.cwd();
const catalogueCandidates = [
  path.join(root, "output", "playwright", "brand-landscape", "catalogue.md"),
  path.join(root, "output", "playwright", "brand-landscape-images", "catalogue.md")
];
const videoRoot = path.join(root, "output", "playwright", "brand-landscape-videos");

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

function fileExists(target) {
  return fs
    .access(target)
    .then(() => true)
    .catch(() => false);
}

function markdownLink(value) {
  return `[${value}](${value})`;
}

async function findCatalogue() {
  for (const candidate of catalogueCandidates) {
    if (await fileExists(candidate)) {
      return candidate;
    }
  }
  throw new Error("Could not find catalogue.md in expected folders.");
}

async function main() {
  const cataloguePath = await findCatalogue();
  const text = await fs.readFile(cataloguePath, "utf8");
  const lines = text.split("\n");

  const headerIndex = lines.findIndex((line) => line.startsWith("| Category |"));
  const dividerIndex = headerIndex + 1;
  if (headerIndex < 0 || !lines[dividerIndex]?.startsWith("| ---")) {
    throw new Error("Invalid catalogue table format.");
  }

  const before = lines.slice(0, headerIndex);
  const rows = [];
  let cursor = dividerIndex + 1;
  while (cursor < lines.length && lines[cursor].trim().startsWith("|")) {
    const cells = splitRow(lines[cursor]);
    if (cells.length >= 8) {
      rows.push(cells);
    }
    cursor += 1;
  }
  const after = lines.slice(cursor);

  const generatedIndex = before.findIndex((line) => line.startsWith("- Generated:"));
  if (generatedIndex >= 0) {
    before[generatedIndex] = `- Generated: ${new Date().toISOString()}`;
  }
  const videoMetaIndex = before.findIndex((line) => line.startsWith("- Video choreography:"));
  if (videoMetaIndex >= 0) {
    before[videoMetaIndex] = "- Video choreography: 10s loop (hero pause, menu hover, down/up scroll).";
  } else {
    before.push("- Video choreography: 10s loop (hero pause, menu hover, down/up scroll).");
  }

  const table = [];
  table.push("| Category | Brand | URL | Screenshot | Video (10s) | Capture Method | Logo (300x300) | Status | Notes |");
  table.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");

  let linkedCount = 0;
  for (const row of rows) {
    const [category, brand, urlCell, screenshotCell, captureMethod, logoCell, statusCell, notesCell] = row;
    const videoRelPath = normalize(path.join("output", "playwright", "brand-landscape-videos", category, `${slugify(brand)}.webm`));
    const videoAbsPath = path.join(root, videoRelPath);
    const hasVideo = await fileExists(videoAbsPath);
    const videoCell = hasVideo ? markdownLink(videoRelPath) : "-";
    if (hasVideo) {
      linkedCount += 1;
    }
    table.push(
      `| ${category} | ${brand} | ${urlCell} | ${screenshotCell} | ${videoCell} | ${captureMethod} | ${logoCell} | ${statusCell} | ${notesCell} |`
    );
  }

  const output = [...before, ...table, ...after].join("\n").replace(/\n+$/, "\n");
  await fs.writeFile(cataloguePath, output, "utf8");
  process.stdout.write(`Updated ${cataloguePath}\n`);
  process.stdout.write(`Video links added: ${linkedCount}\n`);
}

function normalize(inputPath) {
  return inputPath.split(path.sep).join("/");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
