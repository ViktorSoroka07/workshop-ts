// https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members

abstract class PaymentMethod {
  constructor(public amount: number) {}

  // Abstract method that must be implemented by derived classes
  abstract processPayment(): void;

  // Common method for processing payment confirmation
  confirmPayment(): void {
    console.log("Payment has been confirmed.");
  }

  // Abstract method for refund logic
  abstract refund(): void;
}

// Derived class for credit card payments
class CreditCardPayment extends PaymentMethod {
  processPayment(): void {
    console.log(`Processing credit card payment of $${this.amount}...`);
    // Specific logic for credit card payments (e.g., authorization)
  }

  refund(): void {
    console.log(`Refunding credit card payment of $${this.amount}...`);
  }
}

// Derived class for PayPal payments
class PayPalPayment extends PaymentMethod {
  processPayment(): void {
    console.log(`Processing PayPal payment of $${this.amount}...`);
    // Specific logic for PayPal payments (e.g., transaction checks)
  }

  refund(): void {
    console.log(`Refunding PayPal payment of $${this.amount}...`);
  }
}
