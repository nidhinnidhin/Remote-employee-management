// src/common/response/response.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponseModel } from './response.model';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();
    const path = request.url;

    return next.handle().pipe(
      map((data) => {
        // 1. If data is already in IApiResponse format, return as is
        if (data && typeof data === 'object' && 'success' in data && 'message' in data) {
          return data;
        }

        // 2. Skip wrapping for AUTH responses (backward compatibility)
        if (data?.accessToken || data?.refreshToken || data?.user) {
          return data;
        }

        // 3. Wrap success response using the explicit model
        const statusCode = response.statusCode || 200;
        return new ApiResponseModel(data, 'Request successful', statusCode, { path });
      }),
    );
  }
}
