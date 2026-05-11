import fs from 'node:fs/promises';
import path from 'node:path';
import JSZip from 'jszip';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

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

async function readPng(filePath) {
  return PNG.sync.read(await fs.readFile(filePath));
}

async function pptStats(pptxPath) {
  if (!pptxPath) return null;
  const zip = await JSZip.loadAsync(await fs.readFile(pptxPath));
  const slideMasters = Object.keys(zip.files).filter((name) => /^ppt\/slideMasters\/slideMaster\d+\.xml$/.test(name)).length;
  const slideLayouts = Object.keys(zip.files).filter((name) => /^ppt\/slideLayouts\/slideLayout\d+\.xml$/.test(name)).length;
  const slides = Object.keys(zip.files).filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name)).length;
  return { slideMasters, slideLayouts, slides };
}

async function main() {
  const args = parseArgs(process.argv);
  const figmaDir = path.resolve(args.figma || '.artifacts/build/figma/screenshots');
  const pptDir = path.resolve(args.ppt || '.artifacts/build/ppt-renders');
  const reportPath = path.resolve(args.report || '.artifacts/reports/ppt-parity.md');
  const specPath = path.resolve(args.spec || '.artifacts/build/presentation-spec.json');
  const pptxPath = args.pptx ? path.resolve(args.pptx) : null;

  const spec = JSON.parse(await fs.readFile(specPath, 'utf8'));
  const ppt = await pptStats(pptxPath);
  const rows = [];
  let maxDiff = 0;

  for (let index = 0; index < spec.validationSlides.length; index += 1) {
    const slide = spec.validationSlides[index];
    const sourceName = `${slide.sourceName.toLowerCase().replaceAll(' ', '-')}.png`;
    const sourcePath = path.join(figmaDir, sourceName);
    const renderedCandidates = [
      path.join(pptDir, `slide-${index + 1}.png`),
      path.join(pptDir, `slide-${String(index + 1).padStart(2, '0')}.png`),
    ];
    let renderedPath = renderedCandidates[0];
    try {
      await fs.access(renderedCandidates[0]);
    } catch {
      renderedPath = renderedCandidates[1];
    }
    const [source, rendered] = await Promise.all([readPng(sourcePath), readPng(renderedPath)]);
    if (source.width !== rendered.width || source.height !== rendered.height) {
      throw new Error(`Image size mismatch for ${slide.sourceName}: source ${source.width}x${source.height}, rendered ${rendered.width}x${rendered.height}`);
    }
    const diffPixels = pixelmatch(source.data, rendered.data, null, source.width, source.height, { threshold: 0.15 });
    const diffPct = Number(((diffPixels / (source.width * source.height)) * 100).toFixed(4));
    maxDiff = Math.max(maxDiff, diffPct);
    rows.push({ slide: slide.sourceName, layout: slide.layoutId, diffPct });
  }

  const lines = ['# PPT Parity Report', ''];
  if (ppt) {
    lines.push(`- Slide masters: ${ppt.slideMasters}`);
    lines.push(`- Slide layouts: ${ppt.slideLayouts}`);
    lines.push(`- Slides: ${ppt.slides}`);
    lines.push('');
  }
  lines.push('| Slide | Layout | Diff % |');
  lines.push('| --- | --- | ---: |');
  for (const row of rows) lines.push(`| ${row.slide} | ${row.layout} | ${row.diffPct}% |`);
  lines.push('');
  lines.push(`- Max diff: ${maxDiff}%`);
  lines.push(`- Passes 1% threshold: ${maxDiff <= 1 ? 'yes' : 'no'}`);

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${lines.join('\n')}\n`);
  console.log(`qa report written: ${path.relative(process.cwd(), reportPath)}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
