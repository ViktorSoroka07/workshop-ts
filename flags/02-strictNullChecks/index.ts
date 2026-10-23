// =============================================================================
// strictNullChecks (part of `strict`)
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#strictNullChecks

// Makes `null` and `undefined` types of their own. Without the flag they fit into
// every type, so `string | null` collapses to plain `string` and a missing value
// reaches code that assumed it was there.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

function readCookie(name: string): string | null {
  return name === 'theme' ? 'dark' : null;
}

function shout(text: string) {
  return text.toUpperCase();
}

const sessionToken = readCookie('session');
// type: string | null (without the flag: string)

// @ts-expect-error
shout(sessionToken); // Error: Argument of type 'string | null' is not assignable to parameter of type 'string'.

// A plain assignment is caught too:

// @ts-expect-error
const pageTitle: string = null; // Error: Type 'null' is not assignable to type 'string'.

// ---------------------------------------------------------------------------
// A library signature that now has to be handled
// ---------------------------------------------------------------------------

interface User {
  name: string;
  age: number;
}

const users: User[] = [
  { name: 'Oby', age: 12 },
  { name: 'Heera', age: 32 },
];

const found = users.find((user) => user.name === 'Oby');
// type: User | undefined (without the flag: User)

// ---------------------------------------------------------------------------
// How to handle a nullable value
// ---------------------------------------------------------------------------

// Optional chaining reads through the gap and gives `undefined` if there is one:
console.log(found?.age); // 12

// Narrowing (if, `===`, `typeof`) is taught in ../../types/10-narrowing.ts: after
// `if (found) { … }` the type inside is `User`.

// The assertions `as User` and `found!` (../../types/13-assertionsAndAsConst.ts) switch
// the check off for that line. The type says `User`; the value is still `undefined`:
const missing = users.find((user) => user.name === 'Nobody');

try {
  console.log(missing!.age);
} catch (error) {
  console.log(String(error)); // TypeError: Cannot read properties of undefined (reading 'age')
}

// ✅ Best practice: handle the missing case with `?.` or a check, and keep `!` for the
// spot where you can show the value is there.
