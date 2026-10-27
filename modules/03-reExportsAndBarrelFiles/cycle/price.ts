// 🎓 On your own: price.ts imports from the barrel that is currently loading it.
// The barrel runs `./price` before `./cart`, so CURRENCY does not exist yet when
// the line below runs.
import { CURRENCY } from './index';

export const priceLabel = `Total in ${CURRENCY}`;

// Run the compiled barrel in node (CommonJS output, ../../README.md "Running a lesson"):
// `priceLabel` is "Total in undefined".
// As native ES modules it is worse: a ReferenceError, because the binding is not initialized.
// TypeScript reports neither.
//
// Fix: import the sibling that owns the value:
//   import { CURRENCY } from './cart';
// The `import/no-cycle` rule (eslint-plugin-import) finds these at lint time.
