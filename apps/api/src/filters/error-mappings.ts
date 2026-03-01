import { HttpStatus } from '@nestjs/common';
import { InvalidCredentialsError } from '../domain/errors/invalid-credentials.error';
import { UserAlreadyExistsError } from '../domain/errors/user-already-exists.error';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';

export const DOMAIN_ERROR_MAPPINGS = new Map<Function, HttpStatus>([
  [UserAlreadyExistsError, HttpStatus.CONFLICT],
  [UserNotFoundError, HttpStatus.NOT_FOUND],
  [InvalidCredentialsError, HttpStatus.UNAUTHORIZED],
]);
