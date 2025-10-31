import { filter } from 'lodash';
// ============================================================================
// TYPESCRIPT UTILITY TYPES
// ============================================================================

// ============================================================================
// CATEGORY 1: OBJECT PROPERTY MODIFIERS
// These types modify the properties of object types
// ============================================================================

// ----------------------------------------------------------------------------
// Partial<T>
// Description: Makes all properties of T optional
// Use case: When you want to update only some properties of an object
// ----------------------------------------------------------------------------
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type PartialUser = Partial<User>;
// Result: { id?: number; name?: string; email?: string; age?: number }

// Example usage:
function updateUser(user: User, updates: Partial<User>): User {
  return { ...user, ...updates };
}

const user: User = { id: 1, name: 'John', email: 'john@example.com', age: 30 };
const updated = updateUser(user, { name: 'Jane' }); // Only updating name

// ----------------------------------------------------------------------------
// Required<T>
// Description: Makes all properties of T required (removes optionality)
// Use case: When you need to ensure all optional properties are provided
// ----------------------------------------------------------------------------
interface UserDraft {
  id?: number;
  name?: string;
  email?: string;
}

type CompleteUser = Required<UserDraft>;
// Result: { id: number; name: string; email: string }

// Example usage:
function saveUser(draft: UserDraft): CompleteUser {
  if (!draft.id || !draft.name || !draft.email) {
    throw new Error('All fields are required');
  }
  return draft as CompleteUser;
}

// ----------------------------------------------------------------------------
// Readonly<T>
// Description: Makes all properties of T readonly (immutable)
// Use case: When you want to prevent modification of object properties
// ----------------------------------------------------------------------------
type ReadonlyUser = Readonly<User>;
// Result: { readonly id: number; readonly name: string; readonly email: string; readonly age: number }

// Example usage:
const immutableUser: ReadonlyUser = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  age: 30,
};
// immutableUser.name = 'Jane'; // Error: Cannot assign to 'name' because it is a read-only property

// ============================================================================
// CATEGORY 2: OBJECT PROPERTY SELECTION
// These types select or exclude specific properties from object types
// ============================================================================

// ----------------------------------------------------------------------------
// Pick<T, K>
// Description: Creates a type by picking specific properties K from T
// Use case: When you only need a subset of properties from a larger type
// ----------------------------------------------------------------------------
type UserPreview = Pick<User, 'id' | 'name'>;
// Result: { id: number; name: string }

// Example usage:
function displayUserName(user: UserPreview): string {
  return `User #${user.id}: ${user.name}`;
}

// ----------------------------------------------------------------------------
// Omit<T, K>
// Description: Creates a type by omitting specific properties K from T
// Use case: When you need all properties except specific ones
// ----------------------------------------------------------------------------
type UserWithoutEmail = Omit<User, 'email'>;
// Result: { id: number; name: string; age: number }

// Example usage:
function createAnonymousProfile(user: User): UserWithoutEmail {
  const { email, ...profile } = user;

  return profile;
}

// ============================================================================
// CATEGORY 3: RECORD AND MAPPING TYPES
// These types create object types with specific key-value patterns
// ============================================================================

// ----------------------------------------------------------------------------
// Record<K, T>
// Description: Creates an object type with keys of type K and values of type T
// Use case: When you need to create a dictionary/map with specific key and value types
// ----------------------------------------------------------------------------
type UserRole = 'admin' | 'user' | 'guest';
type RolePermissions = Record<UserRole, string[]>;
// Result: { admin: string[]; user: string[]; guest: string[] }

// Example usage:
const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read'],
};

// Another example with string keys:
type ErrorMessages = Record<string, string>;

const errors: ErrorMessages = {
  404: 'Not Found',
  500: 'Internal Server Error',
  401: 'Unauthorized',
};

// ============================================================================
// CATEGORY 4: UNION TYPE UTILITIES
// These types work specifically with union types
// ============================================================================

