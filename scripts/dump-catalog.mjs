import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const dataPath = path.join(root, 'src', 'data.js');
const outPath = path.join(root, 'server', 'catalog.json');

const text = fs.readFileSync(dataPath, 'utf8');
const re = /\{\s*id:\s*(\d+),\s*name:\s*"([^"]*)",\s*price:\s*(\d+)/g;
const out = [];
let m;
while ((m = re.exec(text)) !== null) {
  out.push({ id: Number(m[1]), name: m[2], price: Number(m[3]) });
}
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('wrote', out.length, 'products to', outPath);
