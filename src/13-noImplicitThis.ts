// =============================================================================
// noImplicitThis — Catching `this` Context Loss
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noImplicitThis

// When a method is extracted as a standalone function, `this` loses its binding
// to the instance. In strict mode (or with the `noImplicitThis` flag), TypeScript
// reports an error when `this` has an implicit `any` type — helping you catch
// these bugs at compile time instead of getting runtime TypeErrors.

class RateLimiter {
  requestsPerSecond: number;
  burstSize: number;

  constructor(requestsPerSecond: number, burstSize: number) {
    this.requestsPerSecond = requestsPerSecond;
    this.burstSize = burstSize;
  }

  getCheckFunction() {
    // Returning a regular function — `this` is no longer bound to the RateLimiter instance.
    // TypeScript catches this because `this` has an implicit `any` type:
    return function () {
      // @ts-expect-error
      return this.requestsPerSecond * this.burstSize;
    };
  }

  // Fix: arrow functions capture `this` from the enclosing scope,
  // so the binding is preserved:
  getCheckArrow() {
    return () => {
      return this.requestsPerSecond * this.burstSize; // no error — `this` is the RateLimiter instance
    };
  }
}

const limiter = new RateLimiter(100, 5);

console.log(limiter.getCheckFunction()()); // TypeError: Cannot read properties of undefined (reading 'requestsPerSecond')
console.log(limiter.getCheckArrow()()); // 500
