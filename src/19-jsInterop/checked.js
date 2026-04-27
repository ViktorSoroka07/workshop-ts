// @ts-check
// This file opts in to type-checking via the `// @ts-check` pragma above —
// even though `checkJs` is off in tsconfig. JSDoc gives TS the type info.

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export function multiply(a, b) {
  return a * b;
}

// @ts-expect-error
const result = multiply('not a number', 5); // ❌ Argument of type 'string' is not assignable to 'number'.
console.log(result);
