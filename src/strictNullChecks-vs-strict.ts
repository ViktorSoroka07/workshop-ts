let value: string | null = null;

function printLength(str: string) {
  console.log(str.length);
}

// error both in `strict` and `strictNullChecks` modes
// @ts-expect-error
printLength(value);

// ---------

// error in `strict` mode about untyped parameters but no error in `strictNullChecks`
// @ts-expect-error
function add(a, b) {
  return a + b;
}
