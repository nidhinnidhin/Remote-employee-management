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
import { isValidObjectId } from 'mongoose';

import type { ICompanyRepository } from 'src/modules/auth/domain/repositories/icompany.repository';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { ACCESS_TOKEN_COOKIE_NAME } from '../config/cookies.config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('ICompanyRepository')
    private readonly _companyRepository: ICompanyRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    let token = request.cookies?.[ACCESS_TOKEN_COOKIE_NAME];

    if (!token) {
      const authHeader = request.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
        userId: string;
        role?: string;
        companyId?: string;
      };

      request.user = {
        userId: payload.userId,
        role: payload.role,
        companyId: payload.companyId,
      };

      if (payload.companyId && isValidObjectId(payload.companyId)) {
        const company = await this._companyRepository.findById(
          payload.companyId,
        );

        if (company?.status === CompanyStatus.SUSPENDED) {
          throw new ForbiddenException(
            'Your company access has been suspended.',
          );
        }
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}