import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@repo/shared';
import { DOMAIN_ERROR_MAPPINGS } from './error-mappings';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    for (const [ErrorClass, status] of DOMAIN_ERROR_MAPPINGS) {
      if (exception instanceof ErrorClass) {
        const body: ApiResponse<null> = {
          success: false,
          error: exception.constructor.name,
          message: (exception as Error).message,
        };
        response.status(status).json(body);
        return;
      }
    }

    // TODO not sure about using this ApiResponse construct
    const body: ApiResponse<null> = {
      success: false,
      error: 'InternalServerError',
      message: 'An unexpected error occurred',
    };
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
  }
}
