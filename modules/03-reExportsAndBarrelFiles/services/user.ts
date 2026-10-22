export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export class UserService {
  async getProfile(userId: string): Promise<UserProfile> {
    console.log(`Fetching profile for ${userId}...`);
    return {
      id: userId,
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'admin',
    };
  }

  async updateProfile(
    userId: string,
    updates: Partial<Pick<UserProfile, 'name' | 'email'>>
  ): Promise<UserProfile> {
    console.log(`Updating profile ${userId}:`, updates);
    return { id: userId, name: 'Jane Doe', email: 'jane@example.com', role: 'admin', ...updates };
  }
}
