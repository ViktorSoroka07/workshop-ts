export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const ONE_HOUR = 60 * 60 * 1000; // in milliseconds

export class AuthService {
  private token: AuthToken | null = null;

  login(username: string, password: string): AuthToken {
    console.log(`Authenticating ${username}...`);
    this.token = {
      accessToken: 'eyJhbG...',
      refreshToken: 'dGhpcyBpcyBhIHJlZnJlc2g...',
      expiresAt: Date.now() + ONE_HOUR,
    };

    return this.token;
  }

  logout(): void {
    this.token = null;
    console.log('Logged out');
  }

  isAuthenticated(): boolean {
    return this.token !== null && this.token.expiresAt > Date.now();
  }
}
