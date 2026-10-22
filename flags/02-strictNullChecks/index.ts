// =============================================================================
// strictNullChecks
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#strictNullChecks

// Makes `null` and `undefined` their own distinct types.
// Without this flag, they silently fit into any type — leading to runtime crashes.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

let value: string | null = null;

function printLength(str: string) {
  console.log(str.length);
}

// @ts-expect-error
printLength(value); // ❌ Argument of type 'string | null' is not assignable to 'string'

// ---------------------------------------------------------------------------
// .find() returns T | undefined
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
// type: User | undefined — TS forces you to handle the missing case

// ---------------------------------------------------------------------------
// How to handle nullable values
// ---------------------------------------------------------------------------

// 1. Optional chaining — safe access, returns undefined if null:
found?.age;

// 2. Control flow narrowing — TS narrows the type after the check:
if (found) {
  console.log(found.age); // type: User (not User | undefined)
}

// 3. Type assertion with `as` — tells TS "trust me, it's not null":
console.log((found as User).age); // unsafe if found is actually undefined

// 4. Non-null assertion `!` — same idea, shorter syntax:
console.log(found!.age); // unsafe — use only when you're certain

// Prefer options 1 and 2 — they're safe. Options 3 and 4 bypass the check
// and can crash at runtime, just like code without strictNullChecks.
