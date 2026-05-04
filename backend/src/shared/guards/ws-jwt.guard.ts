// src/shared/guards/ws-jwt.guard.ts
import { CanActivate, ExecutionContext, Injectable, Inject, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { WsException } from '@nestjs/websockets';
import { AuthenticatedSocket } from '../types/socket/socket.types';
import type { ICompanyRepository } from 'src/modules/auth/domain/repositories/icompany.repository';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(
    @Inject('ICompanyRepository')
    private readonly _companyRepository: ICompanyRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: AuthenticatedSocket = context.switchToWs().getClient();
      const token = this.extractToken(client);

      if (!token) {
        throw new WsException('Authentication required');
      }

      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
        userId: string;
        role: string;
        companyId: string;
      };

      // Verify company status
      if (payload.companyId) {
        const company = await this._companyRepository.findById(payload.companyId);
        if (company?.status === CompanyStatus.SUSPENDED) {
          throw new WsException('Your company access has been suspended.');
        }
      }

      client.user = {
        userId: payload.userId,
        role: payload.role,
        companyId: payload.companyId,
      };

      return true;
    } catch (error) {
      this.logger.error(`WS Authentication failed: ${error.message}`);
      throw new WsException('Invalid or expired token');
    }
  }

  private extractToken(client: AuthenticatedSocket): string | undefined {
    // Check auth object (standard for socket.io v4+)
    if (client.handshake.auth?.token) {
      return client.handshake.auth.token;
    }
    
    // Check authorization header
    const authHeader = client.handshake.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    return undefined;
  }
}
