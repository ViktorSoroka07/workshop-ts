// Same name, imported through the root barrel (loading/index.ts): billing loads too, and
// this file never uses it. Run it the way viaFeatureBarrel.ts is run; node prints:
//   loading auth/authService.ts
//   loading billing/invoice.ts
//   importing from ./index
//   token-for-jane
import { AuthService } from './index';

console.log('importing from ./index');
console.log(new AuthService().login('jane'));
