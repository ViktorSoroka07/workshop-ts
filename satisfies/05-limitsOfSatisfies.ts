// =============================================================================
// The Limits of `satisfies`
// =============================================================================

import type { AppConfig } from './AppConfig';

// ⚠️ Gotcha: the extra-key check applies only to an object literal written right there.
// A value that already lives in a variable is checked for what it has, not for what
// it has too much of:
const draftConfig = {
  apiUrl: { host: '/api', port: 8080 },
  retryCount: 3,
  debugMode: true,
};

const fromVariable = draftConfig satisfies AppConfig; // OK -- `debugMode` goes unnoticed

// ⚠️ Gotcha: `any` fits every type, so a parsed value gets no real check:
const parsedConfig = JSON.parse('{"retryCount": "three"}') satisfies AppConfig; // OK -- type: any

// `satisfies` is erased from the JavaScript; it never validates data at runtime.
// For data from outside the program, narrow it or validate it instead
// (../types/11-narrowing.ts).

// 🎓 On your own: harder because the target type reaches into the value and types parts
// of it you did not annotate. A function written inside a `satisfies` expression receives
// its parameter types from the target:
type Handlers = Record<string, (event: MouseEvent) => void>;

const handlers = {
  onClick: (event) => console.log(event.clientX), // `event` is a MouseEvent
  onHover: (event) => console.log(event.clientY),
} satisfies Handlers;

// The result keeps the exact keys, so a typo in a lookup is caught:
// @ts-expect-error
handlers.onClck; // Error: Property 'onClck' does not exist on type '{ onClick: (event: MouseEvent) => void; onHover: (event: MouseEvent) => void; }'. Did you mean 'onClick'?

// Without `satisfies` the same functions have an implicit-`any` parameter:
const untypedHandlers = {
  // @ts-expect-error
  onClick: (event) => console.log(event.clientX), // Error: Parameter 'event' implicitly has an 'any' type.
};
