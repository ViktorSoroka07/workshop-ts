// =============================================================================
// 12. Intersection Types
// =============================================================================

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

// Intersecting incompatible primitives produces `never`:
type Impossible = string & number; // never -- the type with no values (more in 08-anyUnknownNever.ts)
