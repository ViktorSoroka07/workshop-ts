// =============================================================================
// Abstract Classes and Members
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members

// Abstract classes serve as base classes that cannot be instantiated directly.
// They define a contract: abstract methods MUST be implemented by derived classes,
// while concrete methods provide shared behavior inherited by all subclasses.
//
// Key difference from interfaces: abstract classes can carry implementation
// (constructors, fields, concrete methods). See 09-implements.ts for the full comparison.
//
// Design patterns are built on it: Template Method (the base class fixes the steps,
// subclasses fill in some of them) and Factory Method (the base class asks a subclass
// to create the object).

abstract class PaymentMethod {
  constructor(public amount: number) {}

  // A field works as in any class, and every subclass inherits it:
  protected status: 'pending' | 'confirmed' = 'pending';

  // An abstract field has no value here — every subclass MUST declare it:
  abstract readonly provider: string;

  // Abstract methods — no implementation here, every subclass MUST provide its own:
  abstract processPayment(): void;
  abstract refund(): void;

  // Concrete method — shared logic that all subclasses inherit as-is:
  confirmPayment(): void {
    this.status = 'confirmed';

    console.log(
      `${this.provider} payment of $${this.amount} is ${this.status}.`
    );
  }
}

// A subclass can close only part of the contract and stay abstract itself. Every card
// refunds through the card network, but each kind of card authorizes differently, so
// `CardPayment` implements `refund()` and leaves `processPayment()` to its subclasses:

abstract class CardPayment extends PaymentMethod {
  readonly provider = 'Card';

  refund(): void {
    console.log(`Refunding $${this.amount} to the card...`);
  }
}

class CreditCardPayment extends CardPayment {
  processPayment(): void {
    console.log(`Processing credit card payment of $${this.amount}...`);
    // e.g., card authorization, fraud check
  }
}

// A class that extends `PaymentMethod` directly implements everything itself:

class PayPalPayment extends PaymentMethod {
  readonly provider = 'PayPal';

  processPayment(): void {
    console.log(`Processing PayPal payment of $${this.amount}...`);
    // e.g., PayPal transaction verification
  }

  refund(): void {
    console.log(`Refunding PayPal payment of $${this.amount}...`);
  }
}

// Cannot instantiate an abstract class directly, however much of it is implemented:
// @ts-expect-error
const method = new PaymentMethod(100); // Error: Cannot create an instance of an abstract class.

// @ts-expect-error
const cardMethod = new CardPayment(100); // Error: Cannot create an instance of an abstract class.

// A subclass that leaves an abstract member open is incomplete, field or method:
// @ts-expect-error
class DebitCardPayment extends CardPayment {} // Error: Non-abstract class 'DebitCardPayment' does not implement inherited abstract member processPayment from class 'CardPayment'.

// @ts-expect-error
class CashPayment extends PaymentMethod {
  // Error: Non-abstract class 'CashPayment' does not implement inherited abstract member provider from class 'PaymentMethod'.
  processPayment(): void {}

  refund(): void {}
}

// Only concrete subclasses can be instantiated:
const payment = new CreditCardPayment(50);

payment.processPayment(); // Processing credit card payment of $50...
payment.refund(); // Refunding $50 to the card...  (inherited from CardPayment)
payment.confirmPayment(); // Card payment of $50 is confirmed.  (inherited, not re-implemented)
