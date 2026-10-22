// =============================================================================
// 3. Type Aliases and Interfaces
// =============================================================================

// Both give names to object shapes:
type UserType = {
  id: number;
  email: string;
  role?: 'admin' | 'editor' | 'viewer'; // optional property; `|` = "one of these" (08-unionTypes.ts)
};

interface UserInterface {
  id: number;
  email: string;
  role?: 'admin' | 'editor' | 'viewer';
}

// ✅ Best practice: name types and interfaces in PascalCase (`UserProfile`), with no `I` prefix
// (`IUserProfile`) -- most style guides, including the TypeScript team's own, drop it.
// (`UserType` / `UserInterface` carry a suffix here only so the two can be compared side by side.)

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

// Now `Window` has all its original properties PLUS `analytics`:
window.innerWidth; // OK -- original property, from the built-in DOM types
window.analytics?.track('page_view'); // OK -- our added property (optional, so `?.`)

// @ts-expect-error
window.tracking; // Error: Property 'tracking' does not exist on type 'Window & typeof globalThis'

// This is how libraries extend built-in types (e.g., Express adding `req.body`).

// ⚠️ Gotcha: merging also happens by ACCIDENT. Any interface with the same name in the
// same scope joins in -- these files share one scope, so a second `EditorSettings`
// anywhere silently adds its properties:
interface EditorSettings {
  theme: string;
}

interface EditorSettings {
  fontSize: number;
}

// @ts-expect-error
const editorSettings: EditorSettings = { theme: 'dark' }; // Error: Property 'fontSize' is missing ... but required in type 'EditorSettings'

// With `type`, a second declaration is an error -- reported on BOTH:
// @ts-expect-error
type AppSettings = { theme: string }; // Error: Duplicate identifier 'AppSettings'
// @ts-expect-error
type AppSettings = { fontSize: number }; // Error: Duplicate identifier 'AppSettings'

// ✅ Best practice: use merging on purpose, to add to types you don't own (`Window`, a library's
// types). For your own types, write one declaration -- or build on it with `extends` (below).

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

// Both can also describe a function -- shown in 04-functionTypes.ts.

// ✅ Best practice: use `interface` for public API shapes you want extensible,
// use `type` for everything else (unions, tuples, mapped types, utility compositions).
