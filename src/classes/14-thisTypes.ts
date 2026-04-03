// =============================================================================
// `this` Types and Fluent APIs (Method Chaining)
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#this-types

// Methods can return `this` to enable method chaining (the "fluent" pattern).
// The special `this` type ensures that subclasses return their own type — not
// the parent's — so the chain stays correctly typed through the inheritance hierarchy.

class QueryBuilder {
  protected filters: string[] = [];
  protected limitValue?: number;

  // Return type is `this`, not `QueryBuilder` — crucial for subclass chaining:
  where(condition: string): this {
    this.filters.push(condition);
    return this;
  }

  limit(n: number): this {
    this.limitValue = n;
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

// The `this` return type shines with subclasses — parent methods like `.where()`
// return `OrderedQueryBuilder` (not `QueryBuilder`), so `.orderBy()` stays available:
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

// `.where()` returns `OrderedQueryBuilder`, so `.orderBy()` is available after it:
const orderedQuery = new OrderedQueryBuilder()
  .where('status = "active"')
  .orderBy('created_at')
  .limit(5)
  .build();

console.log(orderedQuery); // SELECT * WHERE status = "active" LIMIT 5 ORDER BY created_at
