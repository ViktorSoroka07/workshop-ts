// =============================================================================
// noFallthroughCasesInSwitch
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noFallthroughCasesInSwitch

// Errors when a `case` that has code ends without `break`, `return` or `throw`, so
// execution runs on into the next case. NOT part of `strict`: switch it on separately.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

type Action = 'create' | 'update' | 'delete';

function handle(action: Action) {
  switch (action) {
    // @ts-expect-error
    case 'create': // Error: Fallthrough case in switch.
      console.log('creating...');
    // no `break`: execution continues into 'update'
    case 'update':
      console.log('updating...');
      break;
    case 'delete':
      console.log('deleting...');
      break;
  }
}

handle('create'); // creating... then updating...

// Fix: end the case with `break`, `return` or `throw`
function handleFixed(action: Action) {
  switch (action) {
    case 'create':
      console.log('creating...');
      break;
    case 'update':
      console.log('updating...');
      break;
    case 'delete':
      console.log('deleting...');
      break;
  }
}

// ---------------------------------------------------------------------------
// Empty cases are still allowed
// ---------------------------------------------------------------------------

// A case with no code of its own groups labels on purpose:
function group(action: Action): string {
  switch (action) {
    case 'create':
    case 'update': // OK -- 'create' has no code, so it shares this case's body
      return 'mutating';
    case 'delete':
      return 'destructive';
  }
}

// ✅ Best practice: when two cases share work that has code in it, move the work into a
// function and call it from both, so every case ends on its own.

console.log(group('create')); // mutating
console.log(handleFixed);
