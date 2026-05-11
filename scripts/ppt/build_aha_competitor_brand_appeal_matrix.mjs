#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import PptxGenJS from "pptxgenjs";

const require = createRequire(import.meta.url);
const { imageSizingContain } = require("/Users/alexanderbeck/.codex/skills/slides/assets/pptxgenjs_helpers/image.js");
const {
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require("/Users/alexanderbeck/.codex/skills/slides/assets/pptxgenjs_helpers/layout.js");

const DATA_PATH = "reference/data/aha_space_brand_matrix_scores_global20.csv";
const OUTPUT_DIR = "reference/slides/aha-competitor-brand-appeal-matrix";
const OUTPUT_PPTX = `${OUTPUT_DIR}/aha-competitor-brand-appeal-matrix.pptx`;

const COLORS = {
  bg: "FFFDF8",
  canvas: "FFFFFF",
  ink: "181D27",
  secondary: "414651",
  muted: "667085",
  line: "D5D7DA",
  red: "CF222B",
  blush: "FCECEC",
  clay: "FFF1E8",
  sand: "FFF8E8",
  mint: "ECFBF2",
  sky: "EEF5FF",
  chip: "F4F0EA",
  chipActive: "CF222B",
  card: "FFFFFF",
  cardShadow: "B8B0A5",
};

const FILTERS = [
  { key: "logos", label: "Logos" },
  { key: "all", label: "All" },
  { key: "us", label: "US" },
  { key: "international", label: "Global" },
  { key: "human_side", label: "Human side" },
  { key: "institutional_side", label: "Institutional" },
];

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  values.push(current);
  return values;
}

async function readData(csvPath) {
  const content = await fs.readFile(csvPath, "utf8");
  const lines = content.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const fields = parseCsvLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = fields[index] ?? "";
    });
    row.human_invitation_score = Number(row.human_invitation_score);
    row.guide_utility_score = Number(row.guide_utility_score);
    row.logo_scale = Number(row.logo_scale || 1);
    return row;
  });
}

function addText(slide, text, opts) {
  slide.addText(text, {
    margin: 0,
    breakLine: false,
    valign: "mid",
    ...opts,
  });
}

function addChip(slide, x, y, w, h, label, active, slideIndex) {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    rectRadius: 0.09,
    fill: { color: active ? COLORS.chipActive : COLORS.chip },
    line: { color: active ? COLORS.chipActive : COLORS.line, width: 1 },
    hyperlink: { slide: slideIndex, tooltip: `Go to ${label}` },
  });
  addText(slide, label, {
    x,
    y: y + 0.01,
    w,
    h,
    fontFace: "Aptos",
    fontSize: 10.5,
    bold: true,
    color: active ? "FFFFFF" : COLORS.secondary,
    align: "center",
  });
}

function addHeader(slide, activeFilter, slideMap) {
  slide.background = { color: COLORS.bg };

  addText(slide, "AHA comparator brand matrix", {
    x: 0.6,
    y: 0.36,
    w: 4.2,
    h: 0.34,
    fontFace: "Aptos",
    fontSize: 22,
    bold: true,
    color: COLORS.ink,
  });

  addText(
    slide,
    "Rebuilt with 20 brands. Logos are normalized first, then placed on a matrix that asks how useful the brand feels as a guide and how human the experience feels.",
    {
      x: 0.6,
      y: 0.78,
      w: 7.8,
      h: 0.32,
      fontFace: "Aptos",
      fontSize: 10,
      color: COLORS.secondary,
    }
  );

  let chipX = 7.1;
  for (const filter of FILTERS) {
    const chipW =
      filter.key === "institutional_side" ? 1.18 : filter.key === "human_side" ? 1.0 : filter.key === "international" ? 0.92 : 0.76;
    addChip(slide, chipX, 0.42, chipW, 0.34, filter.label, filter.key === activeFilter, slideMap[filter.key]);
    chipX += chipW + 0.08;
  }
}

