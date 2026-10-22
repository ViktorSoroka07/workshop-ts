// .d.ts files are "declaration files" — they contain only types, no runtime code.
// TS uses them to describe the shape of JS libraries or to add global type overrides.
// This one imports ts-reset, which patches built-in types like Array.filter(Boolean).
import '@total-typescript/ts-reset';
