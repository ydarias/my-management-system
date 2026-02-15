import { Module } from '@nestjs/common';
import { CreateUserUseCase } from '@repo/use-cases';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository, passwordHasher) =>
        new CreateUserUseCase(userRepository, passwordHasher),
      inject: ['UserRepository', 'PasswordHasher'],
    },
  ],
})
export class UsersModule {}
