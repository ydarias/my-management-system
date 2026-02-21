import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '../domain/create-user.use-case';
import { CreateUserRequest, UserResponse } from '@repo/shared';
import { UserMapper } from './mappers/user.mapper';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'name', 'password'],
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'Jane Doe' },
        password: { type: 'string', example: 'secret123' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'Jane Doe' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async createUser(@Body() request: CreateUserRequest): Promise<UserResponse> {
    const user = await this.createUserUseCase.execute(UserMapper.toCreateUserInput(request));
    return UserMapper.toUserResponse(user);
  }
}
