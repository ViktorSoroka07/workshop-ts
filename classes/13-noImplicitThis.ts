// =============================================================================
// noImplicitThis — Catching `this` Context Loss
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noImplicitThis

// In JavaScript, `this` inside a regular function is determined by HOW the function
// is called, not where it's defined:
//   - `obj.method()`     → `this` is `obj`
//   - `const fn = obj.method; fn()`  → `this` is `undefined` (JS strict mode) or `globalThis`
//   - `setTimeout(obj.method, 0)`    → same problem, `this` is lost
//
// This is a common source of bugs when passing methods as callbacks or returning
// them from other functions. With `strict` (or `noImplicitThis`), TypeScript
// catches this at compile time by erroring when `this` has an implicit `any` type.

class RateLimiter {
  requestsPerSecond: number;
  burstSize: number;

  constructor(requestsPerSecond: number, burstSize: number) {
    this.requestsPerSecond = requestsPerSecond;
    this.burstSize = burstSize;
  }

  // --- The problem ---
  getCheckFunction() {
    // Returning a regular function — when called standalone, `this` won't be
    // the RateLimiter instance. It'll be `undefined` (in strict mode):
    return function () {
      // @ts-expect-error
      return this.requestsPerSecond * this.burstSize;
    };
  }

  // --- Fix 1: arrow function ---
  // Arrow functions don't have their own `this` — they capture it from the
  // enclosing scope (lexical `this`), so the binding is preserved:
  getCheckArrow() {
    return () => {
      return this.requestsPerSecond * this.burstSize;
    };
  }

  // --- Fix 2: Function.prototype.bind ---
  // Explicitly binds `this` to the returned function.
  // Unlike arrow functions, this creates a new function at each call:
  getCheckBound() {
    return function (this: RateLimiter) {
      return this.requestsPerSecond * this.burstSize;
    }.bind(this);
  }


  // --- Fix 3: closure over a variable ---
  // Capture `this` in a local variable before entering the inner function:
  getCheckClosure() {
    const self = this;
    return function () {
      return self.requestsPerSecond * self.burstSize;
    };
  }

  // --- Fix 4: arrow function as a class field ---
  // The method is defined as an arrow property — `this` is always the instance.
  // Downside: each instance gets its own copy (not on the prototype), so it uses
  // more memory and can't be overridden in subclasses:
  checkField = () => {
    return this.requestsPerSecond * this.burstSize;
  };
}

const limiter = new RateLimiter(100, 5);

console.log(limiter.getCheckFunction()()); // TypeError: Cannot read properties of undefined (reading 'requestsPerSecond')
console.log(limiter.getCheckArrow()()); // 500
console.log(limiter.getCheckBound()()); // 500
console.log(limiter.getCheckClosure()()); // 500
console.log(limiter.checkField()); // 500

// --- Prototype methods vs arrow class fields ---

// Regular methods live on the prototype — one copy shared by all instances:
const a = new RateLimiter(100, 5);
const b = new RateLimiter(200, 3);
console.log(a.getCheckArrow === b.getCheckArrow); // true — same function on the prototype

// Arrow class fields are assigned in the constructor per instance
// (equivalent to writing `this.checkField = () => { ... }` in the constructor):
console.log(a.checkField === b.checkField); // false — each instance has its own copy

// 1. Memory: 1000 instances = 1000 copies of the arrow function

// 2. Inheritance footgun — mixing arrow fields with prototype methods.
//    If a parent defines an arrow field and a subclass tries to override it
//    with a regular method, the arrow field wins (instance property shadows prototype):
class StrictLimiter extends RateLimiter {
  // TypeScript catches the mismatch — you can't override a property with a method:
  // @ts-expect-error
  checkField() {
    // Error: Class 'RateLimiter' defines instance member property 'checkField',
    // but extended class 'StrictLimiter' defines it as instance member function.
    return 0;
  }
}

// If TypeScript didn't stop you, the parent's arrow field would shadow
// this prototype method at runtime — `checkField()` would return 500, not 0.

// 3. Testing: harder to mock/spy on since it's not on the prototype
//    (e.g., jest.spyOn(RateLimiter.prototype, 'checkField') won't work)

// Arrow fields are convenient for callbacks (e.g., React event handlers),
// but prefer prototype methods when you need inheritance or memory efficiency.
