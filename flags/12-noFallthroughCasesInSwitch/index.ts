// =============================================================================
// noFallthroughCasesInSwitch
// =============================================================================
// https://www.typescriptlang.org/tsconfig/#noFallthroughCasesInSwitch

// Errors when a switch case has code but no `break`, `return`, or `throw` —
// preventing accidental fallthrough into the next case.

// ---------------------------------------------------------------------------
// The problem it catches
// ---------------------------------------------------------------------------

type Action = 'create' | 'update' | 'delete';

function handle(action: Action) {
  switch (action) {
    // @ts-expect-error
    case 'create': // ❌ Fallthrough case in switch
      console.log('creating...');
    // forgot `break` — falls through to 'update'
    case 'update':
      console.log('updating...');
      break;
    case 'delete':
      console.log('deleting...');
      break;
  }
}

handle('create');

// ---------------------------------------------------------------------------
// Fix: add `break`, `return`, or `throw`
// ---------------------------------------------------------------------------

function handleFixed(action: Action) {
  switch (action) {
    case 'create':
      console.log('creating...');
      break; // ✅
    case 'update':
      console.log('updating...');
      break;
    case 'delete':
      console.log('deleting...');
      break;
  }
}

// ---------------------------------------------------------------------------
// Empty cases are still allowed (intentional fallthrough)
// ---------------------------------------------------------------------------

function group(action: Action): string {
  switch (action) {
    case 'create':
    case 'update':
      // ✅ no error — empty case explicitly groups labels
      return 'mutating';
    case 'delete':
      return 'destructive';
  }
}

console.log(group('create'));
console.log(handleFixed);
