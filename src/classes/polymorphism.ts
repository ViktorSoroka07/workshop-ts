export class SupportTicket {
  constructor(
    public ticketId: string,
    public customerName: string,
  ) {}

  resolve(): void {
    console.log("Ticket resolved in a generic way.");
  }
}

// Derived class for technical issues
export class TechnicalIssueTicket extends SupportTicket {
  resolve(): void {
    console.log(`Resolving technical issue for ticket ${this.ticketId}...`);
    // Specific resolution logic for technical issues
  }

  // Additional behavior for technical issues
  escalate() {
    console.log("Escalating to the technical team...");
  }
}

export class BillingIssueTicket extends SupportTicket {
  resolve(): void {
    console.log(`Resolving billing issue for ticket ${this.ticketId}...`);
    // Specific resolution logic for billing issues
  }

  // Additional behavior for billing issues
  refund() {
    console.log("Issuing a refund...");
  }
}

export class GeneralInquiryTicket extends SupportTicket {
  resolve(): void {
    console.log(`Resolving general inquiry for ticket ${this.ticketId}...`);
    // Specific resolution logic for general inquiries
  }

  // Additional behavior for general inquiries
  forwardToHR() {
    console.log("Forwarding to HR department...");
  }
}

// Example usage
const tickets: SupportTicket[] = [
  new TechnicalIssueTicket("T123", "Alice"),
  new BillingIssueTicket("B456", "Bob"),
  new GeneralInquiryTicket("G789", "Charlie"),
];

tickets.forEach((ticket) => {
  ticket.resolve(); // Polymorphic resolve behavior

  // Specific behavior based on the type
  if (ticket instanceof TechnicalIssueTicket) {
    ticket.escalate();
  } else if (ticket instanceof BillingIssueTicket) {
    ticket.refund();
  } else if (ticket instanceof GeneralInquiryTicket) {
    ticket.forwardToHR();
  }
});
