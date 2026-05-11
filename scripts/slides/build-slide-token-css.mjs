import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const srcArg = process.argv[2] || 'reference/slides/tokens-v1.6.json';
const destArg = process.argv[3] || 'reference/slides/deck-v1.6-tokens.css';
const src = path.join(root, srcArg);
const dest = path.join(root, destArg);

const tokens = JSON.parse(fs.readFileSync(src, 'utf8'));
const vars = tokens.cssVariables || {};

const lines = [':root {'];
for (const [k, v] of Object.entries(vars)) {
  lines.push(`  --${k}: ${v};`);
}
lines.push('}');
lines.push('');

fs.writeFileSync(dest, `${lines.join('\n')}`, 'utf8');
console.log(`Wrote ${dest}`);
