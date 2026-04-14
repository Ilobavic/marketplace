import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const appText = fs.readFileSync(path.join(root, 'src', 'App.jsx'), 'utf8');
const payoutText = fs.readFileSync(path.join(root, 'src', 'components', 'Payout.jsx'), 'utf8');
const returnText = fs.readFileSync(path.join(root, 'src', 'components', 'CheckoutReturn.jsx'), 'utf8');

assert.match(appText, /path="\/payout\/success"/, 'Missing success route in App router');
assert.match(appText, /path="\/payout\/cancel"/, 'Missing cancel route in App router');
assert.match(appText, /<PayoutSuccess onClearCart=\{clearCart\} \/>/, 'Success route must clear cart');
assert.match(payoutText, /\/api\/checkout\/create-session/, 'Checkout component not calling session API');
assert.match(returnText, /\/api\/checkout\/session-status/, 'Success page is not verifying Stripe session status');
assert.match(returnText, /onClearCart\?\.\(\)/, 'Success return page does not invoke cart clear callback');

console.log('frontend smoke checks passed');
