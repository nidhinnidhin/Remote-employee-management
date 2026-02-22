import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import type { CompanyRepository } from 'src/modules/auth/domain/repositories/company.repository';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepository,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

      // Check company status if companyId is present
      if (payload.companyId && require('mongoose').isValidObjectId(payload.companyId)) {
        const company = await this.companyRepository.findById(payload.companyId);
        if (company && company.status === CompanyStatus.SUSPENDED) {
          throw new ForbiddenException(
            'Your company access has been suspended. Please contact support.',
          );
        }
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
