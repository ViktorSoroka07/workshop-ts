// =============================================================================
// Polymorphism and `instanceof` Narrowing
// =============================================================================

// Polymorphism allows derived classes to provide their own implementation of a
// method defined in the base class. When you have a collection typed as the base
// class, each element's overridden method is called — the correct behavior is
// resolved at runtime.

export class SupportTicket {
  constructor(
    public ticketId: string,
    public customerName: string
  ) {}

  resolve(): void {
    console.log('Ticket resolved in a generic way.');
  }
}

// Each subclass provides its own `resolve()` — same method signature, different behavior:

export class TechnicalIssueTicket extends SupportTicket {
  override resolve(): void {
    console.log(`Resolving technical issue for ticket ${this.ticketId}...`);
  }

  escalate() {
    console.log('Escalating to the technical team...');
  }
}

export class BillingIssueTicket extends SupportTicket {
  override resolve(): void {
    console.log(`Resolving billing issue for ticket ${this.ticketId}...`);
  }

  refund() {
    console.log('Issuing a refund...');
  }
}

export class GeneralInquiryTicket extends SupportTicket {
  override resolve(): void {
    console.log(`Resolving general inquiry for ticket ${this.ticketId}...`);
  }

  forwardToHR() {
    console.log('Forwarding to HR department...');
  }
}

// All tickets are typed as `SupportTicket`, but each calls its own `resolve()`:
const tickets: SupportTicket[] = [
  new TechnicalIssueTicket('T123', 'Alice'),
  new BillingIssueTicket('B456', 'Bob'),
  new GeneralInquiryTicket('G789', 'Charlie'),
];

tickets.forEach((ticket) => {
  ticket.resolve(); // Polymorphic — calls the subclass implementation

  // `instanceof` narrows the type within the block, giving access to
  // subclass-specific methods with full type safety:
  if (ticket instanceof TechnicalIssueTicket) {
    ticket.escalate();
  } else if (ticket instanceof BillingIssueTicket) {
    ticket.refund();
  } else if (ticket instanceof GeneralInquiryTicket) {
    ticket.forwardToHR();
  }
});
