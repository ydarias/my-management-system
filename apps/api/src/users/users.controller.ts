import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUserUseCase, CreateUserInput } from '@repo/use-cases';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post()
  async createUser(@Body() input: CreateUserInput) {
    return await this.createUserUseCase.execute(input);
  }
}
