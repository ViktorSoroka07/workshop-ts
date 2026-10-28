// =============================================================================
// Built-in Utility Types for Objects
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/utility-types.html

// TypeScript ships the mapped types people write most. You already saw some of them in
// 04-mappedTypes.ts: `Optional` is Partial and `Frozen` is Readonly; Required is the `-?` form.
// Knowing they are just mapped types tells you what they do to edge cases.

export {};

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// --- Partial, Required, Readonly: change every property's modifier ---

// Partial<T> makes all properties optional -- the shape of an update that sends only changed fields:
function updateUser(user: User, updates: Partial<User>): User {
  return { ...user, ...updates };
}

const alice: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  age: 30,
};

const renamed = updateUser(alice, { name: 'Alicia' }); // OK -- the rest stays

console.log(renamed.name, renamed.email); // Alicia alice@example.com

// @ts-expect-error
updateUser(alice, { nam: 'Alicia' }); // Error: Object literal may only specify known properties, but 'nam' does not exist in type 'Partial<User>'. Did you mean to write 'name'?

// Required<T> makes all properties required -- for a config that is complete before use:
interface Settings {
  theme?: string;
  language?: string;
}

function applySettings(settings: Required<Settings>) {
  return `${settings.theme.toUpperCase()} / ${settings.language}`; // no `undefined` check needed
}

// @ts-expect-error
applySettings({ theme: 'dark' }); // Error: Argument of type '{ theme: string; }' is not assignable to parameter of type 'Required<Settings>'.

// Readonly<T> blocks reassignment -- for state that must not change after creation:
const frozenAlice: Readonly<User> = { ...alice };

// @ts-expect-error
frozenAlice.name = 'Bob'; // Error: Cannot assign to 'name' because it is a read-only property.

// ⚠️ Gotcha: Readonly is shallow -- it protects the property, not what the property holds:
const frozenProfile: Readonly<{ name: string; tags: string[] }> = {
  name: 'Alice',
  tags: ['admin'],
};

frozenProfile.tags.push('editor'); // OK -- the array itself is still mutable

// --- Pick and Omit: choose properties ---

// Pick<T, Keys> keeps the listed keys -- for a component that needs a few fields of a larger type:
type UserPreview = Pick<User, 'id' | 'name'>; // type: { name: string; id: number; }

function renderAvatar(user: UserPreview) {
  console.log(`User #${user.id}: ${user.name}`);
}

renderAvatar(alice); // User #1: Alice -- a full User has the fields Pick asks for

// Omit<T, Keys> removes them -- for a DTO whose `id` the server generates:
type CreateUserDto = Omit<User, 'id'>; // type: { name: string; email: string; age: number; }

function createUser(dto: CreateUserDto): User {
  return { id: Date.now(), ...dto };
}

// ⚠️ Gotcha: Omit does not check that the key exists (Pick does), so a typo removes nothing:
type TypoOmit = Omit<User, 'idd'>; // type: { name: string; id: number; email: string; age: number; }

// @ts-expect-error
type TypoPick = Pick<User, 'idd'>; // Error: Type '"idd"' does not satisfy the constraint 'keyof User'.

// --- Record: a type from keys and one value type ---

// Record<Keys, Value> maps every key in a union to the same value type. Adding a role
// to the union makes TypeScript demand its permissions here:
type Role = 'admin' | 'editor' | 'viewer';
type Permission = 'read' | 'write' | 'delete';

const permissions: Record<Role, Permission[]> = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read'],
};

// @ts-expect-error
const missingRoles: Record<Role, Permission[]> = { admin: ['read'] }; // Error: Type '{ admin: "read"[]; }' is missing the following properties from type 'Record<Role, Permission[]>': editor, viewer

// With `string` or `number` as the keys, it is a dictionary (the index signatures of
// ../types/05-indexSignatures.ts):
const errorMessages: Record<number, string> = {
  404: 'Not Found',
  500: 'Server Error',
};

// --- Composing them ---

// Each utility returns a type, so they nest. An update DTO: only some fields, all optional:
type UserUpdateDto = Partial<Pick<User, 'name' | 'email' | 'age'>>; // type: { name?: string | undefined; email?: string | undefined; age?: number | undefined; }

// An immutable public view without the email:
type UserPublicView = Readonly<Omit<User, 'email'>>; // type: { readonly name: string; readonly id: number; readonly age: number; }
