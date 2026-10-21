// =============================================================================
// 10. Intersection Types
// =============================================================================

// Unions mean "one OR the other"; intersections mean "both at the same time":
type Timestamped = { createdAt: Date; updatedAt: Date };
type SoftDeletable = { deletedAt: Date | null };

type User = UserType & Timestamped & SoftDeletable; // `UserType` comes from 03-typeAliasesAndInterfaces.ts

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
type Impossible = string & number; // never
