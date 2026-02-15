import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUserUseCase, CreateUserInput } from '@repo/use-cases';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  // TODO use mapping to avoid returning data that should not be returned
  @Post()
  async createUser(@Body() input: CreateUserInput) {
    const { password, ...user } = await this.createUserUseCase.execute(input);
    return user;
  }
}
