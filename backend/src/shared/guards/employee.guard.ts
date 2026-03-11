import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { UserRole } from 'src/shared/enums/user/user-role.enum';
import type { ICompanyRepository } from 'src/modules/auth/domain/repositories/icompany.repository';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class EmployeeGuard implements CanActivate {
  constructor(
    @Inject('ICompanyRepository')
    private readonly _companyRepository: ICompanyRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    if (user.role !== UserRole.EMPLOYEE) {
      throw new ForbiddenException('Access denied. Employee rights required.');
    }

    // Check if company is suspended
    if (user.companyId && isValidObjectId(user.companyId)) {
      const company = await this._companyRepository.findById(user.companyId);
      if (company && company.status === CompanyStatus.SUSPENDED) {
        throw new ForbiddenException(
          'Your company access has been suspended. Please contact support.',
        );
      }
    }

    return true;
  }
}
