// =============================================================================
// Note: @ts-expect-error vs @ts-ignore
// =============================================================================
//
// Throughout these files we use `// @ts-expect-error` to intentionally demonstrate
// type errors. It suppresses the error on the NEXT line, similar to `@ts-ignore`.
//
// The key difference:
//   - @ts-ignore  -- silently suppresses the error, even if the error disappears
//                    (e.g., after a refactor). You'll never know the line is now valid.
//   - @ts-expect-error -- suppresses the error BUT fails if there is NO error.
//                    This means it breaks when the expected error goes away,
//                    alerting you that the comment is stale and should be removed.
//
// ✅ Best practice: prefer @ts-expect-error -- it's self-cleaning. @ts-ignore should only be used
// when you genuinely don't care whether the line has an error or not.
//
// Markers to scan for:
//   ✅ Best practice: -- the choice most real-world projects make
//   ⚠️ Gotcha:        -- where TypeScript (or JavaScript) surprises people
//   🧪 Try it:        -- an experiment to run live
//   🎓 On your own:   -- a harder example we skip in the room; study it afterwards
//
// These files have no import/export, so they share one global scope:
// a type declared in one file can be used in the next ones.

// =============================================================================
// 1. Primitive Types and Type Annotations
// =============================================================================

/*
  TypeScript's primitive types mirror JavaScript's:
  - string     - number      - boolean
  - null       - undefined   - symbol      - bigint
*/

let statusCode: number = 200;
let endpoint: string = '/api/v1/users';
let isAuthenticated: boolean = false;
let cachedResponse: null = null;
let authToken: undefined = undefined;

// `symbol` creates a unique key -- useful for attaching your own data to an object:
const RequestId = Symbol('RequestId'); // type: unique symbol -- that's what lets it be a key in a type
const Timestamp = Symbol('Timestamp');

// `type` names a shape so it can be reused -- 04-typeAliasesAndInterfaces.ts
type TrackedRequest = {
  url: string;
  id: string; // the API's own `id`
  [RequestId]: string; // our internal id -- can't clash with `id`
  [Timestamp]: number;
};

const trackedRequest: TrackedRequest = {
  url: '/api/users',
  id: 'user-42',
  [RequestId]: 'req_abc123',
  [Timestamp]: Date.now(), // milliseconds since Jan 1, 1970 -- e.g. 1_700_000_000_000 is Nov 14, 2023
};

// Symbol keys stay out of serialization and key listing -- your data doesn't leak:
JSON.stringify(trackedRequest); // '{"url":"/api/users","id":"user-42"}'
Object.keys(trackedRequest); // ['url', 'id']
trackedRequest[RequestId]; // 'req_abc123' -- still readable if you have the symbol

// Even symbols with the same description are different -- two parts of an app can each
// create their own 'id' key without overwriting each other:
const analyticsId = Symbol('id');
const cacheId = Symbol('id');
// @ts-expect-error
analyticsId === cacheId; // Error: This comparison appears to be unintentional -- at runtime it's always false

// `bigint` handles integers beyond Number.MAX_SAFE_INTEGER (2^53 - 1 = 9_007_199_254_740_991):
const fileSize: bigint = 9_007_199_254_740_993n; // ~9 petabytes, in bytes -- just past what `number` holds exactly
console.log(fileSize); // 9007199254740993n -- exact

// ⚠️ Gotcha: the same value as a plain `number` silently loses its last digit:
const fileSizeAsNumber = 9_007_199_254_740_993;
console.log(fileSizeAsNumber); // 9007199254740992 -- off by one, and it compiles
// (only the editor hints at it: "Numeric literals ... are too large to be represented accurately")

const offset: bigint = 1024n;
const newOffset = fileSize + offset; // bigint + bigint = bigint

// bigint and number don't mix:
// @ts-expect-error
const bad = fileSize + 1; // Error: can't mix bigint and number

// With `strict: true` (our tsconfig), null/undefined are NOT assignable to other types:
// @ts-expect-error
let username: string = null; // Error: Type 'null' is not assignable to type 'string'
