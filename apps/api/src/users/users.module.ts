import { Module } from '@nestjs/common';
import { CreateUserUseCase, PasswordHasher, UserRepository } from '@repo/use-cases';
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
