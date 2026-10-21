// =============================================================================
// 3. Type Aliases and Interfaces
// =============================================================================

// Both give names to object shapes:
type UserType = {
  id: number;
  email: string;
  role?: 'admin' | 'editor' | 'viewer'; // optional property
};

interface UserInterface {
  id: number;
  email: string;
  role?: 'admin' | 'editor' | 'viewer';
}

// For object shapes, they are interchangeable. Where they diverge:

// --- What only `type` can do (interface CANNOT): ---

// 1. Alias primitives, unions, tuples:
type ID = string | number;
type HostPort = [string, number];

// 2. Mapped types, conditional types, template literal types, generic utility types (covered in the generics branch)

// You simply can't express any of the above with `interface`.

// --- What only `interface` can do (type CANNOT): ---

// 1. Declaration merging -- multiple declarations combine into one:
interface Window {
  analytics?: { track: (event: string) => void };
}
// Now `Window` has all its original properties PLUS `analytics`.
// This is how libraries extend built-in types (e.g., Express adding `req.body`).
// With `type`, a duplicate declaration is a compile error.

// --- Both can do: extending/composing ---

// `interface` uses `extends`:
interface TimestampedUser extends UserType {
  createdAt: Date;
}

const timestampedUser: TimestampedUser = {
  id: 1,
  email: 'alice@example.com',
  createdAt: new Date(),
};

// `type` uses `&` (intersection):
type TimestampedUserType = UserType & {
  createdAt: Date;
};

const timestampedUserType: TimestampedUserType = {
  id: 2,
  email: 'bob@example.com',
  createdAt: new Date(),
};

// Practical advice: use `interface` for public API shapes you want extensible,
// use `type` for everything else (unions, tuples, mapped types, utility compositions).
