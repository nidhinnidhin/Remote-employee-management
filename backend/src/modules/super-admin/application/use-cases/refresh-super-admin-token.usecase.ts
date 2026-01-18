import {
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import type { RefreshTokenRepository } from '../../../company-admin/auth/domain/repositories/refresh-token.repository';
import { JwtService } from 'src/modules/company-admin/auth/infrastructure/auth/jwt.service';

@Injectable()
export class RefreshSuperAdminTokenUseCase {
    constructor(
        @Inject('RefreshTokenRepository')
        private readonly refreshTokenRepo: RefreshTokenRepository,
        private readonly jwtService: JwtService,
    ) { }

    async execute(refreshTokenValue: string): Promise<string> {
        const token = await this.refreshTokenRepo.findByToken(refreshTokenValue);

        if (!token || token.revoked) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        if (new Date() > new Date(token.expiresAt)) {
            throw new UnauthorizedException('Refresh token expired');
        }

        if (token.userId !== 'super-admin-id') {
            throw new UnauthorizedException('Invalid token owner');
        }

        // Since Super Admin is environment-based, we don't check a user repository.
        // We assume the environment variables are still set and valid (checked at login).

        return this.jwtService.generateAccessToken({
            userId: 'super-admin-id',
            role: 'SUPER_ADMIN',
        });
    }
}
