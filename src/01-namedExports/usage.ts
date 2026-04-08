// Consumers pick exactly what they need by name:
import { ApiResponse, buildUrl, API_VERSION } from './api';

// Renaming on the import side to avoid local naming conflicts:
import { buildUrl as createUrl } from './api';

// Namespace import — grabs everything under a single object.
// Tree-shaking (bundler's ability to drop unused exports from the final bundle)
// works fine with namespace imports in modern bundlers (webpack 5, Rollup, Vite),
// but it's worth verifying with your specific bundler config if bundle size matters:
import * as Api from './api';

const url = buildUrl('https://api.example.com', '/users');
console.log(`${API_VERSION}: ${url}`);

// Renamed import — same function, different local name:
const anotherUrl = createUrl('https://api.example.com', '/health');
console.log(anotherUrl);

// Namespace import — access exports as properties:
console.log(Api.MAX_RETRIES); // 3
console.log(Api.buildUrl('https://api.example.com', '/orders'));

// Renamed exports are also accessible:
console.log(Api.TIMEOUT); // 5000 (same value as Api.DEFAULT_TIMEOUT)

const response: ApiResponse<{ id: string }> = {
  data: { id: '1' },
  status: 200,
  message: 'OK',
};
console.log(response);