// ----------------------------------------------------------------------------
// Exclude<T, U>
// Description: Excludes types from T that are assignable to U
// Use case: Remove specific types from a union
// Note: Works with UNION TYPES ONLY
// ----------------------------------------------------------------------------
type AllRoles = 'admin' | 'user' | 'guest' | 'moderator';
type NonAdminRoles = Exclude<AllRoles, 'admin'>;
// Result: 'user' | 'guest' | 'moderator'

// Example usage:
function assignNonAdminRole(role: NonAdminRoles): void {
  console.log(`Assigned role: ${role}`);
}

// More complex example:
type Primitive = string | number | boolean | null | undefined;
type NonNullablePrimitive = Exclude<Primitive, null | undefined>;
// Result: string | number | boolean

// ----------------------------------------------------------------------------
// Extract<T, U>
// Description: Extracts types from T that are assignable to U
// Use case: Keep only specific types from a union
// Note: Works with UNION TYPES ONLY
// ----------------------------------------------------------------------------
type ExtractedAdminRoles = Extract<AllRoles, 'admin' | 'moderator'>; // 'admin' | 'moderator'

// Example usage:
type MixedType = string | number | boolean | Date;
type OnlyStringsAndNumbers = Extract<MixedType, string | number>; // string | number

// ----------------------------------------------------------------------------
// NonNullable<T>
// Description: Excludes null and undefined from T
// Use case: Remove null/undefined from a type
// Note: Works with UNION TYPES (primitives, objects, arrays, etc.)
// ----------------------------------------------------------------------------
type NullableString = string | null | undefined;
type DefiniteString = NonNullable<NullableString>; // string

// Works with objects too!
type NullableUser = User | null | undefined;
type DefiniteUser = NonNullable<NullableUser>; // User

// Usage with objects:
function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value != null;
}

const mixedArray: MixedArrayItem[] = ['a', null, 'b', undefined];

type MixedArrayItem = string | null | undefined;

const cleaned = mixedArray.filter(isNonNullable);
const cleaned2 = mixedArray.filter((item) => item != null);
const cleaned3 = filter(mixedArray) as NonNullable<MixedArrayItem>[];

// ============================================================================
// CATEGORY 5: FUNCTION TYPE UTILITIES
// These types extract information from function types
// ============================================================================

// ----------------------------------------------------------------------------
// Parameters<T>
// Description: Extracts parameter types from a function type as a tuple
// Use case: When you need to work with function parameter types
// ----------------------------------------------------------------------------
function createUser(name: string, age: number, email: string): User {
  return { id: Date.now(), name, age, email };
}

type CreateUserParams = Parameters<typeof createUser>; // [name: string, age: number, email: string]

// Example usage:
function callWithLogging(fn: typeof createUser, ...args: CreateUserParams) {
  console.log('Calling with:', args);

  return fn(...args);
}

callWithLogging(createUser, 'Alice', 25, 'email');

// ----------------------------------------------------------------------------
// ReturnType<T>
// Description: Extracts the return type from a function type
// Use case: When you need to use the return type of a function
// ----------------------------------------------------------------------------
type CreateUserReturn = ReturnType<typeof createUser>; // User

// Example usage:
function processUser(user: ReturnType<typeof createUser>) {
  console.log(`Processing user: ${user.name}`);
}

// ----------------------------------------------------------------------------
// ConstructorParameters<T>
// Description: Extracts parameter types from a constructor function type
// Use case: When working with class constructors
// ----------------------------------------------------------------------------
class Person {
  constructor(
    public name: string,
    public age: number
  ) {}
}

type PersonConstructorParams = ConstructorParameters<typeof Person>;
// Result: [name: string, age: number]

// Example usage:
function createPerson(...args: ConstructorParameters<typeof Person>) {
  return new Person(...args);
}

// ----------------------------------------------------------------------------
// InstanceType<T>
// Description: Extracts the instance type from a constructor function type
// Use case: When you need the type of an instance created by a constructor
// ----------------------------------------------------------------------------
type PersonInstance = InstanceType<typeof Person>; // Person

function createInstance<T extends new (...args: any[]) => any>(
  ctor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new ctor(...args);
}

class Dog {
  constructor(public name: string) {}
  bark() {
    console.log(`${this.name} says woof!`);
  }
}
class Cat {
  constructor(
    public name: string,
    public age: number
  ) {}
}

