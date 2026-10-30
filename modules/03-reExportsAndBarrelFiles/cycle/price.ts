// 🎓 On your own: price.ts imports from the barrel that is currently loading it, so the
// value it asks for is not there yet. Harder because the compiler accepts it. When
// anything loads index.ts, in this order (picture: ../../diagrams/cycle-light.svg):
//   1. index.ts runs its first line, `export * from './price'`, so price.ts starts loading.
//   2. price.ts runs the import below and asks index.ts for CURRENCY. index.ts is only
//      part-way through: it has not reached `export * from './cart'`, so CURRENCY does
//      not exist and price.ts reads undefined.
//   3. price.ts finishes with "Total in undefined". Only now does index.ts load cart.ts,
//      where CURRENCY is defined -- too late.
import { CURRENCY } from './index';

export const priceLabel = `Total in ${CURRENCY}`;

// Compiled (as in ../../README.md, "Running a lesson") and read through the barrel in node
// (CommonJS output), `priceLabel` is "Total in undefined":
//   node -p "require('./dist/modules/03-reExportsAndBarrelFiles/cycle').priceLabel"
// As native ES modules it is worse: a ReferenceError, because the binding is not initialized.
// TypeScript reports neither.
//
// Fix: import the sibling that owns the value:
//   import { CURRENCY } from './cart';
// The `import/no-cycle` rule (eslint-plugin-import) finds these at lint time.
