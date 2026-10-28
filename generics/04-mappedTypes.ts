// =============================================================================
// Mapped Types
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/mapped-types.html

// Say you have a Product type and need a version where every field is optional, or readonly,
// or wrapped with a form field's state. Rewriting the type by hand means it drifts the moment
// Product changes. A mapped type derives it instead.
// Syntax: { [K in Keys]: Type } -- a for-loop over property keys.

export {};

interface Product {
  id: number;
  title: string;
  price: number;
  inStock: boolean;
}

// --- Looping over a union of keys ---

// Any string union can be the keys, so a shape can be built from nothing:
type LoadingFlags = {
  [State in 'loading' | 'error' | 'success']: boolean;
};

const flags: LoadingFlags = { loading: false, error: false, success: true };

// @ts-expect-error
const incompleteFlags: LoadingFlags = { loading: false, error: false }; // Error: Property 'success' is missing in type '{ loading: false; error: false; }' but required in type 'LoadingFlags'.

// --- Looping over keyof T ---

// `keyof T` (../types/14-typeofKeyofIndexedAccess.ts) loops over the keys of an existing type.
// `T[K]` is the type of each property. Copying every property unchanged:
type Copy<T> = {
  [K in keyof T]: T[K];
};

type ProductCopy = Copy<Product>; // type: { id: number; title: string; price: number; inStock: boolean; }

// Looping over only some keys, constrained to be real keys of T, is how Pick is written
// (the built-in is in 05-objectUtilityTypes.ts):
type ProductSummary<Keys extends keyof Product> = {
  [K in Keys]: Product[K];
};

type ProductPreview = ProductSummary<'title' | 'price'>; // type: { title: string; price: number; }

// --- Modifiers: readonly and ? ---

// Adding `readonly` to every field by hand is noise. A mapped type does it for any T:
type Frozen<T> = {
  readonly [K in keyof T]: T[K];
};

const frozenProduct: Frozen<Product> = {
  id: 1,
  title: 'Keyboard',
  price: 75,
  inStock: true,
};

// @ts-expect-error
frozenProduct.price = 100; // Error: Cannot assign to 'price' because it is a read-only property.

// Adding `?` makes every property optional:
type Optional<T> = {
  [K in keyof T]?: T[K];
};

const priceUpdate: Optional<Product> = { price: 80 }; // OK -- the rest is omitted

// --- Removing modifiers with `-` ---

// A `-` in front of a modifier strips it. `-readonly` makes every property writable again
// (`-?` does the same for `?`, which is how Required is written, in 05-objectUtilityTypes.ts):
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type FrozenConfig = {
  readonly host: string;
  readonly port: number;
};

const config: Mutable<FrozenConfig> = { host: 'localhost', port: 3000 };

config.host = '0.0.0.0'; // OK -- readonly was stripped

// --- Transforming the value type ---

// The right-hand side can be anything built from `T[K]`. Every form field needs a value
// plus its validation state; the mapped type generates that wrapper for any form shape:
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
console.log(loginState.password.error); // Required

// Another form, another shape -- the wrapper follows it, and each `value` keeps its field's type:
interface ProductForm {
  title: string;
  price: number;
}

const productState: FormState<ProductForm> = {
  title: { value: 'Keyboard', error: null, touched: true },
  price: { value: 0, error: 'Must be positive', touched: true },
};

// @ts-expect-error
productState.price.value = 'free'; // Error: Type 'string' is not assignable to type 'number'.

// --- Renaming keys with `as` ---

// Sometimes a type needs a companion with a differently named member per field: one change
// callback for each field of a product (`titleChanged`, `priceChanged`). Written by hand, the
// list drifts when Product gains a field. `as` after the loop variable computes a new name for
// each key, so the names follow Product.
// `${...}` builds a string from parts -- template literal types are covered in
// 08-templateLiteralTypes.ts. `string & K` keeps only the string keys, because a template
// literal cannot contain a symbol:
type ChangeCallbacks<T> = {
  [K in keyof T as `${string & K}Changed`]: (value: T[K]) => void;
};

type ProductCallbacks = ChangeCallbacks<Product>; // type: { idChanged: (value: number) => void; titleChanged: (value: string) => void; priceChanged: (value: number) => void; inStockChanged: (value: boolean) => void; }

// Remapping a key to `never` drops it; filtering keys that way is shown in 06-conditionalTypes.ts.

// 🎓 On your own: harder because a mapped type over an array or tuple maps its elements, not
// its keys, and the result is still an array.
// A mapped type that loops over `keyof T` (a "homomorphic" mapped type) treats array types specially:
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableScores = Nullable<number[]>; // type: (number | null)[]
type NullableCoordinates = Nullable<[number, number]>; // type: [number | null, number | null]
