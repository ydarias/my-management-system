import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User, ValidateCredentialsUseCase } from '@repo/use-cases';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ValidateCredentialsUseCase)
    private readonly validateCredentials: ValidateCredentialsUseCase,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    return this.validateCredentials.execute(email, password);
  }
}
