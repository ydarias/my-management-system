import { Module } from '@nestjs/common';
import { CreateUserUseCase } from '../domain/create-user.use-case';
import { PasswordHasher } from '../domain/ports/password-hasher';
import { UserRepository } from '../domain/repositories/user.repository';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository: UserRepository, passwordHasher: PasswordHasher) =>
        new CreateUserUseCase(userRepository, passwordHasher),
      inject: ['UserRepository', 'PasswordHasher'],
    },
  ],
})
export class UsersModule {}
