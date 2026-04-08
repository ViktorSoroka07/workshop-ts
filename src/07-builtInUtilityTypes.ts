export {};

// TypeScript ships utility types that cover the most common type transformations.
// They're all implemented with mapped types and conditional types under the hood.

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// --- Object modifiers ---

// Partial<T> — makes all properties optional
function updateUser(user: User, updates: Partial<User>): User {
  return { ...user, ...updates };
}

const user: User = { id: 1, name: 'Alice', email: 'alice@co.com', age: 30 };
const updated = updateUser(user, { name: 'Bob' }); // only name, rest stays

// Required<T> — makes all properties required (opposite of Partial)
interface Settings {
  theme?: string;
  language?: string;
  notifications?: boolean;
}

function applySettings(settings: Required<Settings>) {
  console.log(settings.theme); // guaranteed to exist
}

applySettings({ theme: 'dark', language: 'en', notifications: true });

// Readonly<T> — prevents property reassignment
const frozenUser: Readonly<User> = { id: 1, name: 'Alice', email: 'a@b.com', age: 30 };
// @ts-expect-error — cannot reassign a readonly property
frozenUser.name = 'Bob';

// --- Property selection ---

// Pick<T, K> — keep only the listed keys
type UserPreview = Pick<User, 'id' | 'name'>;

function renderAvatar(user: UserPreview) {
  console.log(`User #${user.id}: ${user.name}`);
}

// Omit<T, K> — remove the listed keys (inverse of Pick)
type CreateUserDto = Omit<User, 'id'>; // id is auto-generated

function createUser(dto: CreateUserDto): User {
  return { id: Date.now(), ...dto };
}

// --- Record<K, V> — build an object type from keys and a value type ---

type Role = 'admin' | 'editor' | 'viewer';

const permissions: Record<Role, string[]> = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read'],
};

// Also useful for dictionaries:
const errorMessages: Record<number, string> = {
  404: 'Not Found',
  500: 'Server Error',
};

// --- Union utilities ---

// Exclude<T, U> — remove members from a union
type AllRoles = 'admin' | 'editor' | 'viewer' | 'guest';
type AuthenticatedRoles = Exclude<AllRoles, 'guest'>; // "admin" | "editor" | "viewer"

// Extract<T, U> — keep only matching members
type TextInputType = Extract<'text' | 'number' | 'email' | 'checkbox', 'text' | 'email'>;
// "text" | "email"

// NonNullable<T> — strips null and undefined
type MaybeUser = User | null | undefined;
type DefiniteUser = NonNullable<MaybeUser>; // User

function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value != null;
}
const items = ['a', null, 'b', undefined];
const cleaned = items.filter(isNonNullable); // string[]

// --- Function utilities ---

function createOrder(product: string, quantity: number, price: number) {
  return { product, quantity, total: quantity * price };
}

// Parameters<T> — function parameter types as a tuple
type OrderParams = Parameters<typeof createOrder>;
// [product: string, quantity: number, price: number]

// ReturnType<T> — function return type
type OrderResult = ReturnType<typeof createOrder>;
// { product: string; quantity: number; total: number }

// ConstructorParameters<T> — constructor parameter types
class Product {
  constructor(
    public name: string,
    public price: number
  ) {}
}

type ProductArgs = ConstructorParameters<typeof Product>; // [name: string, price: number]

// InstanceType<T> — the type you get from `new`
type ProductInstance = InstanceType<typeof Product>; // Product

function createInstance<T extends new (...args: any[]) => any>(
  ctor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new ctor(...args);
}

const product = createInstance(Product, 'Keyboard', 75); // hover: Product

// --- Async ---

// Awaited<T> — unwraps Promise (even nested) to get the resolved type
async function fetchOrders(): Promise<{ id: number; total: number }[]> {
  return [{ id: 1, total: 99 }];
}

type Orders = Awaited<ReturnType<typeof fetchOrders>>;
// { id: number; total: number }[]

type Nested = Awaited<Promise<Promise<string>>>; // string — recursively unwrapped

// --- Practical combinations ---

// Partial update DTO — only some fields, and only the editable ones:
type UserUpdateDto = Partial<Pick<User, 'name' | 'email' | 'age'>>;
// { name?: string; email?: string; age?: number }

// Immutable view of a subset:
type UserPublicView = Readonly<Omit<User, 'email'>>;
// { readonly id: number; readonly name: string; readonly age: number }
