import fs from 'node:fs/promises';
import path from 'node:path';
import PptxGenJS from 'pptxgenjs';

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

function px(value) {
  return Number((value / 144).toFixed(4));
}

function toHex(color) {
  return color ? color.replace('#', '') : '000000';
}

function alignValue(value) {
  if (value === 'center') return 'center';
  if (value === 'right') return 'right';
  return 'left';
}

function tokenFor(spec, fontToken) {
  const token = spec.tokens[fontToken];
  if (!token || typeof token !== 'object') {
    return { family: 'Arial', weight: 400, size: 24, lineHeight: 28.8 };
  }
  return token;
}

function textOptions(spec, item, extra = {}) {
  const token = tokenFor(spec, item.style.fontToken);
  return {
    x: px(item.x),
    y: px(item.y),
    w: px(item.w),
    h: px(item.h),
    fontFace: token.family,
    fontSize: token.size,
    bold: (item.style.weight || token.weight || 400) >= 600,
    color: toHex(item.style.color),
    align: alignValue(item.style.align),
    margin: item.padding ? [item.padding.top, item.padding.right, item.padding.bottom, item.padding.left] : 0,
    valign: 'top',
    breakLine: false,
    fit: 'shrink',
    paraSpaceAfterPt: 0,
    ...extra,
  };
}

function addText(slide, spec, item, text, extra = {}) {
  if (Array.isArray(text)) {
    slide.addText(text.join('\n'), {
      ...textOptions(spec, item, extra),
      bullet: { indent: 18 },
      breakLine: false,
    });
    return;
  }
  slide.addText(text, textOptions(spec, item, extra));
}

function addFixedItem(slide, spec, item, assetsRoot, shapeTypes) {
  if (item.type === 'text') {
    addText(slide, spec, item, item.text);
    return;
  }
  if (item.type === 'image') {
    slide.addImage({ path: path.join(assetsRoot, spec.assets[item.assetKey]), x: px(item.x), y: px(item.y), w: px(item.w), h: px(item.h) });
    return;
  }
  if (item.type === 'rect' || item.type === 'pill') {
    slide.addShape(shapeTypes.rect, {
      x: px(item.x),
      y: px(item.y),
      w: px(item.w),
      h: px(item.h),
      rectRadius: item.radius ? px(item.radius) : undefined,
      fill: { color: toHex(item.fill) },
      line: item.line && item.line.transparency !== 100 ? { color: toHex(item.line.color), width: item.line.width || 1 } : { color: toHex(item.fill), transparency: 100 },
    });
    return;
  }
  if (item.type === 'line') {
    slide.addShape(shapeTypes.line, {
      x: px(item.x),
      y: px(item.y),
      w: px(item.w),
      h: 0,
      line: { color: toHex(item.line.color), width: item.line.width || 1 },
    });
    return;
  }
  if (item.type === 'vgrid') {
    const step = item.w / item.count;
    for (let i = 0; i <= item.count; i += 1) {
      slide.addShape(shapeTypes.line, {
        x: px(item.startX + step * i),
        y: px(item.y),
        w: 0,
        h: px(item.h),
        line: { color: toHex(item.color), width: 1 },
      });
    }
  }
}

function masterObjectsForLayout(spec, layout, assetsRoot) {
  const objects = [];
  const isDynamicVisualLayout = layout.id === 'LAY-COVER-HERO' || layout.id === 'LAY-SECTION-DIVIDER';
  if (!isDynamicVisualLayout) {
    for (const item of layout.fixed) {
      if (item.type === 'text') {
        objects.push({ text: { text: item.text, options: textOptions(spec, item) } });
      } else if (item.type === 'image') {
        objects.push({ image: { path: path.join(assetsRoot, spec.assets[item.assetKey]), x: px(item.x), y: px(item.y), w: px(item.w), h: px(item.h) } });
      } else if (item.type === 'rect' || item.type === 'pill') {
        objects.push({ rect: { x: px(item.x), y: px(item.y), w: px(item.w), h: px(item.h), rectRadius: item.radius ? px(item.radius) : undefined, fill: { color: toHex(item.fill) }, line: item.line && item.line.transparency !== 100 ? { color: toHex(item.line.color), width: item.line.width || 1 } : { color: toHex(item.fill), transparency: 100 } } });
      } else if (item.type === 'line') {
        objects.push({ line: { x: px(item.x), y: px(item.y), w: px(item.w), h: 0, line: { color: toHex(item.line.color), width: item.line.width || 1 } } });
      } else if (item.type === 'vgrid') {
        const step = item.w / item.count;
        for (let i = 0; i <= item.count; i += 1) {
          objects.push({ line: { x: px(item.startX + step * i), y: px(item.y), w: 0, h: px(item.h), line: { color: toHex(item.color), width: 1 } } });
        }
      }
    }
  }
  for (const item of layout.placeholders) {
    const token = tokenFor(spec, item.style.fontToken);
    objects.push({
      placeholder: {
        text: '',
        options: {
          name: item.id,
          type: item.role === 'title' || item.role === 'sectionTitle' ? 'title' : 'body',
          x: px(item.x),
          y: px(item.y),
          w: px(item.w),
          h: px(item.h),
          fontFace: token.family,
          fontSize: token.size,
          bold: (item.style.weight || token.weight || 400) >= 600,
          color: toHex(item.style.color),
          align: alignValue(item.style.align),
          margin: item.padding ? [item.padding.top, item.padding.right, item.padding.bottom, item.padding.left] : 0,
          valign: 'top',
          fit: 'shrink',
        },
      },
    });
  }
  return objects;
}

