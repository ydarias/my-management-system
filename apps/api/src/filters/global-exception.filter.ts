import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
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
        response.status(status).json({});
        return;
      }
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
  }
}