function addLogoCard(slide, item, x, y, w, h, label = false) {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: COLORS.card },
    line: { color: COLORS.line, width: 1 },
    shadow: { type: "outer", color: COLORS.cardShadow, blur: 1, angle: 45, distance: 1, opacity: 0.15 },
  });

  slide.addImage({
    path: path.resolve(item.logo_file),
    ...imageSizingContain(path.resolve(item.logo_file), x + 0.1, y + 0.08, w - 0.2, h - (label ? 0.32 : 0.16)),
  });

  if (label) {
    addText(slide, item.brand, {
      x: x + 0.08,
      y: y + h - 0.21,
      w: w - 0.16,
      h: 0.12,
      fontFace: "Aptos",
      fontSize: 6.7,
      color: COLORS.muted,
      align: "center",
    });
  }
}

function addLogoReviewSlide(slide, items, slideMap) {
  addHeader(slide, "logos", slideMap);

  addText(slide, "Logo normalization check", {
    x: 0.6,
    y: 1.34,
    w: 3.2,
    h: 0.28,
    fontFace: "Aptos",
    fontSize: 16,
    bold: true,
    color: COLORS.ink,
  });

  addText(
    slide,
    "Every mark sits on the same card and uses the same container. The differences you still see are intentional brand-shape differences, not random source-file scale drift.",
    {
      x: 0.6,
      y: 1.62,
      w: 6.3,
      h: 0.28,
      fontFace: "Aptos",
      fontSize: 9.5,
      color: COLORS.secondary,
    }
  );

  addText(slide, "US set", {
    x: 0.76,
    y: 2.02,
    w: 1.0,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 9,
    bold: true,
    color: COLORS.red,
  });

  addText(slide, "International set", {
    x: 6.95,
    y: 2.02,
    w: 1.4,
    h: 0.18,
    fontFace: "Aptos",
    fontSize: 9,
    bold: true,
    color: COLORS.red,
  });

  const usItems = items.filter((item) => item.region === "us");
  const internationalItems = items.filter((item) => item.region === "international");

  const startY = 2.18;
  const cardW = 2.4;
  const cardH = 0.78;
  const rowGap = 0.12;

  const validationStart = slide._slideObjects.length;

  usItems.forEach((item, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    addLogoCard(slide, item, 0.72 + col * 2.74, startY + row * (cardH + rowGap), cardW, cardH, true);
  });

  internationalItems.forEach((item, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    addLogoCard(slide, item, 6.9 + col * 2.74, startY + row * (cardH + rowGap), cardW, cardH, true);
  });

  return {
    validationStart,
    validationEnd: slide._slideObjects.length,
  };
}

function matrixPosition(item, plot) {
  const normalizedX = (item.human_invitation_score - 1) / 9;
  const normalizedY = (item.guide_utility_score - 1) / 9;
  return {
    x: plot.x + normalizedX * plot.w,
    y: plot.y + plot.h - normalizedY * plot.h,
  };
}

