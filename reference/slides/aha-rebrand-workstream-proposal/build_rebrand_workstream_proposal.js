#!/usr/bin/env node

const path = require("node:path");
const PptxGenJS = require("pptxgenjs");
const {
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require("/Users/alexanderbeck/.codex/skills/slides/assets/pptxgenjs_helpers/layout.js");

const OUTPUT_PPTX = path.resolve(
  "reference/slides/aha-rebrand-workstream-proposal/aha-rebrand-workstream-proposal.pptx"
);

const COLORS = {
  bg: "FFFFFF",
  ink: "111111",
  muted: "5C5C5C",
  line: "DADADA",
  accent: "D3031F",
  accentSoft: "F8EDEE",
  blackSoft: "F5F5F5",
};

const FONTS = {
  display: "Georgia",
  body: "Arial",
};

function addSectionHeader(slide, label) {
  slide.addText(label.toUpperCase(), {
    x: 0.72,
    y: 0.42,
    w: 2.6,
    h: 0.18,
    fontFace: FONTS.body,
    fontSize: 9.5,
    bold: true,
    color: COLORS.accent,
    margin: 0,
    breakLine: false,
    valign: "mid",
  });

  slide.addShape("line", {
    x: 0.72,
    y: 0.68,
    w: 11.88,
    h: 0,
    line: { color: COLORS.line, width: 1.25 },
  });
}

function addHeadline(slide, text, x, y, w, h, fontSize = 24) {
  slide.addText(text, {
    x,
    y,
    w,
    h,
    fontFace: FONTS.display,
    fontSize,
    bold: true,
    color: COLORS.ink,
    margin: 0,
    breakLine: false,
    valign: "top",
    fit: "shrink",
  });
}

function addBody(slide, text, x, y, w, h, fontSize = 14, color = COLORS.muted) {
  slide.addText(text, {
    x,
    y,
    w,
    h,
    fontFace: FONTS.body,
    fontSize,
    color,
    margin: 0,
    breakLine: false,
    valign: "top",
    fit: "shrink",
    paraSpaceAfterPt: 4,
    breakLineSpacePt: 2,
  });
}

function addPanel(slide, x, y, w, h, fill = COLORS.blackSoft, line = COLORS.line) {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    rectRadius: 0.08,
    fill: { color: fill },
    line: { color: line, width: 1 },
  });
}

function addTopAccent(slide, x, y, w) {
  slide.addShape("line", {
    x,
    y,
    w,
    h: 0,
    line: { color: COLORS.accent, width: 2.5 },
  });
}

function addListItem(slide, index, text, x, y, w, h, options = {}) {
  const badgeW = options.badgeW || 0.44;
  const textX = x + badgeW + 0.18;
  const textW = w - badgeW - 0.18;

  slide.addShape("roundRect", {
    x,
    y: y + 0.02,
    w: badgeW,
    h: h - 0.04,
    rectRadius: 0.08,
    fill: { color: COLORS.accentSoft },
    line: { color: COLORS.accentSoft, width: 1 },
  });

  slide.addText(String(index), {
    x,
    y: y + 0.01,
    w: badgeW,
    h: h - 0.02,
    fontFace: FONTS.body,
    fontSize: 12,
    bold: true,
    color: COLORS.accent,
    align: "center",
    valign: "mid",
    margin: 0,
    breakLine: false,
  });

  slide.addText(text, {
    x: textX,
    y,
    w: textW,
    h,
    fontFace: FONTS.body,
    fontSize: options.fontSize || 13.4,
    color: options.color || COLORS.ink,
    bold: options.bold || false,
    margin: 0,
    breakLine: false,
    valign: "mid",
    fit: "shrink",
  });
}

function addPrompt(slide, index, text, x, y, w, h) {
  slide.addShape("line", {
    x,
    y: y + 0.18,
    w: 0.18,
    h: 0,
    line: { color: COLORS.accent, width: 2.5 },
  });

  slide.addText(`${index}. ${text}`, {
    x: x + 0.3,
    y,
    w: w - 0.3,
    h,
    fontFace: FONTS.body,
    fontSize: 14,
    color: COLORS.ink,
    margin: 0,
    breakLine: false,
    valign: "mid",
    fit: "shrink",
  });
}

