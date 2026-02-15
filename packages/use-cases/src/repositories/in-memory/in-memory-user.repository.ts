import { UserRepository } from '../user.repository';
import { User } from '../../models/user';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  reset() {
    this.users = [];
  }
}
