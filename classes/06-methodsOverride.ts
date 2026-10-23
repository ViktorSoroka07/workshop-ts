// =============================================================================
// Method Override and the `override` Keyword
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noImplicitOverride

// The `override` keyword explicitly marks a method as overriding a parent method, and
// the compiler checks that claim: a typo in the name is an error. With the
// `noImplicitOverride` tsconfig flag the keyword is also mandatory, so overriding a
// method WITHOUT it is an error too — which catches accidental overrides.

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

  // `override` — required by `noImplicitOverride`, which this folder's tsconfig.json turns on.
  // 🧪 Try it: delete the keyword below and TypeScript reports
  // "This member must have an 'override' modifier because it overrides a member in the base class 'NotificationService'."
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

// What the keyword buys: without `override`, a typo in the name is not an error. `sned` is
// just a new method, and `send()` silently keeps the parent's version:
class SlackNotification extends NotificationService {
  sned(): string {
    return `Slack to ${this.recipient}: ${this.message}`;
  }
}

const slack = new SlackNotification('dev@example.com', 'Deploy failed');

console.log(slack.send()); // Notification to dev@example.com: Deploy failed -- not the Slack text

// With `override` the same typo is an error, whatever `noImplicitOverride` says: the keyword
// is a claim that the parent has this method, and the compiler checks the claim.
// (The flag only makes the keyword mandatory -- the 🧪 above.)
class TeamsNotification extends NotificationService {
  // @ts-expect-error
  override sned(): string {
    // Error: This member cannot have an 'override' modifier because it is not declared in the base class 'NotificationService'.
    return `Teams to ${this.recipient}: ${this.message}`;
  }
}
