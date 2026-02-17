import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUserUseCase, CreateUserInput } from '@repo/use-cases';
import { UserResponse } from '@repo/shared';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post()
  async createUser(@Body() input: CreateUserInput): Promise<UserResponse> {
    const { password, ...user } = await this.createUserUseCase.execute(input);
    return user;
  }
}
