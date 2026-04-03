// =============================================================================
// Getters and Setters (Accessors)
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#getters--setters

// TypeScript supports `get` and `set` accessors, letting you intercept property
// reads and writes. Setters are a natural place for validation logic, while
// getters can compute derived values on the fly.

class PaginatedResponse {
  private _pageSize: number;
  private totalItems: number;

  constructor(totalItems: number, pageSize: number = 20) {
    this.totalItems = totalItems;
    this._pageSize = pageSize;
  }

  // Getter — exposes the internal value as a regular property read
  get pageSize(): number {
    return this._pageSize;
  }

  // Setter — intercepts assignment and validates before storing
  set pageSize(value: number) {
    if (value < 1 || value > 100) {
      throw new RangeError('Page size must be between 1 and 100.');
    }

    this._pageSize = value;
  }

  // Getter without a matching setter — makes the property effectively readonly.
  // The value is computed on the fly from other fields:
  get totalPages(): number {
    return Math.ceil(this.totalItems / this._pageSize);
  }
}

const paginated = new PaginatedResponse(95, 20);

console.log(paginated.pageSize); // 20
console.log(paginated.totalPages); // 5  (95 / 20 = 4.75, ceil → 5)

paginated.pageSize = 10; // triggers the setter, validation passes
console.log(paginated.totalPages); // 10 (95 / 10 = 9.5, ceil → 10)

// No setter defined for `totalPages`, so assignment is an error:
// @ts-expect-error
paginated.totalPages = 0; // Error: Cannot assign to 'totalPages' because it is a read-only property.
