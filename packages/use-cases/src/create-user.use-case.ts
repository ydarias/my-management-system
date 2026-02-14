import { User } from '@repo/shared';

export interface CreateUserInput {
  email: string;
  name: string;
}

export interface UserRepository {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user: User = {
      id: this.generateId(),
      email: input.email,
      name: input.name,
      createdAt: new Date(),
    };

    return this.userRepository.save(user);
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
