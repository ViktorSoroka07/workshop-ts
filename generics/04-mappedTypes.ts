export {};

// Imagine you have a Product type and want to create a version where all fields
// are optional, or readonly, or wrapped in Promise. You could rewrite the type
// by hand each time — or use a mapped type to transform it automatically.
// Syntax: { [K in Keys]: Type } — think of it as a for-loop over property keys.

// --- Basic syntax: iterating over keyof T ---

interface Product {
  id: number;
  title: string;
  price: number;
  inStock: boolean;
}

// Say you want to select just a few properties from Product.
// Built-in Pick<T, K> does that. Here's how it works internally —
// iterate over each key P in K and keep the original value type:
type CustomPick<T, K extends keyof T> = {
  [P in K]: T[P]; // for each key P in K, keep the original value type
};

type ProductPreview = CustomPick<Product, 'title' | 'price'>;
// { title: string; price: number }

// --- Iterating over a custom union ---

// You can also build a type from scratch — just provide any string union as keys.
// Useful when the shape doesn't come from an existing type:
type StatusFlags = {
  [S in 'loading' | 'error' | 'success']: boolean;
};
// { loading: boolean; error: boolean; success: boolean }

const flags: StatusFlags = { loading: false, error: false, success: true };

// --- Modifiers: readonly and ? ---

// You want to make sure nobody accidentally modifies a product after creation.
// Instead of manually adding `readonly` to each field, a mapped type does it for all:
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

// What if you receive a Partial type but need all fields to be required?
// The `-` prefix removes a modifier. `-?` strips optionality (like Required<T>):
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

// Mapped types can change the value type too, not just modifiers.
// Example: wrapping every field in a Promise for an async data loader:
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

// Sometimes you need to rename keys, not just transform values.
// `as` inside a mapped type lets you generate new key names.
// For example, prefixing keys or uppercasing them — see 06-templateLiteralTypes.ts
// for examples that combine `as` with template literal types like Capitalize.
//
// You can also use `as` with `never` to filter keys out — the key disappears.
// This uses conditional types (covered in 05-conditionalTypes.ts), so see that file
// for filtering examples like removing specific keys or methods from a type.
//
// Simple example — prefix all keys with "data_":
type Prefixed<T> = {
  [K in keyof T as `data_${string & K}`]: T[K];
};

type PrefixedProduct = Prefixed<Product>;
// { data_id: number; data_title: string; data_price: number; data_inStock: boolean }

// --- Practical: FormState<T> ---

// A common real-world need: every form field needs not just a value but also
// validation state (error message, whether the user touched it).
// A mapped type generates this wrapper for any form shape automatically:
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
