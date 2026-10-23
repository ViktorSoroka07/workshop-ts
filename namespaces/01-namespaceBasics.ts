// =============================================================================
// Namespaces: Grouping Code Under One Global Name
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/namespaces.html
//
// A `namespace` was TypeScript's way to organize code before ES modules existed:
// it wraps declarations in one named object so they do not leak into the global
// scope one by one. Modern code uses modules instead (../modules/01-namedExports),
// so this topic is here to read legacy code and ambient typings, not to write new code.
//
// These files have no import/export, so they share one global scope: every
// top-level name below is unique across the whole folder.

// Only `export`-ed members are visible from outside the block:
namespace Shipping {
  const flatRate = 499; // private -- the block is the only place that sees it

  export interface Parcel {
    weightKg: number;
  }

  export function quote(parcel: Parcel): number {
    return flatRate + parcel.weightKg * 120;
  }
}

const parcel: Shipping.Parcel = { weightKg: 2 };
console.log(Shipping.quote(parcel)); // 739

// @ts-expect-error
Shipping.flatRate; // Error: Property 'flatRate' does not exist on type 'typeof Shipping'.

// --- A namespace is a runtime object ---
// A namespace that holds values compiles to an object built by an immediately
// invoked function; `Shipping` above becomes, roughly:
//
//   var Shipping;
//   (function (Shipping) {
//     const flatRate = 499;
//     function quote(parcel) { return flatRate + parcel.weightKg * 120; }
//     Shipping.quote = quote;
//   })(Shipping || (Shipping = {}));
//
// A namespace with only types (interfaces, type aliases) emits nothing.

// --- Same name, same namespace: blocks merge ---
// Declaring `Shipping` again adds members to the same object, even from another file
// (that is how 02- to 05- build one `Validation`). Each block keeps its own private
// names, though:
namespace Shipping {
  export function quoteExpress(parcel: Parcel): number {
    return quote(parcel) * 2; // `quote` and `Parcel` were exported, so this block sees them
  }

  export function readFlatRate() {
    // @ts-expect-error
    return flatRate; // Error: Cannot find name 'flatRate'. -- it belongs to the first block
  }
}

console.log(Shipping.quoteExpress(parcel)); // 1478

// --- Nested namespaces and aliases ---
namespace Warehouse {
  export namespace Cold {
    export class Freezer {
      constructor(readonly temperatureC: number) {}
    }
  }
}

const freezer = new Warehouse.Cold.Freezer(-18);

// `import X = A.B.C` is not an ES import: it gives a long namespace path a short name.
import Freezer = Warehouse.Cold.Freezer;

const spareFreezer = new Freezer(-20);
console.log(freezer.temperatureC, spareFreezer.temperatureC); // -18 -20

// 🧪 Try it: hover `Shipping` and `Warehouse.Cold` -- both are `typeof` an object of members.
