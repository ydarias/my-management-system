import { UserRepository } from '../../user.repository';
import { User } from '../../models/user';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];
  private currentId = 1;

  async save(user: User): Promise<User> {
    const transientUser = {...user, id: this.currentId++, updatedAt: new Date()};
    this.users.push(transientUser);
    return transientUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async findById(id: number): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }
}
