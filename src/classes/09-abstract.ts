// =============================================================================
// Abstract Classes and Members
// =============================================================================
// https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members

// Abstract classes serve as base classes that cannot be instantiated directly.
// They define a contract: abstract methods MUST be implemented by derived classes,
// while concrete methods provide shared behavior inherited by all subclasses.

abstract class PaymentMethod {
  constructor(public amount: number) {}

  // Abstract methods — no implementation here, every subclass MUST provide its own:
  abstract processPayment(): void;
  abstract refund(): void;

  // Concrete method — shared logic that all subclasses inherit as-is:
  confirmPayment(): void {
    console.log('Payment has been confirmed.');
  }
}

// Each derived class implements the abstract methods with payment-specific logic:

class CreditCardPayment extends PaymentMethod {
  processPayment(): void {
    console.log(`Processing credit card payment of $${this.amount}...`);
    // e.g., card authorization, fraud check
  }

  refund(): void {
    console.log(`Refunding credit card payment of $${this.amount}...`);
  }
}

class PayPalPayment extends PaymentMethod {
  processPayment(): void {
    console.log(`Processing PayPal payment of $${this.amount}...`);
    // e.g., PayPal transaction verification
  }

  refund(): void {
    console.log(`Refunding PayPal payment of $${this.amount}...`);
  }
}
