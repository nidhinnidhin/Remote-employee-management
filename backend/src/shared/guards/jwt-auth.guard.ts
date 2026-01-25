import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Read cookie
    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      // Verify JWT
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
        userId: string;
      };

      // Attach user info to request
      request.user = {
        userId: payload.userId,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
