import { mock, mockReset } from 'jest-mock-extended';
import { CreateUserInput } from './models/creational/create-user.input';
import { CreateUserUseCase } from './create-user.use-case';
import { PasswordHasher } from './ports/password-hasher';
import { User } from './models/user';
import { UserAlreadyExistsError } from './errors/user-already-exists.error';
import { UserRepository } from './repositories/user.repository';

describe('CreateUserUseCase', () => {
  const userRepository = mock<UserRepository>();
  const passwordHasher = mock<PasswordHasher>();
  const useCase = new CreateUserUseCase(userRepository, passwordHasher);

  beforeEach(() => {
    mockReset(userRepository);
    mockReset(passwordHasher);
  });

  it('should create a new user successfully', async () => {
    const input: CreateUserInput = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'secret123',
    };
    const hashedSecret = 'hashed-secret123';
    const transientUser: User = {
      email: input.email,
      name: input.name,
      password: hashedSecret,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };
    const persistentUser: User = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      password: hashedSecret,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userRepository.findByEmail.calledWith(input.email).mockResolvedValue(null);
    passwordHasher.hash.calledWith(input.password).mockResolvedValue(hashedSecret);
    userRepository.save.calledWith(expect.objectContaining(transientUser)).mockResolvedValue(persistentUser);

    const result = await useCase.execute(input);

    expect(result).toMatchSnapshot({
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should throw error if user with email already exists', async () => {
    const input: CreateUserInput = {
      email: 'existing@example.com',
      name: 'Existing User',
      password: 'secret123',
    };
    const hashedSecret = 'hashed-secret123';
    const persistentUser: User = {
      id: 1,
      email: 'existing@example.com',
      name: 'Existing User',
      password: hashedSecret,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userRepository.findByEmail.calledWith(input.email).mockResolvedValue(persistentUser);

    await expect(useCase.execute(input)).rejects.toThrow(UserAlreadyExistsError);
  });
});
