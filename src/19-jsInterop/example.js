// allowJs included this file in the project.
// checkJs is off and there's no `// @ts-check` pragma here — TS does not type-check.

export function add(a, b) {
  return a + b;
}

// TS doesn't flag this — the file isn't being checked.
const result = add('not a number', 5);
console.log(result);
