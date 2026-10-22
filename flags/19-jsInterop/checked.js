// @ts-check
// The pragma above opts this file in to type-checking even though `checkJs` is off in
// tsconfig. JSDoc comments give TypeScript the types.

/**
 * @param {number} first
 * @param {number} second
 * @returns {number}
 */
export function multiply(first, second) {
  return first * second;
}

// @ts-expect-error
const result = multiply('not a number', 5); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
console.log(result);
