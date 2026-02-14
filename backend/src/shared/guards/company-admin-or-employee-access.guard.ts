import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/shared/enums/user/user-role.enum';

@Injectable()
export class CompanyAdminOrEmployeeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const allowedRoles = [UserRole.COMPANY_ADMIN, UserRole.EMPLOYEE];

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenException(
        'Access denied. Company Admin or Employee rights required.',
      );
    }

    return true;
  }
}
