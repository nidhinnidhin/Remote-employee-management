// src/common/response/response.interceptor.ts

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponse } from './api-response.util';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    return next.handle().pipe(
      map((data) => {
        // ✅ 1. Skip if already formatted
        if (data?.success !== undefined) {
          return data;
        }

        // ✅ 2. Skip wrapping for AUTH responses (CRITICAL FIX)
        // This maintains 100% backward compatibility for auth flows
        if (data?.accessToken || data?.refreshToken || data?.user) {
          return data;
        }

        // ✅ 3. Skip if message-only response (logout etc.)
        if (data?.message && Object.keys(data).length === 1) {
          return data;
        }

        // ✅ DEFAULT WRAP using standardized utility
        return ApiResponse.success(data, 'Request successful', { path });
      }),
    );
  }
}