function buildLogoPlacements(items, plot) {
  const dense = items.length > 12;
  const cards = items.map((item) => {
    const pos = matrixPosition(item, plot);
    const cardW = dense ? 0.86 : 0.96;
    const cardH = dense ? 0.44 : 0.48;
    return {
      ...item,
      cardW,
      cardH,
      x: Math.max(plot.x + 0.06, Math.min(plot.x + plot.w - cardW - 0.06, pos.x - cardW / 2)),
      y: Math.max(plot.y + 0.06, Math.min(plot.y + plot.h - cardH - 0.06, pos.y - cardH / 2)),
      targetX: pos.x,
      targetY: pos.y,
    };
  });

  for (let pass = 0; pass < 100; pass += 1) {
    for (let i = 0; i < cards.length; i += 1) {
      for (let j = i + 1; j < cards.length; j += 1) {
        const a = cards[i];
        const b = cards[j];
        const overlapX = Math.min(a.x + a.cardW, b.x + b.cardW) - Math.max(a.x, b.x);
        const overlapY = Math.min(a.y + a.cardH, b.y + b.cardH) - Math.max(a.y, b.y);
        if (overlapX > 0 && overlapY > 0) {
          const moveX = overlapX / 2 + 0.04;
          const moveY = overlapY / 2 + 0.03;
          if (a.x <= b.x) {
            a.x -= moveX;
            b.x += moveX;
          } else {
            a.x += moveX;
            b.x -= moveX;
          }
          if (a.y <= b.y) {
            a.y -= moveY;
            b.y += moveY;
          } else {
            a.y += moveY;
            b.y -= moveY;
          }
        }
      }
    }

    for (const card of cards) {
      card.x += (card.targetX - (card.x + card.cardW / 2)) * 0.035;
      card.y += (card.targetY - (card.y + card.cardH / 2)) * 0.035;
      card.x = Math.max(plot.x + 0.06, Math.min(plot.x + plot.w - card.cardW - 0.06, card.x));
      card.y = Math.max(plot.y + 0.06, Math.min(plot.y + plot.h - card.cardH - 0.06, card.y));
    }
  }

  return cards;
}

function addMatrixBase(slide, activeFilter, slideMap) {
  addHeader(slide, activeFilter, slideMap);

  const plot = { x: 1.18, y: 1.65, w: 10.7, h: 4.98 };

  slide.addShape("roundRect", {
    x: plot.x,
    y: plot.y,
    w: plot.w,
    h: plot.h,
    rectRadius: 0.04,
    fill: { color: COLORS.canvas },
    line: { color: COLORS.line, width: 1 },
  });

  slide.addShape("rect", {
    x: plot.x,
    y: plot.y,
    w: plot.w / 2,
    h: plot.h / 2,
    fill: { color: COLORS.sky, transparency: 45 },
    line: { color: COLORS.sky, transparency: 100 },
  });
  slide.addShape("rect", {
    x: plot.x + plot.w / 2,
    y: plot.y,
    w: plot.w / 2,
    h: plot.h / 2,
    fill: { color: COLORS.mint, transparency: 45 },
    line: { color: COLORS.mint, transparency: 100 },
  });
  slide.addShape("rect", {
    x: plot.x,
    y: plot.y + plot.h / 2,
    w: plot.w / 2,
    h: plot.h / 2,
    fill: { color: COLORS.sand, transparency: 45 },
    line: { color: COLORS.sand, transparency: 100 },
  });
  slide.addShape("rect", {
    x: plot.x + plot.w / 2,
    y: plot.y + plot.h / 2,
    w: plot.w / 2,
    h: plot.h / 2,
    fill: { color: COLORS.clay, transparency: 50 },
    line: { color: COLORS.clay, transparency: 100 },
  });

  for (let i = 1; i < 4; i += 1) {
    slide.addShape("line", {
      x: plot.x + (plot.w * i) / 4,
      y: plot.y,
      w: 0,
      h: plot.h,
      line: { color: COLORS.line, width: 1, transparency: 38 },
    });
    slide.addShape("line", {
      x: plot.x,
      y: plot.y + (plot.h * i) / 4,
      w: plot.w,
      h: 0,
      line: { color: COLORS.line, width: 1, transparency: 38 },
    });
  }

  slide.addShape("line", {
    x: plot.x + plot.w / 2,
    y: plot.y,
    w: 0,
    h: plot.h,
    line: { color: COLORS.secondary, width: 1.35, transparency: 26 },
  });
  slide.addShape("line", {
    x: plot.x,
    y: plot.y + plot.h / 2,
    w: plot.w,
    h: 0,
    line: { color: COLORS.secondary, width: 1.35, transparency: 26 },
  });

  addText(slide, "Higher guide utility", {
    x: 0.38,
    y: 1.15,
    w: 2.15,
    h: 0.2,
    fontFace: "Aptos",
    fontSize: 10,
    bold: true,
    color: COLORS.secondary,
  });
  addText(slide, "Lower guide utility", {
    x: 0.44,
    y: 6.15,
    w: 1.8,
    h: 0.2,
    fontFace: "Aptos",
    fontSize: 9,
    color: COLORS.muted,
  });
  addText(slide, "More institutional / system-led", {
    x: 1.18,
    y: 6.78,
    w: 2.25,
    h: 0.2,
    fontFace: "Aptos",
    fontSize: 9,
    color: COLORS.muted,
  });
  addText(slide, "More human / inviting", {
    x: 9.7,
    y: 6.78,
    w: 2.2,
    h: 0.2,
    fontFace: "Aptos",
    fontSize: 10,
    bold: true,
    color: COLORS.secondary,
    align: "right",
  });

  slide.addShape("roundRect", {
    x: 8.62,
    y: 1.92,
    w: 2.68,
    h: 0.72,
    rectRadius: 0.06,
    fill: { color: COLORS.card, transparency: 8 },
    line: { color: COLORS.red, width: 1.1, dash: "dash" },
  });
  addText(slide, "AHA opportunity: high guide value with a more people-made feel", {
    x: 8.76,
    y: 2.09,
    w: 2.36,
    h: 0.28,
    fontFace: "Aptos",
    fontSize: 8.4,
    bold: true,
    color: COLORS.red,
    align: "center",
  });

  addText(slide, "This is directional scoring from first-fold brand signals, not audited market research.", {
    x: 0.6,
    y: 7.08,
    w: 4.6,
    h: 0.16,
    fontFace: "Aptos",
    fontSize: 8.3,
    color: COLORS.muted,
  });

  return plot;
}

