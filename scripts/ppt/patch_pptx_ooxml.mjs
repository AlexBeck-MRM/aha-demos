import fs from 'node:fs/promises';
import path from 'node:path';
import JSZip from 'jszip';

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

function uniqueMatches(source, regex) {
  return [...source.matchAll(regex)].map((match) => match[1]);
}

async function main() {
  const args = parseArgs(process.argv);
  const filePath = path.resolve(args.file);
  const zip = await JSZip.loadAsync(await fs.readFile(filePath));

  const usedLayouts = new Set();
  for (const entry of Object.keys(zip.files).filter((name) => /^ppt\/slides\/_rels\/slide\d+\.xml\.rels$/.test(name))) {
    const xml = await zip.file(entry).async('string');
    for (const target of uniqueMatches(xml, /Target="\.\.\/slideLayouts\/(slideLayout\d+\.xml)"/g)) usedLayouts.add(target);
  }

  const masterRelsPath = 'ppt/slideMasters/_rels/slideMaster1.xml.rels';
  const masterXmlPath = 'ppt/slideMasters/slideMaster1.xml';
  const contentTypesPath = '[Content_Types].xml';
  let masterRels = await zip.file(masterRelsPath).async('string');
  let masterXml = await zip.file(masterXmlPath).async('string');
  let contentTypes = await zip.file(contentTypesPath).async('string');

  const layoutTargets = uniqueMatches(masterRels, /Target="\.\.\/slideLayouts\/(slideLayout\d+\.xml)"/g);
  const removedRelIds = [];
  for (const target of layoutTargets) {
    if (usedLayouts.has(target)) continue;
    const relMatch = masterRels.match(new RegExp(`<Relationship Id="([^"]+)"[^>]+Target="\.\.\/slideLayouts\/${target}"\/>`));
    if (relMatch) removedRelIds.push(relMatch[1]);
    masterRels = masterRels.replace(new RegExp(`<Relationship Id="[^"]+"[^>]+Target="\.\.\/slideLayouts\/${target}"\/>`), '');
    masterXml = masterXml.replace(new RegExp(`<p:sldLayoutId[^>]+r:id="${relMatch ? relMatch[1] : 'UNUSED'}"\/>`, 'g'), '');
    contentTypes = contentTypes.replace(new RegExp(`<Override PartName="\/ppt\/slideLayouts\/${target}" ContentType="application\/vnd\.openxmlformats-officedocument\.presentationml\.slideLayout\+xml"\/>`, 'g'), '');
    zip.remove(`ppt/slideLayouts/${target}`);
    zip.remove(`ppt/slideLayouts/_rels/${target}.rels`);
  }

  zip.file(masterRelsPath, masterRels);
  zip.file(masterXmlPath, masterXml);
  zip.file(contentTypesPath, contentTypes);

  const buffer = await zip.generateAsync({ type: 'nodebuffer' });
  await fs.writeFile(filePath, buffer);
  console.log(`patched ${path.relative(process.cwd(), filePath)}; removed ${removedRelIds.length} unused slide layout(s)`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
