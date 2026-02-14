import { CreateUserUseCase, UserRepository, CreateUserInput } from '../src/create-user.use-case';
import { User } from '@repo/shared';

class MockUserRepository implements UserRepository {
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

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let repository: MockUserRepository;

  beforeEach(() => {
    repository = new MockUserRepository();
    useCase = new CreateUserUseCase(repository);
  });

  afterEach(() => {
    repository.reset();
  });

  it('should create a new user successfully', async () => {
    const input: CreateUserInput = {
      email: 'test@example.com',
      name: 'Test User',
    };

    const result = await useCase.execute(input);

    expect(result).toHaveProperty('id');
    expect(result.email).toBe(input.email);
    expect(result.name).toBe(input.name);
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('should throw error if user with email already exists', async () => {
    const input: CreateUserInput = {
      email: 'existing@example.com',
      name: 'Existing User',
    };

    await useCase.execute(input);

    await expect(useCase.execute(input)).rejects.toThrow(
      'User with this email already exists'
    );
  });

  it('should generate unique IDs for different users', async () => {
    const input1: CreateUserInput = {
      email: 'user1@example.com',
      name: 'User 1',
    };

    const input2: CreateUserInput = {
      email: 'user2@example.com',
      name: 'User 2',
    };

    const user1 = await useCase.execute(input1);
    const user2 = await useCase.execute(input2);

    expect(user1.id).not.toBe(user2.id);
  });
});
