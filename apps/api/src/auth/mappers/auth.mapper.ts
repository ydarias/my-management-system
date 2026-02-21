import { LoginResponse } from '@repo/shared';

export class AuthMapper {
  static toLoginResponse(accessToken: string): LoginResponse {
    return { accessToken };
  }
}
