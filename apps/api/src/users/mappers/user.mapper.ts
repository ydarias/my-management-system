import { CreateUserRequest, UserResponse } from '@repo/shared';
import { CreateUserInput } from '../../domain/models/creational/create-user.input';
import { User } from '../../domain/models/user';

export class UserMapper {
  static toCreateUserInput(request: CreateUserRequest): CreateUserInput {
    return {
      email: request.email,
      name: request.name,
      password: request.password,
    };
  }

  static toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
