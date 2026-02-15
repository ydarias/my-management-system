import { CreateUserUseCase } from '../src/create-user.use-case';
import { CreateUserInput, UserRepository } from '../src';
import { InMemoryUserRepository } from '../src/repositories/in-memory/in-memory-user.repository';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let repository: UserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    useCase = new CreateUserUseCase(repository);
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

    await expect(useCase.execute(input)).rejects.toThrow('User with this email already exists');
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
