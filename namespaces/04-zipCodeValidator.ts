// =============================================================================
// One Namespace Across Several Files (3/4): ZipCodeValidator
// =============================================================================

/// <reference path="02-validationInterface.ts" />
namespace Validation {
  const numberRegexp = /^[0-9]+$/;

  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}
