// 🎓 On your own: price.ts imports from the barrel that is currently loading it.
// The barrel runs `./price` before `./cart`, so CURRENCY does not exist yet when
// the line below runs.
import { CURRENCY } from './index';

export const priceLabel = `Total in ${CURRENCY}`;

// Compile as in ../../README.md ("Running a lesson") and read `priceLabel` through the barrel
// in node (CommonJS output) -- it prints "Total in undefined":
//   node -p "require('./dist/modules/03-reExportsAndBarrelFiles/cycle').priceLabel"
// As native ES modules it is worse: a ReferenceError, because the binding is not initialized.
// TypeScript reports neither.
//
// Fix: import the sibling that owns the value:
//   import { CURRENCY } from './cart';
// The `import/no-cycle` rule (eslint-plugin-import) finds these at lint time.
