export {};

// Template literal types combine string literals at the type level,
// similar to JS template strings but for types.

// --- Event names from actions ---

type Action = 'click' | 'focus' | 'blur';
type EventName = `on${Capitalize<Action>}`;
// "onClick" | "onFocus" | "onBlur"

const handler: Record<EventName, () => void> = {
  onClick: () => console.log('clicked'),
  onFocus: () => console.log('focused'),
  onBlur: () => console.log('blurred'),
};

// --- API route patterns ---

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiRoute = `/${Lowercase<HttpMethod>}/${string}`;

const route1: ApiRoute = '/get/users'; // OK
const route2: ApiRoute = '/post/orders'; // OK
// @ts-expect-error — 'patch' is not a valid method
const route3: ApiRoute = '/patch/users';

// --- Built-in string utilities ---

type Status = 'active' | 'inactive' | 'pending';

type Upper = Uppercase<Status>; // "ACTIVE" | "INACTIVE" | "PENDING"
type Lower = Lowercase<'OK' | 'ERROR'>; // "ok" | "error"
type Cap = Capitalize<Status>; // "Active" | "Inactive" | "Pending"
type Uncap = Uncapitalize<'Name' | 'Email'>; // "name" | "email"

// --- Combining with mapped types: typed event handler map ---

interface DomEvents {
  click: MouseEvent;
  keydown: KeyboardEvent;
  scroll: Event;
}

// Generate an object type like { onClick: (e: MouseEvent) => void; ... }
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

type Size = 'sm' | 'md' | 'lg';
type Direction = 'top' | 'right' | 'bottom' | 'left';

type SpacingClass = `${Direction}-${Size}`;
// "top-sm" | "top-md" | "top-lg" | "right-sm" | ... (12 combinations)

const spacing: SpacingClass = 'top-lg';
// @ts-expect-error — 'center' is not a valid direction
const invalid: SpacingClass = 'center-md';
