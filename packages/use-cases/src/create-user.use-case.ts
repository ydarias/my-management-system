
import { UserAlreadyExistsError } from './errors/user-already-exists.error';
import { CreateUserInput } from './models/creational/create-user.input';
import { UserRepository } from './repositories/user.repository';
import { User } from './models/user';

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new UserAlreadyExistsError(input.email);
    }

    const user: User = {
      email: input.email,
      name: input.name,
      createdAt: new Date(),
    };

    return this.userRepository.save(user);
  }
}
