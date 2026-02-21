
import { UserAlreadyExistsError } from './errors/user-already-exists.error';
import { CreateUserInput } from './models/creational/create-user.input';
import { PasswordHasher } from './ports/password-hasher';
import { UserRepository } from './repositories/user.repository';
import { User } from './models/user';

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher,
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new UserAlreadyExistsError(input.email);
    }

    const hashedPassword = await this.passwordHasher.hash(input.password);

    const today = new Date();

    const user: User = {
      email: input.email,
      name: input.name,
      password: hashedPassword,
      createdAt: today,
      updatedAt: today
    };

    return this.userRepository.save(user);
  }
}