function addFooterNote(slide, text) {
  addPanel(slide, 0.72, 6.62, 11.88, 0.48, COLORS.accentSoft, COLORS.accentSoft);
  slide.addText(text, {
    x: 0.94,
    y: 6.76,
    w: 11.44,
    h: 0.18,
    fontFace: FONTS.body,
    fontSize: 11,
    color: COLORS.ink,
    margin: 0,
    breakLine: false,
    valign: "mid",
    fit: "shrink",
  });
}

function finalizeSlide(slide, pptx) {
  warnIfSlideHasOverlaps(slide, pptx, { muteContainment: true });
  warnIfSlideElementsOutOfBounds(slide, pptx);
}

function buildSlide1(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSectionHeader(slide, "Why we are raising this now");
  addHeadline(
    slide,
    "The website refresh is already the first phase of AHA's next brand expression.",
    0.72,
    0.98,
    7.1,
    1.42,
    28
  );
  addBody(
    slide,
    "We wanted to address the internal rebrand conversation directly. The instinct is right: AHA should use this moment to evolve how the brand shows up. Our view is that the website is the right place to establish that next expression first, because it is AHA's broadest and most active public touchpoint.",
    0.74,
    2.48,
    6.35,
    2.0,
    14.2
  );

  addPanel(slide, 8.2, 1.18, 4.4, 3.94, COLORS.blackSoft, COLORS.line);
  addTopAccent(slide, 8.2, 1.18, 4.4);
  slide.addText("Why this is the right starting point", {
    x: 8.5,
    y: 1.52,
    w: 3.6,
    h: 0.34,
    fontFace: FONTS.body,
    fontSize: 11,
    bold: true,
    color: COLORS.accent,
    margin: 0,
    breakLine: false,
    valign: "mid",
  });

  addListItem(slide, 1, "AHA's primary public touchpoint", 8.5, 2.02, 3.6, 0.58);
  addListItem(slide, 2, "The broadest audience surface", 8.5, 2.72, 3.6, 0.58);
  addListItem(slide, 3, "The best foundation for future rollout", 8.5, 3.42, 3.6, 0.58);

  addFooterNote(
    slide,
    "This is not a recommendation to pause brand thinking. It is a recommendation to sequence it well."
  );
  finalizeSlide(slide, pptx);
}

function buildSlide2(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSectionHeader(slide, "What this workstream already covers");
  addHeadline(
    slide,
    "We are already redefining how AHA shows up digitally.",
    0.72,
    0.98,
    8.2,
    0.88,
    24
  );

  slide.addText("What we are defining now", {
    x: 0.74,
    y: 2.14,
    w: 3.0,
    h: 0.22,
    fontFace: FONTS.body,
    fontSize: 11,
    bold: true,
    color: COLORS.accent,
    margin: 0,
  });

  addListItem(slide, 1, "Visual expression and image system", 0.74, 2.42, 5.85, 0.5);
  addListItem(slide, 2, "How the palette evolves without losing AHA recognition", 0.74, 3.02, 5.85, 0.5);
  addListItem(slide, 3, "Motion behavior and overall feel", 0.74, 3.62, 5.85, 0.5);
  addListItem(slide, 4, "Tone of voice in the digital environment", 0.74, 4.22, 5.85, 0.5);
  addListItem(slide, 5, "Component language and interaction character", 0.74, 4.82, 5.85, 0.5);
  addListItem(slide, 6, "The major moments and touchpoints of the website", 0.74, 5.42, 5.85, 0.5);

  addPanel(slide, 7.12, 2.14, 5.48, 3.78, COLORS.accentSoft, COLORS.accentSoft);
  addTopAccent(slide, 7.12, 2.14, 5.48);
  slide.addText("Boundary for this phase", {
    x: 7.42,
    y: 2.46,
    w: 2.5,
    h: 0.24,
    fontFace: FONTS.body,
    fontSize: 11,
    bold: true,
    color: COLORS.accent,
    margin: 0,
  });
  addBody(
    slide,
    "This phase focuses on the system and major moments of the website. It is not intended to redesign every page or every non-web touchpoint in parallel.",
    7.42,
    2.84,
    4.6,
    1.24,
    14,
    COLORS.ink
  );
  slide.addShape("line", {
    x: 7.42,
    y: 4.3,
    w: 4.6,
    h: 0,
    line: { color: "E3B8BF", width: 1 },
  });
  addBody(
    slide,
    "That still constitutes real brand evolution. It is where expression, utility, and trust have to work together in the most visible way.",
    7.42,
    4.54,
    4.6,
    1.05,
    13.8,
    COLORS.ink
  );
  finalizeSlide(slide, pptx);
}

