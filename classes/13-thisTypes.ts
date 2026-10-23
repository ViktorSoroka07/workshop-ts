// =============================================================================
// `this` Types and Fluent APIs (Method Chaining)
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#this-types

// Methods can return `this` to enable method chaining (the "fluent" pattern).
// The special `this` type ensures that subclasses return their own type — not
// the parent's — so the chain stays correctly typed through the inheritance hierarchy.

// The technique behind the Builder pattern (build an object step by step) and fluent
// interfaces (every step returns the object, so calls chain).

class QueryBuilder {
  protected filters: string[] = [];
  protected limitValue?: number;

  // Return type is `this`, not `QueryBuilder` — crucial for subclass chaining:
  where(condition: string): this {
    this.filters.push(condition);
    return this;
  }

  limit(count: number): this {
    this.limitValue = count;
    return this;
  }

  build(): string {
    let query = 'SELECT *';

    if (this.filters.length) {
      query += ' WHERE ' + this.filters.join(' AND ');
    }

    if (this.limitValue) {
      query += ` LIMIT ${this.limitValue}`;
    }

    return query;
  }
}

// Chaining works on the base class:
const query = new QueryBuilder()
  .where('age > 18')
  .where('active = true')
  .limit(10)
  .build();

console.log(query); // SELECT * WHERE age > 18 AND active = true LIMIT 10

// The difference shows up with inheritance. `OrderedQueryBuilder` extends `QueryBuilder`:
// it inherits `where()`, `limit()` and `build()` and adds `orderBy()`. The question is what
// type `where()` hands back when it is called on an `OrderedQueryBuilder` (the README
// draws both answers):
class OrderedQueryBuilder extends QueryBuilder {
  private orderByField?: string;

  orderBy(field: string): this {
    this.orderByField = field;
    return this;
  }

  override build(): string {
    let query = super.build();

    if (this.orderByField) {
      query += ` ORDER BY ${this.orderByField}`;
    }

    return query;
  }
}

// Why `this` matters: if the parent methods returned `QueryBuilder` instead of `this`,
// then calling `.where()` on an `OrderedQueryBuilder` would return a plain `QueryBuilder`
// — and `.orderBy()` wouldn't be available in the chain.
// With `this` as the return type, it adapts to the subclass automatically:
// `.where()` returns `OrderedQueryBuilder`, so `.orderBy()` is available after it:
const orderedQuery = new OrderedQueryBuilder()
  .where('status = "active"')
  .orderBy('created_at')
  .limit(5)
  .build();

console.log(orderedQuery); // SELECT * WHERE status = "active" LIMIT 5 ORDER BY created_at

// --- When does it break? ---
// ⚠️ Gotcha: if you `return this` without a type annotation, TypeScript infers `: this` for you —
// so it works automatically. The problem only happens when you explicitly annotate
// with the concrete class name instead of `this`:

class BrokenQueryBuilder {
  protected filters: string[] = [];

  where(condition: string): BrokenQueryBuilder {
    // returns `BrokenQueryBuilder`, not `this`
    this.filters.push(condition);
    return this;
  }
}

class BrokenOrderedBuilder extends BrokenQueryBuilder {
  orderBy(_field: string): this {
    return this;
  }
}

// `.where()` returns `BrokenQueryBuilder`, which doesn't have `.orderBy()`:
// @ts-expect-error
new BrokenOrderedBuilder().where('x = 1').orderBy('id'); // Error: Property 'orderBy' does not exist on type 'BrokenQueryBuilder'.

// ✅ Best practice: write `: this` on a chainable method, and in an interface that describes
// a builder (`where(condition: string): this`). Leaving it off also works, but the annotation
// makes the compiler check every `return`: handing back a new object is an error.
class CheckedQueryBuilder {
  where(condition: string): this {
    console.log(condition);

    // @ts-expect-error
    return new CheckedQueryBuilder(); // Error: Type 'CheckedQueryBuilder' is not assignable to type 'this'.
  }
}
