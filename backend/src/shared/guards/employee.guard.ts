import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/shared/enums/user/user-role.enum';

@Injectable()
export class EmployeeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (user.role !== UserRole.EMPLOYEE) {
      throw new ForbiddenException(
        'Access denied. Employee rights required.',
      );
    }

    return true;
  }
}
