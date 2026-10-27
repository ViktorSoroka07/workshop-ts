// Import exactly the names you need, in braces (`type` marks a name used only as a type --
// lesson 04):
import { type ApiResponse, buildUrl, API_VERSION } from './api';

// `as` renames on the way in -- useful when a local name is already taken:
import { buildUrl as createUrl } from './api';

// `import * as` collects every export of the module into one object:
import * as Api from './api';

const url = buildUrl('https://api.example.com', '/users');
console.log(`${API_VERSION}: ${url}`); // v2: https://api.example.com/users

console.log(createUrl('https://api.example.com', '/health')); // https://api.example.com/health

// The namespace object exposes every export as a property:
console.log(Api.MAX_RETRIES); // 3
console.log(Api.buildUrl('https://api.example.com', '/orders')); // https://api.example.com/orders
console.log(Api.TIMEOUT === Api.DEFAULT_TIMEOUT); // true -- one binding, two names

// ⚠️ Gotcha: `import * as Api` is a read-only view of the module, not a copy you can patch:
// @ts-expect-error
Api.MAX_RETRIES = 10; // Error: Cannot assign to 'MAX_RETRIES' because it is a read-only property.

// ⚠️ Gotcha: a name without `export` cannot be imported, even though it sits in the file:
// @ts-expect-error
import { INTERNAL_BASE_URL } from './api'; // Error: Module '"./api"' declares 'INTERNAL_BASE_URL' locally, but it is not exported.

// The `import * as` form is the module object, not the `namespace` keyword -- that
// older TypeScript feature has its own lesson in ../../namespaces/.

// 🧪 Try it: type `Api.` and read the completion list: every value the module exports,
// `TIMEOUT` included, and no `ApiResponse`, because a type is not a property of the module
// object. (05-dynamicImports shows the module itself as a type, `typeof import('./heavy')`.)

const response: ApiResponse<{ id: string }> = {
  data: { id: '1' },
  status: 200,
  message: 'OK',
};

console.log(response); // { data: { id: '1' }, status: 200, message: 'OK' }
