// =============================================================================
// Merging a Namespace with a Function, Class or Enum
// =============================================================================

// 🎓 On your own: harder because one name now means two things (a value and a
// namespace), and the order of the declarations matters.
// A namespace can merge with a function, class or enum of the same name and add members
// to it. Type definitions for libraries that are both callable and have properties
// are written this way, which is why you meet it when reading `.d.ts` files.

// --- Function + namespace: a function with properties ---
function createInvoice(customer: string) {
  return { customer, currency: createInvoice.currency };
}

namespace createInvoice {
  export const currency = 'EUR';
}

console.log(createInvoice('Acme')); // { customer: 'Acme', currency: 'EUR' }

// --- Enum + namespace: helper functions that live on the enum ---
enum PaymentStatus {
  Pending,
  Paid,
}

namespace PaymentStatus {
  export function isFinal(status: PaymentStatus) {
    return status === PaymentStatus.Paid;
  }
}

console.log(PaymentStatus.isFinal(PaymentStatus.Paid)); // true

// --- Class + namespace: types and statics that belong to the class ---
class Order {
  lines: Order.Line[] = [];
}

namespace Order {
  export interface Line {
    sku: string;
    quantity: number;
  }
}

const order = new Order();
order.lines.push({ sku: 'A-100', quantity: 2 });

// ⚠️ Gotcha: the namespace must come AFTER the class or function it merges with in the
// same file, because it extends an object that has to exist already:
// @ts-expect-error
namespace formatPrice {
  // Error: A namespace declaration cannot be located prior to a class or function with which it is merged.
  export const symbol = '€';
}

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2);
}
