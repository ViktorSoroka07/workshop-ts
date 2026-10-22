// =============================================================================
// One Namespace Across Several Files (1/4): the Shared Interface
// =============================================================================
// Files 02- to 05- build one `Validation` namespace out of three files, the way
// pre-module projects split a namespace. Each file reopens `Validation` and adds to it.

namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }

  function verify() {} // not exported -- invisible outside this block, even to the other files
}
