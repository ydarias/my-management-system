import { InvalidCredentialsError } from './errors/invalid-credentials.error';
import { User } from './models/user';
import { PasswordHasher } from './ports/password-hasher';
import { UserRepository } from './repositories/user.repository';

export class ValidateCredentialsUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValid = await this.passwordHasher.compare(password, user.password);

    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    return user;
  }
}
