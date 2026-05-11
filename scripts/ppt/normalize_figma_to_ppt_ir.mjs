import fs from 'node:fs/promises';
import path from 'node:path';

const LAYOUT_ORDER = [
  'LAY-COVER-HERO',
  'LAY-AGENDA-COVER',
  'LAY-TIMELINE-CARDS',
  'LAY-TIMELINE-GRID',
  'LAY-SECTION-DIVIDER',
  'LAY-NARRATIVE-TWO-COLUMN',
];

const LAYOUT_NAMES = {
  'LAY-COVER-HERO': 'Cover Hero',
  'LAY-AGENDA-COVER': 'Agenda Cover',
  'LAY-TIMELINE-CARDS': 'Timeline Cards',
  'LAY-TIMELINE-GRID': 'Timeline Grid',
  'LAY-SECTION-DIVIDER': 'Section Divider',
  'LAY-NARRATIVE-TWO-COLUMN': 'Narrative Two Column',
};

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key.startsWith('--')) continue;
    args[key.slice(2)] = value;
    i += 1;
  }
  return args;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function toLayoutBackground(slide) {
  if (slide.background.type === 'solid') return clone(slide.background);
  return { type: 'solid', color: slide.theme === 'dark' ? '#111111' : '#ffffff', validationOnly: true };
}

async function main() {
  const args = parseArgs(process.argv);
  const inputPath = path.resolve(args.input || '.artifacts/build/figma/deck.json');
  const outputPath = path.resolve(args.out || '.artifacts/build/presentation-spec.json');
  const deck = JSON.parse(await fs.readFile(inputPath, 'utf8'));

  const grouped = new Map();
  for (const slide of deck.slides) {
    if (!grouped.has(slide.layoutHint)) grouped.set(slide.layoutHint, []);
    grouped.get(slide.layoutHint).push(slide);
  }

  const layouts = LAYOUT_ORDER.map((layoutId) => {
    const slides = grouped.get(layoutId) || [];
    const base = clone(slides[0]);
    return {
      id: layoutId,
      name: LAYOUT_NAMES[layoutId],
      sourceSlides: slides.map((slide) => slide.id),
      theme: base.theme,
      background: toLayoutBackground(base),
      fixed: base.fixed,
      placeholders: base.placeholders.map((item) => {
        const copy = clone(item);
        delete copy.text;
        return copy;
      }),
    };
  });

  const validationSlides = deck.slides.map((slide, index) => ({
    sourceNodeId: slide.id,
    sourceName: slide.name,
    slideNumber: index + 1,
    layoutId: slide.layoutHint,
    background: slide.background,
    fixed: slide.fixed,
    content: slide.placeholders.reduce((acc, item) => {
      acc[item.id] = clone(item.text);
      return acc;
    }, {}),
  }));

  const spec = {
    canvas: { width: 1920, height: 1080, ratio: '16:9' },
    source: { fileKey: deck.fileKey, parentNodeId: deck.nodeId, slideNodeIds: deck.slides.map((slide) => slide.id) },
    master: { id: 'AHA-PILOT-MASTER', name: 'AHA Pilot Master' },
    tokens: deck.variables,
    assets: deck.assets,
    layouts,
    validationSlides,
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(spec, null, 2));
  console.log(`presentation spec written: ${path.relative(process.cwd(), outputPath)}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
