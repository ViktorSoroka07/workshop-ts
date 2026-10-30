// Import from the feature's own barrel: only that feature loads. All imports run before
// the file's own code, which is why the "loading" line prints first. Compiled and run in
// node, this prints:
//   loading auth/authService.ts
//   importing from ./auth
//   token-for-jane
import { AuthService } from './auth';

console.log('importing from ./auth');
console.log(new AuthService().login('jane'));