function addMatrixLogos(slide, items, plot) {
  const validationStart = slide._slideObjects.length;
  const cards = buildLogoPlacements(items, plot);
  for (const item of cards) {
    addLogoCard(slide, item, item.x, item.y, item.cardW, item.cardH);
  }
  return {
    validationStart,
    validationEnd: slide._slideObjects.length,
  };
}

function filterItems(items, key) {
  if (key === "all") return items;
  if (key === "us") return items.filter((item) => item.region === "us");
  if (key === "international") return items.filter((item) => item.region === "international");
  return items.filter((item) => item.posture_group === key);
}

async function main() {
  const items = await readData(DATA_PATH);
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Codex";
  pptx.company = "OpenAI";
  pptx.subject = "AHA competitor brand matrix";
  pptx.title = "AHA competitor brand matrix";
  pptx.lang = "en-US";
  pptx.theme = {
    headFontFace: "Aptos",
    bodyFontFace: "Aptos",
    lang: "en-US",
  };

  const slideMap = {
    logos: 1,
    all: 2,
    us: 3,
    international: 4,
    human_side: 5,
    institutional_side: 6,
  };

  const validations = [];

  const reviewSlide = pptx.addSlide();
  validations.push({ slide: reviewSlide, ...addLogoReviewSlide(reviewSlide, items, slideMap) });

  for (const filter of FILTERS.slice(1)) {
    const slide = pptx.addSlide();
    const plot = addMatrixBase(slide, filter.key, slideMap);
    const visibleItems = filterItems(items, filter.key);
    validations.push({ slide, ...addMatrixLogos(slide, visibleItems, plot) });
  }

  for (const { slide, validationStart, validationEnd } of validations) {
    const originalObjects = slide._slideObjects;
    slide._slideObjects = slide._slideObjects.slice(validationStart, validationEnd);
    warnIfSlideHasOverlaps(slide, pptx, { muteContainment: true, ignoreLines: true });
    warnIfSlideElementsOutOfBounds(slide, pptx);
    slide._slideObjects = originalObjects;
  }

  await fs.mkdir(path.resolve(OUTPUT_DIR), { recursive: true });
  await pptx.writeFile({ fileName: path.resolve(OUTPUT_PPTX) });
  console.log(`deck written: ${OUTPUT_PPTX}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
