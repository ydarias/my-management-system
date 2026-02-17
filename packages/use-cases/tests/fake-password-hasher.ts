import { PasswordHasher } from '../src';

export const fakePasswordHasher: PasswordHasher = {
  async hash(password: string) {
    return `hashed-${password}`;
  },
  async compare(plain: string, hashed: string) {
    return hashed === `hashed-${plain}`;
  },
};
