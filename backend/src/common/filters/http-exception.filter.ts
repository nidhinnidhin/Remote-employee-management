// src/common/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiErrorModel } from '../response/response.model';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let errors: unknown = null;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const res = exceptionResponse as any;
        message = res.message || message;
        errors = res.errors || null;
        
        // If message is an array (default Nest validation), set it as errors
        if (Array.isArray(res.message)) {
          message = 'Validation failed';
          errors = res.message;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }


    response.status(status).json(
      new ApiErrorModel(message, status, errors, {
        path: request.url,
        requestId: request.headers['x-request-id'] as string,
      }),
    );
  }
}