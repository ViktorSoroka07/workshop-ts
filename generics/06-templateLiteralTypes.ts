export {};

// In JS, template strings let you build strings like `Hello ${name}`.
// TS has the same idea at the type level — build string literal types
// from other string types. This catches typos in event names, routes, etc.

// --- Building string types from parts ---

// Instead of manually listing every valid string, derive them from parts.
// TS produces all combinations automatically — add one part, get new types for free.

type Entity = 'user' | 'order' | 'product';

// Typed IDs — entity name + underscore + number:
type EntityId = `${Entity}_${number}`;

const userId: EntityId = 'user_123'; // OK
const orderId: EntityId = 'order_42'; // OK
// @ts-expect-error — 'invoice' is not a valid entity
const invoiceId: EntityId = 'invoice_1';

// Typed API routes — catches invalid resource names at compile time:
type ApiRoute = `/api/${Entity}s` | `/api/${Entity}s/${number}`;

const route1: ApiRoute = '/api/users'; // OK — list
const route2: ApiRoute = '/api/orders/42'; // OK — single item
// @ts-expect-error — 'invoices' doesn't match the pattern
const route3: ApiRoute = '/api/invoices';

// --- Built-in string utilities ---

// TS has four intrinsic types for transforming string literal casing.
// They work at the type level — no runtime cost, just compile-time checks:

type Status = 'active' | 'inactive' | 'pending';

type Upper = Uppercase<Status>; // "ACTIVE" | "INACTIVE" | "PENDING"
type Lower = Lowercase<'OK' | 'ERROR'>; // "ok" | "error"
type Cap = Capitalize<Status>; // "Active" | "Inactive" | "Pending"
type Uncap = Uncapitalize<'Name' | 'Email'>; // "name" | "email"

// --- Combining with mapped types: typed event handler map ---

// The real power shows when you combine template literals with mapped types.
// Given a map of event → payload, generate a handler object with "on"-prefixed keys
// where each handler receives the correct event type:

interface DomEvents {
  click: MouseEvent;
  keydown: KeyboardEvent;
  scroll: Event;
}

// Generate an object type like { onClick: (e: MouseEvent) => void; ... }
// `string & K` is needed because keyof can include number/symbol keys,
// but Capitalize only works on strings — the intersection filters them out.
type EventHandlerMap<Events> = {
  [K in keyof Events as `on${Capitalize<string & K>}`]: (event: Events[K]) => void;
};

type DomHandlers = EventHandlerMap<DomEvents>;
// { onClick: (event: MouseEvent) => void; onKeydown: (event: KeyboardEvent) => void; onScroll: (event: Event) => void }

const handlers: DomHandlers = {
  onClick: (e) => console.log(e.clientX), // e is MouseEvent
  onKeydown: (e) => console.log(e.key), // e is KeyboardEvent
  onScroll: (e) => console.log(e.type), // e is Event
};

// --- CSS property builder ---

// Template literals also produce all combinations from two unions —
// useful for generating CSS class names, grid positions, etc.:

type Size = 'sm' | 'md' | 'lg';
type Direction = 'top' | 'right' | 'bottom' | 'left';

type SpacingClass = `${Direction}-${Size}`;
// "top-sm" | "top-md" | "top-lg" | "right-sm" | ... (12 combinations)

const spacing: SpacingClass = 'top-lg';
// @ts-expect-error — 'center' is not a valid direction
const invalid: SpacingClass = 'center-md';
