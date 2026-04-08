export {};

// Generics are type parameters (like <T>) that let you write code once
// and reuse it with different types — without losing type safety.
// Think of <T> as a placeholder: the caller decides what T is.

// --- Generic functions ---

// Without generics you'd write separate functions or lose type info with `any`.
// A type parameter <T> lets one function work with any type safely.

function identity<T>(value: T): T {
  return value;
}

const num = identity(42); // hover: 42 — TS infers the literal type
const str = identity<string>('hello'); // explicit type argument

// A more useful example: type-safe property access
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const order = { id: 1, product: 'Keyboard', price: 75 };

const orderPrice = getProp(order, 'price'); // hover: number
const orderProduct = getProp(order, 'product'); // hover: string
// @ts-expect-error — 'discount' doesn't exist on the order object
getProp(order, 'discount');

// --- Generic type aliases ---

// Wrap any API response in a consistent shape:
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

// A repository interface that works with any entity type:
interface Entity {
  id: number;
}

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

// TS infers T from the argument — you rarely need to spell it out:
function wrap<T>(value: T): { value: T } {
  return { value };
}

const wrapped = wrap(42); // hover: { value: number } — no <number> needed
const wrappedStr = wrap('hello'); // hover: { value: string }

// Inference also works with arrays:
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

const firstNum = first([10, 20, 30]); // hover: number | undefined
const firstStr = first(['a', 'b']); // hover: string | undefined
