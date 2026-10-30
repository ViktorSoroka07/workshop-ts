// price.ts imports from the barrel that is currently loading it, so the value it asks for
// is not there yet, and the compiler accepts it. When anything loads index.ts, this is the
// order (picture: ../../diagrams/cycle-light.svg):
//   1. index.ts runs its first line, `export * from './price'`, so price.ts starts loading.
//   2. price.ts runs the import below and asks index.ts for CURRENCY. index.ts is only
//      part-way through: it has not reached `export * from './cart'`, so CURRENCY does
//      not exist and price.ts reads undefined.
//   3. price.ts finishes with "Total in undefined". Only now does index.ts load cart.ts,
//      where CURRENCY is defined -- too late.
import { CURRENCY } from './index';

export const priceLabel = `Total in ${CURRENCY}`;

// readPrice.ts prints the result, "Total in undefined", and TypeScript reports no error.
//
// Fix: import the sibling that owns the value:
//   import { CURRENCY } from './cart';
// The `import/no-cycle` rule (eslint-plugin-import) finds these at lint time.
