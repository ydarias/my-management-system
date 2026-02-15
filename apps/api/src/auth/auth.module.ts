import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ValidateCredentialsUseCase } from '@repo/use-cases';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'super-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: ValidateCredentialsUseCase,
      useFactory: (userRepository, passwordHasher) =>
        new ValidateCredentialsUseCase(userRepository, passwordHasher),
      inject: ['UserRepository', 'PasswordHasher'],
    },
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [JwtModule],
})
export class AuthModule {}
