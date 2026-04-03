// =============================================================================
// Method Override and the `override` Keyword
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noImplicitOverride

// The `override` keyword explicitly marks a method as overriding a parent method.
// Combined with the `noImplicitOverride` tsconfig flag, TypeScript will error if
// you override a method WITHOUT the keyword — catching typos and accidental
// overrides at compile time.

export class NotificationService {
  constructor(
    public readonly recipient: string,
    public readonly message: string
  ) {}

  send(): string {
    return `Notification to ${this.recipient}: ${this.message}`;
  }
}

export class EmailNotification extends NotificationService {
  private subject: string;

  constructor(recipient: string, subject: string, message: string) {
    super(recipient, message);

    this.subject = subject;
  }

  // `override` — required by `noImplicitOverride`. Without it, TypeScript errors:
  // "This member must have an 'override' modifier because it overrides a member in the base class"
  override send(): string {
    return `Email to ${this.recipient} [${this.subject}]: ${this.message}`;
  }
}

const email = new EmailNotification(
  'dev@example.com',
  'Deploy failed',
  'Build #412 failed on main'
);

console.log(email.send()); // Email to dev@example.com [Deploy failed]: Build #412 failed on main
