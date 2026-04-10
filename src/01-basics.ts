export {};

// Generics are type parameters (like <T>) that let you write code once
// and reuse it with different types — without losing type safety.
// Think of <T> as a placeholder: the caller decides what T is.

// --- Generic functions ---

// Without generics you either duplicate code per type...
function identityNumber(value: number): number {
  return value;
}
function identityString(value: string): string {
  return value;
}
// ...or use `any`, which throws away type info:
function identityAny(value: any): any {
  return value;
}

const maybeNumber = identityAny(42); // hover: any — TS can't help you anymore
maybeNumber.toUpperCase(); // no error, but crashes at runtime

// A type parameter <T> solves both: one function, full type safety.
// T stands for "Type" — it's just a convention. You can name it anything:
// <Item>, <Response>, <TValue>. Common single-letter names:
// T = Type, K = Key, V = Value, E = Error, R = Return.
function identity<T>(value: T): T {
  return value;
}

const num = identity(42); // hover: 42 — TS infers the literal type
const str = identity<string>('hello'); // explicit type argument

// Works with arrays too — T is inferred from the element type:
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNum = first([10, 20, 30]); // hover: number | undefined
const firstStr = first(['a', 'b']); // hover: string | undefined

// The return type is always T | undefined — for a static array like [10, 20, 30] it seems
// unnecessary, but at runtime arrays can be empty (e.g. fetched from an API, filtered, etc.),
// so undefined is the safe default. See 05-conditionalTypes.ts for a smarter approach.

// --- Generic type aliases ---

// Every API endpoint returns different data, but the wrapper (status, error) is always the same.
// Without generics you'd duplicate this structure for every endpoint.
// With a generic type alias, you define the wrapper once and plug in the data type:
type ApiResponse<T> = {
  data: T;
  error: string | null;
  status: number;
};

type UserResponse = ApiResponse<{ id: number; name: string }>;
type ProductListResponse = ApiResponse<{ id: number; title: string }[]>;

const success: UserResponse = {
  data: { id: 1, name: 'Alice' },
  error: null,
  status: 200,
};

const failure: UserResponse = {
  data: { id: 0, name: '' },
  error: 'User not found',
  status: 404,
};

// --- Generic interfaces ---

// Apps often have many entity types (users, articles, products) that all need
// the same CRUD operations. A generic interface defines the contract once:
interface Entity {
  id: number;
}

// `T extends Entity` means T must have at least an `id` — more on constraints in 02-constraints.ts
interface Repository<T extends Entity> {
  getById(id: number): T | undefined;
  getAll(): T[];
  save(item: T): void;
  delete(id: number): void;
}

interface Article {
  id: number;
  title: string;
  body: string;
}

// TS ensures the implementation matches the Article shape
class ArticleRepository implements Repository<Article> {
  private items: Article[] = [];

  getById(id: number) {
    return this.items.find((item) => item.id === id);
  }
  getAll() {
    return [...this.items];
  }
  save(item: Article) {
    this.items.push(item);
  }
  delete(id: number) {
    this.items = this.items.filter((item) => item.id !== id);
  }
}

const repo = new ArticleRepository();
repo.save({ id: 1, title: 'Generics 101', body: 'Generics let you...' });
const found = repo.getById(1); // hover: Article | undefined

// --- Type inference ---

// Above we wrote identity<string>('hello'), but just identity(42) without <number>.
// TS infers T from the argument, so you rarely need to spell it out.
// Provide it explicitly when: TS infers a wider type than you want,
// or when there's no argument to infer from (like ApiResponse<User> above).
function wrap<T>(value: T): { value: T } {
  return { value };
}

const wrapped = wrap(42); // hover: { value: number } — no <number> needed
const wrappedStr = wrap('hello'); // hover: { value: string }

// Example of wider inference: say you want to wrap a status for a state machine.
// TS infers string, but you need the exact literal to match allowed transitions:
const broadStatus = wrap('loading'); // hover: { value: string } — too wide
const exactStatus = wrap<'loading' | 'error' | 'success'>('loading'); // hover: { value: "loading" | "error" | "success" }
