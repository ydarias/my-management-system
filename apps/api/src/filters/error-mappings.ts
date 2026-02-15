import { HttpStatus } from '@nestjs/common';
import { UserAlreadyExistsError } from '@repo/use-cases';

export const DOMAIN_ERROR_MAPPINGS = new Map<Function, HttpStatus>([
  [UserAlreadyExistsError, HttpStatus.CONFLICT],
]);
