// =============================================================================
// strictBindCallApply (part of `strict`)
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#strictBindCallApply

// Type-checks the arguments passed to `.call()`, `.apply()` and `.bind()`, and gives
// their result the function's real return type. Without the flag these three methods
// accept any arguments and return `any`.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

function describeOrder(orderId: string, quantity: number) {
  return `Order ${orderId}: ${quantity} items`;
}

// `.call` takes the value for `this` first (`null`: the function does not use it),
// then the function's own arguments:
console.log(describeOrder.call(null, 'A-17', 3)); // Order A-17: 3 items

// @ts-expect-error
describeOrder.call(null, 'A-17'); // Error: Expected 3 arguments, but got 2.

// @ts-expect-error
describeOrder.call(null, 'A-17', '3'); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.

// The result is typed as well:
const summary = describeOrder.call(null, 'A-17', 3);
// type: string (without the flag: any)

// ---------------------------------------------------------------------------
// .bind() is also checked
// ---------------------------------------------------------------------------

// `bind` fixes the first arguments and returns a function that waits for the rest:
const describeOrderA17 = describeOrder.bind(null, 'A-17');
// type: (quantity: number) => string

console.log(describeOrderA17(3)); // Order A-17: 3 items

// @ts-expect-error
describeOrderA17('3'); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.

console.log(summary);

// `this` for these three methods is the subject of 07-noImplicitThis.
