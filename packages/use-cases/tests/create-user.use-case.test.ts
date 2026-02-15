import { CreateUserInput, CreateUserUseCase, PasswordHasher, UserAlreadyExistsError, UserRepository } from '../src';
import { InMemoryUserRepository } from '../src/repositories/in-memory/in-memory-user.repository';

const fakePasswordHasher: PasswordHasher = {
  async hash(password: string) {
    return `hashed-${password}`;
  },
  async compare(plain: string, hashed: string) {
    return hashed === `hashed-${plain}`;
  },
};

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let repository: UserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    useCase = new CreateUserUseCase(repository, fakePasswordHasher);
  });

  it('should create a new user successfully', async () => {
    const input: CreateUserInput = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'secret123',
    };

    const result = await useCase.execute(input);

    expect(result).toMatchSnapshot({
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
  });

  it('should hash the password before saving', async () => {
    const input: CreateUserInput = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'secret123',
    };

    const result = await useCase.execute(input);

    expect(result.password).toBe('hashed-secret123');
  });

  it('should throw error if user with email already exists', async () => {
    const input: CreateUserInput = {
      email: 'existing@example.com',
      name: 'Existing User',
      password: 'secret123',
    };

    await useCase.execute(input);

    await expect(useCase.execute(input)).rejects.toThrow(UserAlreadyExistsError);
  });

  it('should generate unique IDs for different users', async () => {
    const input1: CreateUserInput = {
      email: 'user1@example.com',
      name: 'User 1',
      password: 'secret123',
    };

    const input2: CreateUserInput = {
      email: 'user2@example.com',
      name: 'User 2',
      password: 'secret456',
    };

    const user1 = await useCase.execute(input1);
    const user2 = await useCase.execute(input2);

    expect(user1.id).toBe(1);
    expect(user2.id).toBe(2);
  });
});
