// =============================================================================
// One Namespace Across Several Files (4/4): `/// <reference path>` and `outFile`
// =============================================================================

// `/// <reference path="..." />` is how namespace files declare dependencies:
// there are no imports, so the file list is the only thing that says what runs first.
//
// In this folder the directives are redundant for type checking, because tsconfig's
// `"include": ["."]` already picks up every file. They become essential with `outFile`,
// which concatenates the files into ONE script (dist/bundle.js) in dependency order.
//
// 🧪 Try it: run `npm run build:outfile` (it uses tsconfig.outfile.json), then run
// `node namespaces/dist/bundle.js`. Remove the `/// <reference>` lines below and build
// again: the build fails with "Cannot find namespace 'Validation'".
/// <reference path="02-validationInterface.ts" />
/// <reference path="03-lettersOnlyValidator.ts" />
/// <reference path="04-zipCodeValidator.ts" />

const samples = ['Hello', '98052', '101'];

const validators: { [label: string]: Validation.StringValidator } = {};
validators['ZIP code'] = new Validation.ZipCodeValidator();
validators['Letters only'] = new Validation.LettersOnlyValidator();

for (const sample of samples) {
  for (const label in validators) {
    const verdict = validators[label].isAcceptable(sample)
      ? 'matches'
      : 'does not match';

    console.log(`"${sample}" ${verdict} ${label}`);
  }
}
// "Hello" does not match ZIP code
// "Hello" matches Letters only
// "98052" matches ZIP code
// "98052" does not match Letters only
// "101" does not match ZIP code
// "101" does not match Letters only

// Merging gave the three files one `Validation`, but `verify` was never exported:
// @ts-expect-error
Validation.verify; // Error: Property 'verify' does not exist on type 'typeof Validation'.

// ⚠️ Gotcha: `outFile` only works with `module` set to none, amd or system, so a project
// that uses it cannot also use ES modules -- one more reason modules won
// (../modules/01-namedExports).
