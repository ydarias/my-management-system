import { CreateUserInput, CreateUserUseCase, UserAlreadyExistsError, UserRepository } from '../src';
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

    expect(result).toMatchSnapshot({
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date)
    });
  });

  it('should throw error if user with email already exists', async () => {
    const input: CreateUserInput = {
      email: 'existing@example.com',
      name: 'Existing User',
    };

    await useCase.execute(input);

    await expect(useCase.execute(input)).rejects.toThrow(UserAlreadyExistsError);
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

    expect(user1.id).toBe(1);
    expect(user2.id).toBe(2);
  });
});
