import { auth } from '../lib/firebase/config';
import { signIn, signUp, signOut } from '../lib/firebase/auth';
import type { User } from '../types';

export class AuthService {
  static async login(email: string, password: string): Promise<User> {
    return signIn(email, password);
  }

  static async register(email: string, password: string, name: string, role: User['role'] = 'member'): Promise<User> {
    return signUp(email, password, name, role);
  }

  static async logout(): Promise<void> {
    return signOut();
  }

  static getCurrentUser() {
    return auth.currentUser;
  }
}