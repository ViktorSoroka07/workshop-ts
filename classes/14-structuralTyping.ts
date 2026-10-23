// =============================================================================
// Structural Typing with Classes
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/type-compatibility.html

// In Java/C#, types are nominal — two classes are compatible only if they share
// an explicit relationship (extends/implements). In TypeScript, types are
// structural — two types are compatible if they have the same shape, regardless
// of their names or whether they're related.

// These two classes have no relationship (no extends, no implements):
class UserDTO {
  constructor(
    public name: string,
    public age: number
  ) {}
}

class EmployeeDTO {
  constructor(
    public name: string,
    public age: number
  ) {}
}

// Yet TypeScript treats them as compatible — same shape, same type:
const user: UserDTO = new EmployeeDTO('Alice', 30); // OK -- same shape
const employee: EmployeeDTO = new UserDTO('Bob', 25); // OK

function greet(u: UserDTO) {
  console.log(`Hello, ${u.name}`);
}

greet(new EmployeeDTO('Charlie', 40)); // OK -- EmployeeDTO has the same shape

// Even a plain object literal works — no class needed at all:
greet({ name: 'Dave', age: 35 }); // OK -- same shape

// This also means extra properties are fine when assigning via a variable
// (the type only needs to be a superset):
class DetailedUser {
  constructor(
    public name: string,
    public age: number,
    public email: string
  ) {}
}

const detailed: UserDTO = new DetailedUser('Eve', 28, 'eve@example.com'); // OK -- has name + age

// --- Why this matters ---
// In Java, this would be a compile error — UserDTO and EmployeeDTO are different types.
// In TypeScript, if the shape matches, it's assignable. This is powerful but can
// be surprising.
//
// ⚠️ Gotcha: a `Dog` and a `Cat` with the same fields are interchangeable.

class Dog {
  constructor(public name: string) {}
}

class Cat {
  constructor(public name: string) {}
}

const pets: Dog[] = [new Cat('Whiskers')]; // OK -- same shape!

// --- How to prevent this (brand pattern) ---
//
// Sometimes structural compatibility is dangerous. Imagine mixing up USD and EUR,
// or passing a raw user ID where a validated user ID is expected. The "brand pattern"
// adds a fake field that exists only in the type system — it makes two otherwise
// identical shapes incompatible.
//
// The brand field is never assigned at runtime (the `!` tells TypeScript to skip
// the initialization check, see ../flags/04-strictPropertyInitialization/index.ts). It's
// purely a compile-time tag.

class USD {
  private __brand!: 'USD'; // never assigned, never read — only exists for the type checker
  constructor(public value: number) {}
}

class EUR {
  private __brand!: 'EUR';
  constructor(public value: number) {}
}

const dollars = new USD(100);
// @ts-expect-error
const euros: EUR = dollars; // Error: Type 'USD' is not assignable to type 'EUR'.
// Both have `{ value: number }` — but the private `__brand` fields have different
// literal types ('USD' vs 'EUR'), which breaks structural compatibility.

// This prevents accidental mixing:
function processPayment(amount: EUR) {
  console.log(`Processing €${amount.value}`);
}

processPayment(new EUR(50)); // OK
// @ts-expect-error
processPayment(new USD(50)); // Error: Argument of type 'USD' is not assignable to parameter of type 'EUR'.

// 🎓 On your own: the brand pattern also works with type aliases (no classes needed).
// Harder because it combines an intersection, `unique symbol` and type assertions:
// `unique symbol` is a type that only one declaration can have, so the two brands never match:
type UserId = string & { readonly __brand: unique symbol };
type OrderId = string & { readonly __brand: unique symbol };

// You'd create branded values via helper functions:
function toUserId(id: string): UserId {
  return id as UserId;
}

function toOrderId(id: string): OrderId {
  return id as OrderId;
}

function getUser(id: UserId) {
  console.log(`Fetching user ${id}`);
}

const userId = toUserId('usr_123');
const orderId = toOrderId('ord_456');

getUser(userId); // OK
// @ts-expect-error
getUser(orderId); // Error: Argument of type 'OrderId' is not assignable to parameter of type 'UserId'.
// @ts-expect-error
getUser('raw_string'); // Error: Argument of type 'string' is not assignable to parameter of type 'UserId'.