function applySlideBackground(slide, spec, assetsRoot, validation) {
  if (validation.background.type === 'solid') {
    slide.background = { color: toHex(validation.background.color) };
    return;
  }
  slide.background = { path: path.join(assetsRoot, spec.assets[validation.background.assetKey]) };
}

function addDynamicFixedItems(slide, spec, validation, layout, assetsRoot, shapeTypes) {
  const isDynamicVisualLayout = layout.id === 'LAY-COVER-HERO' || layout.id === 'LAY-SECTION-DIVIDER';
  if (validation.background.overlay) {
    slide.addShape(shapeTypes.rect, {
      x: 0,
      y: 0,
      w: px(1920),
      h: px(1080),
      fill: { color: toHex(validation.background.overlay.color), transparency: Math.round((1 - validation.background.overlay.opacity) * 100) },
      line: { color: toHex(validation.background.overlay.color), transparency: 100 },
    });
  }
  if (isDynamicVisualLayout || layout.id === 'LAY-AGENDA-COVER') {
    for (const item of validation.fixed) addFixedItem(slide, spec, item, assetsRoot, shapeTypes);
  }
}

function addValidationPlaceholders(slide, spec, validation, layout) {
  for (const placeholder of layout.placeholders) {
    const value = validation.content[placeholder.id];
    if (value == null || value === '') continue;
    const options = { placeholder: placeholder.id };
    addText(slide, spec, placeholder, value, options);
  }
}

async function main() {
  const args = parseArgs(process.argv);
  const inputPath = path.resolve(args.input || '.artifacts/build/presentation-spec.json');
  const outputPath = path.resolve(args.out || '.artifacts/dist/aha-master-template-pilot-01-10.pptx');
  const spec = JSON.parse(await fs.readFile(inputPath, 'utf8'));
  const assetsRoot = path.join(path.dirname(inputPath), 'figma');
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE';
  pptx.author = 'Codex';
  pptx.company = 'OpenAI';
  pptx.subject = 'AHA pilot master template';
  pptx.title = 'AHA pilot master template 01-10';
  pptx.lang = 'en-GB';
  pptx.theme = {
    headFontFace: 'MW Sans',
    bodyFontFace: 'MW Sans',
    lang: 'en-GB',
  };

  for (const layout of spec.layouts) {
    pptx.defineSlideMaster({
      title: layout.id,
      background: layout.background.type === 'solid' ? { color: toHex(layout.background.color) } : { color: layout.theme === 'dark' ? '111111' : 'FFFFFF' },
      objects: masterObjectsForLayout(spec, layout, assetsRoot),
    });
  }

  const shapeTypes = pptx.ShapeType;
  for (const validation of spec.validationSlides) {
    const layout = spec.layouts.find((entry) => entry.id === validation.layoutId);
    const slide = pptx.addSlide(layout.id);
    applySlideBackground(slide, spec, assetsRoot, validation);
    addDynamicFixedItems(slide, spec, validation, layout, assetsRoot, shapeTypes);
    addValidationPlaceholders(slide, spec, validation, layout);
  }

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await pptx.writeFile({ fileName: outputPath });
  console.log(`deck written: ${path.relative(process.cwd(), outputPath)}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
