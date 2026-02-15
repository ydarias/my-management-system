import { Controller, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { ValidateCredentialsUseCase } from '@repo/use-cases';
import { UserLoginRequest } from '@repo/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly jwtService: JwtService, @Inject(ValidateCredentialsUseCase) private readonly validateCredentialsUseCase: ValidateCredentialsUseCase) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() user: UserLoginRequest) {
    const persistentUser = await this.validateCredentialsUseCase.execute(user.email, user.password);
    const payload = { email: user.email, name: persistentUser.name, sub: persistentUser.id };

    return { access_token: this.jwtService.sign(payload) };
  }
}
