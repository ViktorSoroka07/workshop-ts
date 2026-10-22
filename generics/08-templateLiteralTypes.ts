// =============================================================================
// Template Literal Types
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html

// JavaScript builds strings with `Hello ${name}`. TypeScript does the same at the type level:
// it builds string literal types from other string types. That catches typos in event names,
// routes and ids at compile time.

export {};

// --- Building string types from parts ---

type Entity = 'user' | 'order' | 'product';

// A union inside `${}` produces every combination. Ids are an entity name, an underscore, a number:
type EntityId = `${Entity}_${number}`; // type: `user_${number}` | `order_${number}` | `product_${number}`

const userId: EntityId = 'user_123'; // OK
const orderId: EntityId = 'order_42'; // OK

// @ts-expect-error
const invoiceId: EntityId = 'invoice_1'; // Error: Type '"invoice_1"' is not assignable to type '`user_${number}` | `order_${number}` | `product_${number}`'.

// @ts-expect-error
const brokenId: EntityId = 'user_abc'; // Error: Type '"user_abc"' is not assignable to type '`user_${number}` | `order_${number}` | `product_${number}`'.

// Routes follow the same idea; adding an entity updates every route for free:
type ApiRoute = `/api/${Entity}s` | `/api/${Entity}s/${number}`;

const listRoute: ApiRoute = '/api/users'; // OK
const itemRoute: ApiRoute = '/api/orders/42'; // OK

// @ts-expect-error
const unknownRoute: ApiRoute = '/api/invoices'; // Error: Type '"/api/invoices"' is not assignable to type 'ApiRoute'.

// Two unions multiply. 4 directions times 3 sizes is 12 class names:
type Direction = 'top' | 'right' | 'bottom' | 'left';
type Size = 'sm' | 'md' | 'lg';
type SpacingClass = `${Direction}-${Size}`;

const spacing: SpacingClass = 'top-lg'; // OK

// @ts-expect-error
const centered: SpacingClass = 'center-md'; // Error: Type '"center-md"' is not assignable to type '"top-sm" | "top-md" | "top-lg" | "right-sm" | "right-md" | "right-lg" | "bottom-sm" | "bottom-md" | "bottom-lg" | "left-sm" | "left-md" | "left-lg"'.

// --- Built-in string utilities ---

// Four intrinsic types change the casing of string literal types. They exist only at compile time:
type Status = 'active' | 'inactive' | 'pending';

type ShoutedStatus = Uppercase<Status>; // type: "ACTIVE" | "INACTIVE" | "PENDING"
type CapitalizedStatus = Capitalize<Status>; // type: "Active" | "Inactive" | "Pending"
type LowercaseLevel = Lowercase<'OK' | 'ERROR'>; // type: "ok" | "error"
type UncapitalizedField = Uncapitalize<'Name' | 'Email'>; // type: "name" | "email"

// --- With mapped types: typed event handlers ---

// Combined with `as` in a mapped type (04-mappedTypes.ts), a template literal turns an
// event-to-payload map into an object of "on"-prefixed handlers, each receiving the right payload:
interface DomEvents {
  click: MouseEvent;
  keydown: KeyboardEvent;
  scroll: Event;
}

// `string & K` keeps only the string keys (`Capitalize` accepts only strings):
type EventHandlers<Events> = {
  [K in keyof Events as `on${Capitalize<string & K>}`]: (
    event: Events[K]
  ) => void;
};

type DomHandlers = EventHandlers<DomEvents>; // type: { onClick: (event: MouseEvent) => void; onKeydown: (event: KeyboardEvent) => void; onScroll: (event: Event) => void; }

const handlers: DomHandlers = {
  onClick: (event) => console.log(event.clientX), // event is MouseEvent
  onKeydown: (event) => console.log(event.key), // event is KeyboardEvent
  onScroll: (event) => console.log(event.type), // event is Event
};

const misspelled: DomHandlers = {
  onClick: () => {},
  // @ts-expect-error
  onKeyDown: () => {}, // Error: Object literal may only specify known properties, but 'onKeyDown' does not exist in type 'EventHandlers<DomEvents>'. Did you mean to write 'onKeydown'?
  onScroll: () => {},
};

// 🎓 On your own: harder because it uses `infer` inside a template literal and calls itself
// on the rest of the string.
// Extract the parameter names from a route pattern:
type RouteParams<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? Param | RouteParams<`/${Rest}`>
    : Path extends `${string}:${infer Param}`
      ? Param
      : never;

type PostRouteParams = RouteParams<'/users/:userId/posts/:postId'>; // type: "userId" | "postId"

function buildUrl<Path extends string>(
  path: Path,
  params: Record<RouteParams<Path>, string>
): string {
  return Object.entries<string>(params).reduce(
    (url, [name, value]) => url.replace(`:${name}`, value),
    path as string
  );
}

console.log(
  buildUrl('/users/:userId/posts/:postId', { userId: 'u1', postId: 'p9' })
); // /users/u1/posts/p9

// @ts-expect-error
buildUrl('/users/:userId/posts/:postId', { userId: 'u1' }); // Error: Argument of type '{ userId: string; }' is not assignable to parameter of type 'Record<"userId" | "postId", string>'.
