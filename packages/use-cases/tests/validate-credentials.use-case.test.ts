import { CreateUserUseCase, InvalidCredentialsError, ValidateCredentialsUseCase } from '../src';
import { InMemoryUserRepository } from '../src';
import { fakePasswordHasher } from './fake-password-hasher';

describe('ValidateCredentialsUseCase', () => {
  let useCase: ValidateCredentialsUseCase;
  let repository: InMemoryUserRepository;

  beforeEach(async () => {
    repository = new InMemoryUserRepository();
    useCase = new ValidateCredentialsUseCase(repository, fakePasswordHasher);

    const createUser = new CreateUserUseCase(repository, fakePasswordHasher);
    await createUser.execute({ email: 'john@example.com', name: 'John Doe', password: 'secret123' });
  });

  it('should return the user when credentials are valid', async () => {
    const user = await useCase.execute('john@example.com', 'secret123');

    expect(user).toEqual(
      expect.objectContaining({
        email: 'john@example.com',
        name: 'John Doe',
      }),
    );
  });

  it('should throw InvalidCredentialsError when email does not exist', async () => {
    await expect(useCase.execute('unknown@example.com', 'secret123')).rejects.toThrow(InvalidCredentialsError);
  });

  it('should throw InvalidCredentialsError when password is wrong', async () => {
    await expect(useCase.execute('john@example.com', 'wrongpassword')).rejects.toThrow(InvalidCredentialsError);
  });
});
