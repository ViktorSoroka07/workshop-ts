console.log('  loading auth/authService.ts');

export class AuthService {
  login(username: string): string {
    return `token-for-${username}`;
  }
}
