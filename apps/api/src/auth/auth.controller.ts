import { Controller, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../domain/models/user';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from '@repo/shared';
import { AuthMapper } from './mappers/auth.mapper';

@Controller('auth')
export class AuthController {
  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: { user: User }): Promise<LoginResponse> {
    const payload = { email: req.user.email, sub: req.user.id };
    return AuthMapper.toLoginResponse(this.jwtService.sign(payload));
  }
}
