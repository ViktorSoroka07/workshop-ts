export {};

// Mapped types create new types by iterating over keys with { [K in Keys]: Type }.
// Think of it as a for-loop at the type level.

// --- Basic syntax: iterating over keyof T ---

interface Product {
  id: number;
  title: string;
  price: number;
  inStock: boolean;
}

// Recreating Pick<T, K> from scratch to see how it works:
type CustomPick<T, K extends keyof T> = {
  [P in K]: T[P]; // for each key P in K, keep the original value type
};

type ProductPreview = CustomPick<Product, 'title' | 'price'>;
// { title: string; price: number }

// --- Iterating over a custom union ---

// Keys don't have to come from an existing type — any string union works:
type StatusFlags = {
  [S in 'loading' | 'error' | 'success']: boolean;
};
// { loading: boolean; error: boolean; success: boolean }

const flags: StatusFlags = { loading: false, error: false, success: true };

// --- Modifiers: readonly and ? ---

// Adding `readonly` to every property (recreates Readonly<T>):
type Frozen<T> = {
  readonly [K in keyof T]: T[K];
};

const frozenProduct: Frozen<Product> = { id: 1, title: 'Keyboard', price: 75, inStock: true };
// @ts-expect-error — all properties are readonly now
frozenProduct.price = 100;

// Adding `?` to every property (recreates Partial<T>):
type Optional<T> = {
  [K in keyof T]?: T[K];
};

const partial: Optional<Product> = { title: 'Mouse' }; // only title, rest omitted

// --- Removing modifiers with `-` ---

// `-?` removes optionality (like Required<T>):
type Strict<T> = {
  [K in keyof T]-?: T[K];
};

type Draft = {
  title?: string;
  body?: string;
};

type PublishedPost = Strict<Draft>;
// { title: string; body: string } — both are now required

// `-readonly` makes properties mutable again:
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type FrozenConfig = {
  readonly host: string;
  readonly port: number;
};

const config: Mutable<FrozenConfig> = { host: 'localhost', port: 3000 };
config.host = '0.0.0.0'; // OK — readonly was stripped

// --- Value transformation ---

// Wrap every field in a Promise:
type Async<T> = {
  [K in keyof T]: Promise<T[K]>;
};

interface UserProfile {
  name: string;
  avatarUrl: string;
}

type AsyncProfile = Async<UserProfile>;
// { name: Promise<string>; avatarUrl: Promise<string> }

const profile: AsyncProfile = {
  name: Promise.resolve('Alice'),
  avatarUrl: Promise.resolve('https://example.com/alice.png'),
};

// --- Key remapping with `as` ---

// Generate getter method types by capitalizing each key and prefixing with "get":
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type ProductGetters = Getters<Product>;
// { getId: () => number; getTitle: () => string; getPrice: () => number; getInStock: () => boolean }

// Filter out keys by remapping to `never`:
type WithoutMethods<T> = {
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

class Order {
  id = 1;
  total = 99.99;
  cancel() {} // method — will be filtered out
}

type OrderData = WithoutMethods<Order>;
// { id: number; total: number } — cancel is gone

// --- Practical: FormState<T> ---

// Wrap each field of a form model with validation metadata:
type FormState<T> = {
  [K in keyof T]: {
    value: T[K];
    error: string | null;
    touched: boolean;
  };
};

interface LoginForm {
  email: string;
  password: string;
}

const loginState: FormState<LoginForm> = {
  email: { value: '', error: null, touched: false },
  password: { value: '', error: 'Required', touched: true },
};

console.log(loginState.email.error); // null
console.log(loginState.password.error); // "Required"
