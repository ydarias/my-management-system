import { HttpStatus } from '@nestjs/common';
import { InvalidCredentialsError } from '../domain/errors/invalid-credentials.error';
import { UserAlreadyExistsError } from '../domain/errors/user-already-exists.error';

export const DOMAIN_ERROR_MAPPINGS = new Map<Function, HttpStatus>([
  [UserAlreadyExistsError, HttpStatus.CONFLICT],
  [InvalidCredentialsError, HttpStatus.UNAUTHORIZED],
]);
