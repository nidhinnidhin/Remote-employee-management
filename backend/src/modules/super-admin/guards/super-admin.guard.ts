import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole } from 'src/shared/enums/user/user-role.enum';

@Injectable()
export class SuperAdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            // JwtAuthGuard should be run before this, so user should populate. 
            // If not, unauthorized.
            throw new UnauthorizedException('User not authenticated');
        }

        if (user.role !== UserRole.SUPER_ADMIN) {
            throw new UnauthorizedException('Access denied. Super Admin rights required.');
        }

        return true;
    }
}
