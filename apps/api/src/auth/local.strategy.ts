import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ValidateCredentialsUseCase } from '@repo/use-cases';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(ValidateCredentialsUseCase)
    private readonly validateCredentials: ValidateCredentialsUseCase,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    return this.validateCredentials.execute(email, password);
  }
}
