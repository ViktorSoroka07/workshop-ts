## Types

TypeScript's type system built on top of JavaScript: what a type is, how to describe data and
functions, what to do when you do not know a type yet, how to combine and narrow types, and
how to derive new types from values.

```mermaid
flowchart LR
  basics["Values<br/>01 primitives, 02 let/const"] --> shapes["Shapes<br/>03 objects, arrays, tuples<br/>04 aliases, interfaces<br/>05 index signatures"]
  shapes --> funcs["06 function types<br/>07 less annotation"]
  funcs --> unsure["Not sure of a type?<br/>08 any, unknown, never"]
  unsure --> combine["Combine and narrow<br/>09 unions, 10 discriminated unions<br/>11 narrowing, 12 intersections"]
  combine --> derive["Assert and derive<br/>13 assertions, as const<br/>14 typeof, keyof<br/>15 enums vs literal unions"]
```

Lessons marked 🎓 inside a file are harder; we skip them in the room and you study them
afterwards. The ✅ / ⚠️ / 🧪 / 🎓 markers are explained at the top of
[`01-primitives.ts`](01-primitives.ts).
