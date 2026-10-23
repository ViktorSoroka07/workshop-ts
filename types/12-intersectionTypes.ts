// =============================================================================
// 12. Intersection Types
// =============================================================================

// Use an intersection to combine small shapes (timestamps, soft-delete) into a bigger one.
// Unions mean "one OR the other"; intersections mean "both at the same time":
//
//   A | B   a value fits A, or B, or both    -- more values are allowed
//   A & B   a value fits A and B at once     -- fewer values are allowed

type Timestamped = { createdAt: Date; updatedAt: Date };
type SoftDeletable = { deletedAt: Date | null };

type User = UserType & Timestamped & SoftDeletable; // `UserType` comes from 04-typeAliasesAndInterfaces.ts

// Must satisfy ALL combined shapes:
const user: User = {
  id: 1,
  email: 'alice@example.com',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

// A value must fit every part, so a missing part is an error:
// @ts-expect-error
const half: User = { id: 1, email: 'alice@example.com' }; // Error: Type '{ id: number; email: string; }' is not assignable to type 'User'. (`createdAt`, `updatedAt` and `deletedAt` are missing)

// ⚠️ Gotcha: parts that contradict each other leave a property no value can have:
type Conflict = { id: string } & { id: number }; // `id` is `string & number` -- `never`, the type with no values (08-anyUnknownNever.ts)

// @ts-expect-error
const conflict: Conflict = { id: 1 }; // Error: Type 'number' is not assignable to type 'never'.
