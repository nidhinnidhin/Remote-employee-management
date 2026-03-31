// src/common/filters/http-exception.filter.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiResponse } from '../response/api-response.util';

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

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : null;

    // Handle common NestJS error structures
    let message = 'Internal server error';
    let errors: unknown = null;

    interface ExceptionResponse {
      message?: string | string[];
      errors?: unknown;
    }

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const response = exceptionResponse as ExceptionResponse;
      message = (Array.isArray(response.message) ? response.message[0] : response.message) || message;
      errors = response.errors || exceptionResponse;
    }

    // Special handling for validation errors (usually an array in 'message')
    if (status === HttpStatus.BAD_REQUEST && Array.isArray((exceptionResponse as ExceptionResponse)?.message)) {
      message = 'Validation failed';
      errors = (exceptionResponse as ExceptionResponse).message;
    }

    response.status(status).json(
      ApiResponse.error(message, errors, {
        path: request.url,
        requestId: request.headers['x-request-id'] as string,
      }),
    );
  }
}