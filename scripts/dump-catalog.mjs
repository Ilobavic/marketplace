import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outPath = path.join(root, 'server', 'catalog.json');

const dataModule = await import(pathToFileURL(path.join(root, 'src', 'data.js')).href);
const products = dataModule.products;
if (!Array.isArray(products)) {
  throw new Error('Expected `products` array export from src/data.js');
}

const out = products.map((product) => {
  if (
    typeof product?.id !== 'number' ||
    typeof product?.name !== 'string' ||
    typeof product?.price !== 'number'
  ) {
    throw new Error(`Invalid product shape for id=${product?.id ?? 'unknown'}`);
  }
  return { id: product.id, name: product.name, price: product.price };
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('wrote', out.length, 'products to', outPath);
