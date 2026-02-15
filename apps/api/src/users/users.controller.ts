import { Body, Controller, HttpException, HttpStatus, Inject, Post } from '@nestjs/common';
import { CreateUserUseCase, CreateUserInput, UserAlreadyExistsError } from '@repo/use-cases';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post()
  async createUser(@Body() input: CreateUserInput) {
    try {
      return await this.createUserUseCase.execute(input);
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw error;
    }
  }
}
