import { Global, Module } from '@nestjs/common';
import { InMemoryUserRepository } from '@repo/use-cases';
import { AuthModule } from './auth/auth.module';
import { BcryptPasswordHasher } from './auth/bcrypt-password-hasher';
import { UsersModule } from './users/users.module';

// TODO not sure if I want to make them global
@Global()
@Module({
  imports: [UsersModule, AuthModule],
  providers: [
    {
      provide: 'UserRepository',
      useClass: InMemoryUserRepository,
    },
    {
      provide: 'PasswordHasher',
      useClass: BcryptPasswordHasher,
    },
  ],
  exports: ['UserRepository', 'PasswordHasher'],
})
export class AppModule {}
