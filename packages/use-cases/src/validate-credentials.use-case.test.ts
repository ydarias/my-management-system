import { mock, mockReset } from 'jest-mock-extended';
import { UserRepository } from './user.repository';
import { PasswordHasher } from './ports/password-hasher';
import { ValidateCredentialsUseCase } from './validate-credentials.use-case';
import { InvalidCredentialsError } from './errors/invalid-credentials.error';
import { User } from './models/user';

const userRepository = mock<UserRepository>();
const passwordHasher = mock<PasswordHasher>();
const useCase = new ValidateCredentialsUseCase(userRepository, passwordHasher);

beforeEach(() => {
  mockReset(userRepository);
  mockReset(passwordHasher);
});

describe('ValidateCredentialsUseCase', () => {
  const existingUser: User = {
    id: 1,
    email: 'john@example.com',
    name: 'John Doe',
    password: 'hashed-secret123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('returns user when credentials are valid', async () => {
    userRepository.findByEmail.calledWith('john@example.com').mockResolvedValue(existingUser);
    passwordHasher.compare.calledWith('secret123', existingUser.password).mockResolvedValue(true);

    const result = await useCase.execute('john@example.com', 'secret123');

    expect(result).toMatchSnapshot({
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('throws InvalidCredentialsError when email is unknown', async () => {
    userRepository.findByEmail.calledWith('unknown@example.com').mockResolvedValue(null);

    await expect(useCase.execute('unknown@example.com', 'secret123'))
      .rejects.toThrow(InvalidCredentialsError);
  });

  it('throws InvalidCredentialsError when password is wrong', async () => {
    userRepository.findByEmail.calledWith('john@example.com').mockResolvedValue(existingUser);
    passwordHasher.compare.calledWith('wrongpassword', existingUser.password).mockResolvedValue(false);

    await expect(useCase.execute('john@example.com', 'wrongpassword'))
      .rejects.toThrow(InvalidCredentialsError);
  });
});