const dog = createInstance(Dog, 'Buddy');
// dog → Dog
dog.bark();
const cat = createInstance(Cat, 'Whiskers', 3);
// dog → Dog
dog.bark();

// ============================================================================
// CATEGORY 6: STRING MANIPULATION UTILITIES
// These types transform string literal types
// Note: Works with STRING LITERAL TYPES
// ============================================================================

const searchTypes = {
  keyword: 'keyword',
  title: 'title',
  author: 'author',
} as const;

type SearchType = keyof typeof searchTypes;

// ----------------------------------------------------------------------------
// Uppercase<T>
// Description: Converts string literal types to uppercase
// Use case: When you need uppercase versions of string literals
// ----------------------------------------------------------------------------
type SearchTypeUppercased = Uppercase<SearchType>;
// Result: "KEYWORD" | "TITLE" | "AUTHOR"

// Example usage:
const apiEndpoint: SearchTypeUppercased = 'KEYWORD';

// ----------------------------------------------------------------------------
// Lowercase<T>
// Description: Converts string literal types to lowercase
// Use case: When you need lowercase versions of string literals
// ----------------------------------------------------------------------------
type SearchTypeLowercased = Lowercase<SearchTypeUppercased>;
// Result: "keyword" | "title" | "author"

// Example usage:
function normalizeSearchType(type: string) {
  return type.toLowerCase() as SearchTypeLowercased;
}

// ----------------------------------------------------------------------------
// Capitalize<T>
// Description: Capitalizes the first letter of string literal types
// Use case: When you need title-case versions of strings
// ----------------------------------------------------------------------------
type SearchTypeCapitalized = Capitalize<SearchType>;
// Result: "Keyword" | "Title" | "Author"

// Example usage:
function displaySearchType(type: SearchTypeCapitalized): string {
  return `Search by ${type}`;
}

displaySearchType('Author');

// ----------------------------------------------------------------------------
// Uncapitalize<T>
// Description: Uncapitalizes the first letter of string literal types
// Use case: When you need to convert title-case to lowercase first letter
// ----------------------------------------------------------------------------
type SearchTypeUncapitalized = Uncapitalize<SearchTypeCapitalized>;
// Result: "keyword" | "title" | "author"

// ============================================================================
// CATEGORY 7: PROMISE AND ASYNC UTILITIES
// These types work with Promise types
// ============================================================================

// ----------------------------------------------------------------------------
// Awaited<T>
// Description: Recursively unwraps Promise types
// Use case: Get the resolved type of a Promise
// ----------------------------------------------------------------------------
async function fetchUser(): Promise<User> {
  return { id: 1, name: 'John', email: 'john@example.com', age: 30 };
}

type FetchedUser = Awaited<ReturnType<typeof fetchUser>>; // User

// Works with nested Promises:
type NestedPromise = Promise<Promise<string>>;
type UnwrappedPromise = Awaited<NestedPromise>; // string

// Example usage:
async function processAsyncUser(userPromise: Promise<User>): Promise<void> {
  const user: Awaited<typeof userPromise> = await userPromise;

  console.log(user.name);
}

// ============================================================================
// CATEGORY 8: TEMPLATE LITERAL TYPES (Advanced)
// Combine string literal types with template literals
// ============================================================================

// Example: Creating event names
type Action = 'click' | 'focus' | 'blur';
type EventName = `on${Capitalize<Action>}`;
// Result: "onClick" | "onFocus" | "onBlur"

type HttpMethod = 'get' | 'post' | 'put' | 'delete';
type ApiEndpoint = `/${HttpMethod}/${string}`;
// Result: "/get/..." | "/post/..." | "/put/..." | "/delete/..."

// ============================================================================
// PRACTICAL COMBINATIONS
// ============================================================================

// Combining Partial and Pick
type UserUpdateDTO = Partial<Pick<User, 'name' | 'email' | 'age'>>;
// Result: { name?: string; email?: string; age?: number }

// Combining Omit and Readonly
type ImmutableUserWithoutId = Readonly<Omit<User, 'id'>>;
// Result: { readonly name: string; readonly email: string; readonly age: number }
