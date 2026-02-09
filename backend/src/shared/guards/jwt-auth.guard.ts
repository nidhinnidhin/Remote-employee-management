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

    // Check for token in Authorization header (Bearer token) or cookie
    let token = request.cookies?.access_token;

    if (!token) {
      const authHeader = request.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7); // Remove 'Bearer ' prefix
      }
    }

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      // Verify JWT
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
        userId: string;
        role?: string;
        companyId?: string;
      };

      // Attach user info to request (include role and companyId for guards)
      request.user = {
        userId: payload.userId,
        role: payload.role,
        companyId: payload.companyId,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
