export {};

// --- extends: limiting what T can be ---

// Without a constraint, T could be anything — even a primitive.
// `extends object` ensures only objects are passed.
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: 'Alice' }, { role: 'admin' }); // OK
// @ts-expect-error — primitives are not objects
merge('hello', 42);

// --- keyof + indexed access ---

// K is constrained to actual keys of T, so typos are caught at compile time.
// The return type T[K] is the exact type of that property.
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const account = { id: 1, name: 'Alice', isAdmin: true };

const accountName = pluck(account, 'name'); // hover: string
const isAdmin = pluck(account, 'isAdmin'); // hover: boolean
// @ts-expect-error — 'email' is not a key of account
pluck(account, 'email');

// --- Multiple constraints with & ---

interface HasId {
  id: number;
}
interface HasTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

// T must satisfy both interfaces at once
function logEntity<T extends HasId & HasTimestamps>(entity: T): void {
  console.log(`Entity #${entity.id}, created ${entity.createdAt.toISOString()}`);
}

logEntity({
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'First post', // extra properties are fine
});

// --- Constraining to specific string literals ---

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

function request<M extends Method>(method: M, url: string) {
  console.log(`${method} ${url}`);
}

request('GET', '/api/users'); // OK
// @ts-expect-error — 'PATCH' is not in HttpMethod
request('PATCH', '/api/users');

// --- Default type parameters ---

// If no type argument is provided, T defaults to string.
// Works like default function parameters but at the type level.
interface Pagination<T = string> {
  items: T[];
  cursor: string;
  hasMore: boolean;
}

const stringPage: Pagination = { // T defaults to string
  items: ['a', 'b', 'c'],
  cursor: 'abc123',
  hasMore: true,
};

const numberPage: Pagination<number> = { // override the default
  items: [1, 2, 3],
  cursor: 'def456',
  hasMore: false,
};
