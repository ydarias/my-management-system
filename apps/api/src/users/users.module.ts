import { Module } from '@nestjs/common';
import { CreateUserUseCase, InMemoryUserRepository } from '@repo/use-cases';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: InMemoryUserRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository) => new CreateUserUseCase(userRepository),
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
