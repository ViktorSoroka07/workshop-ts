// =============================================================================
// One Namespace Across Several Files (2/4): LettersOnlyValidator
// =============================================================================

// Tells the compiler this file builds on 02-validationInterface.ts (see 05- for why it matters):
/// <reference path="02-validationInterface.ts" />
namespace Validation {
  const lettersRegexp = /^[A-Za-z]+$/;

  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}
