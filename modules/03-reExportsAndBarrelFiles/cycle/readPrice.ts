// Reads `priceLabel` through the barrel. price.ts imports the barrel that is loading it,
// and the compiler stays silent. Compiled and run in node (CommonJS output), this prints:
//   Total in undefined
// As native ES modules it is worse: a ReferenceError, because the binding is not
// initialized.
import { priceLabel } from './index';

console.log(priceLabel);
