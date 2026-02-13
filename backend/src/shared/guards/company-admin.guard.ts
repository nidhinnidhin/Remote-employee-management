import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/shared/enums/user/user-role.enum';

@Injectable()
export class CompanyAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (user.role !== UserRole.COMPANY_ADMIN) {
      throw new ForbiddenException(
        'Access denied. Company Admin rights required.',
      );
    }

    return true;
  }
}


