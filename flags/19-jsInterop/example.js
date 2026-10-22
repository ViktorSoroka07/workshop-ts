// allowJs puts this file in the project. checkJs is off and there is no `// @ts-check`
// pragma, so TypeScript reads its types but reports nothing in it.

export function add(first, second) {
  return first + second;
}

// Misspelled method: reported only when the file is checked.
export function bannerText() {
  return 'welcome'.toUpperCas();
}

// Nothing flags this call either:
const total = add('not a number', 5);
console.log(total);
