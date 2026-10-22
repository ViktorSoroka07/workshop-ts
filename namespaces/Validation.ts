// Namespaces were TypeScript's original way to organize code (before ES modules).
// They group related code under a single global name.
// Only `export`-ed members are public — non-exported members (like `verify`) are private.

namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }

  function verify() {} // not exported — invisible outside this namespace
}