function buildSlide3(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSectionHeader(slide, "Why not open a separate rebrand stream now");
  addHeadline(
    slide,
    "A parallel rebrand stream would create overlap before the foundation is proven.",
    0.72,
    0.98,
    9.2,
    0.92,
    24
  );
  addListItem(slide, 1, "The same expression decisions would be made twice.", 0.74, 2.26, 11.0, 0.58, { fontSize: 14 });
  addListItem(slide, 2, "Ownership and approval paths would become less clear.", 0.74, 3.02, 11.0, 0.58, { fontSize: 14 });
  addListItem(slide, 3, "Brand choices could outpace the digital system before it is resolved.", 0.74, 3.78, 11.0, 0.58, { fontSize: 14 });
  addListItem(slide, 4, "Additional coordination would slow the current website rollout.", 0.74, 4.54, 11.0, 0.58, { fontSize: 14 });
  addListItem(slide, 5, "Early outputs would be harder to keep coherent across teams.", 0.74, 5.3, 11.0, 0.58, { fontSize: 14 });
  addFooterNote(
    slide,
    "The issue is timing and sequencing, not whether brand matters. The goal is to protect quality and coherence."
  );
  finalizeSlide(slide, pptx);
}

function buildSlide4(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSectionHeader(slide, "What we recommend instead");
  addHeadline(
    slide,
    "Use the website as Phase 1, then scale those principles outward.",
    0.72,
    0.98,
    8.7,
    1.0,
    24
  );

  addPanel(slide, 0.74, 2.0, 5.18, 3.5, COLORS.blackSoft, COLORS.line);
  addTopAccent(slide, 0.74, 2.0, 5.18);
  slide.addText("PHASE 1", {
    x: 1.02,
    y: 2.3,
    w: 0.9,
    h: 0.2,
    fontFace: FONTS.body,
    fontSize: 10,
    bold: true,
    color: COLORS.accent,
    margin: 0,
  });
  addHeadline(slide, "Website refresh", 1.0, 2.58, 3.2, 0.48, 21);
  addBody(
    slide,
    "Establish and prove the digital brand foundation through the website system and major touchpoints.",
    1.02,
    3.1,
    4.28,
    0.78,
    13.6,
    COLORS.ink
  );
  addListItem(slide, 1, "Visual expression", 1.02, 4.0, 3.9, 0.44, { fontSize: 12.5 });
  addListItem(slide, 2, "Trust, navigation, and content clarity", 1.02, 4.48, 3.9, 0.44, { fontSize: 12.5 });
  addListItem(slide, 3, "Component and motion behavior", 1.02, 4.96, 3.9, 0.44, { fontSize: 12.5 });

  slide.addShape("chevron", {
    x: 6.18,
    y: 3.22,
    w: 0.62,
    h: 0.5,
    fill: { color: COLORS.accent },
    line: { color: COLORS.accent, width: 1 },
  });

  addPanel(slide, 7.0, 2.0, 5.58, 3.5, COLORS.accentSoft, COLORS.accentSoft);
  addTopAccent(slide, 7.0, 2.0, 5.58);
  slide.addText("PHASE 2", {
    x: 7.28,
    y: 2.3,
    w: 0.9,
    h: 0.2,
    fontFace: FONTS.body,
    fontSize: 10,
    bold: true,
    color: COLORS.accent,
    margin: 0,
  });
  addHeadline(slide, "Brand expansion follow-on", 7.26, 2.58, 4.3, 0.48, 21);
  addBody(
    slide,
    "Extend the proven principles into other touchpoints once the web foundation is real and tested.",
    7.28,
    3.1,
    4.62,
    0.78,
    13.6,
    COLORS.ink
  );
  addListItem(slide, 1, "Broader channel rollout", 7.28, 4.0, 4.2, 0.44, { fontSize: 12.5 });
  addListItem(slide, 2, "Fresh brand materials and templates", 7.28, 4.48, 4.2, 0.44, { fontSize: 12.5 });
  addListItem(slide, 3, "Image, motion, and governance guidance", 7.28, 4.96, 4.2, 0.44, { fontSize: 12.5 });

  addFooterNote(
    slide,
    "Now that branding is a stronger agency pillar, a follow-on phase can be more valuable once the web foundation is established."
  );
  finalizeSlide(slide, pptx);
}

