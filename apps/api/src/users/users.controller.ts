import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../domain/create-user.use-case';
import { CreateUserRequest, UserResponse } from '@repo/shared';
import { UserMapper } from './mappers/user.mapper';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post()
  async createUser(@Body() request: CreateUserRequest): Promise<UserResponse> {
    const user = await this.createUserUseCase.execute(UserMapper.toCreateUserInput(request));
    return UserMapper.toUserResponse(user);
  }
}