function buildSlide5(pptx) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bg };
  addSectionHeader(slide, "Decision for today");
  addHeadline(
    slide,
    "Treat the website program as the foundation of the next AHA brand chapter.",
    0.72,
    0.98,
    9.4,
    1.0,
    24
  );

  addPanel(slide, 0.74, 2.02, 5.72, 3.9, COLORS.blackSoft, COLORS.line);
  addTopAccent(slide, 0.74, 2.02, 5.72);
  slide.addText("Recommendation for alignment", {
    x: 1.02,
    y: 2.34,
    w: 2.8,
    h: 0.22,
    fontFace: FONTS.body,
    fontSize: 11,
    bold: true,
    color: COLORS.accent,
    margin: 0,
  });
  addHeadline(slide, "Website-first sequencing", 1.0, 2.72, 4.1, 0.45, 22);
  addBody(
    slide,
    "Continue shaping the next digital expression through the website refresh, keep brand stakeholders actively involved, and define the broader rollout as a follow-on phase once the foundation is live.",
    1.02,
    3.22,
    4.72,
    1.45,
    14,
    COLORS.ink
  );

  addPanel(slide, 6.92, 2.02, 5.66, 3.9, COLORS.accentSoft, COLORS.accentSoft);
  addTopAccent(slide, 6.92, 2.02, 5.66);
  slide.addText("Discussion prompts", {
    x: 7.2,
    y: 2.34,
    w: 2.2,
    h: 0.22,
    fontFace: FONTS.body,
    fontSize: 11,
    bold: true,
    color: COLORS.accent,
    margin: 0,
  });
  addPrompt(
    slide,
    1,
    "Which non-web touchpoints matter most for a follow-on phase?",
    7.2,
    2.84,
    4.8,
    0.7
  );
  addPrompt(
    slide,
    2,
    "How should internal brand stakeholders stay involved during the current website work?",
    7.2,
    3.92,
    4.8,
    0.86
  );

  addFooterNote(
    slide,
    "We are not postponing brand thinking. We are building from a real foundation rather than splitting the same decisions across two tracks."
  );
  finalizeSlide(slide, pptx);
}

async function main() {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Codex";
  pptx.company = "OpenAI";
  pptx.subject = "AHA rebrand workstream proposal";
  pptx.title = "AHA rebrand workstream proposal";
  pptx.lang = "en-GB";
  pptx.theme = {
    headFontFace: FONTS.display,
    bodyFontFace: FONTS.body,
    lang: "en-GB",
  };

  buildSlide1(pptx);
  buildSlide2(pptx);
  buildSlide3(pptx);
  buildSlide4(pptx);
  buildSlide5(pptx);

  await pptx.writeFile({ fileName: OUTPUT_PPTX });
  console.log(`deck written: ${OUTPUT_PPTX}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
