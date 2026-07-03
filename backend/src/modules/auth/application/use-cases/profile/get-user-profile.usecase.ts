import { Inject, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import type { ICompanyRepository } from '../../../domain/repositories/icompany.repository';
import type { IDepartmentRepository } from '../../../../department/domain/repositories/idepartment.repository';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { isValidObjectId } from 'mongoose';
import { IGetUserProfileUseCase } from '../../interfaces/profile/profile-use-case.interface';
import { EnrichedUserProfile } from 'src/shared/types/profile/enriched-user-profile.type';
import { UserProfileResponseMapper } from '../../mappers/profile/user-profile-response-mapper';

@Injectable()
export class GetUserProfileUseCase implements IGetUserProfileUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @Inject('ICompanyRepository')
    private readonly _companyRepository: ICompanyRepository,
    @Inject('IDepartmentRepository')
    private readonly _departmentRepository: IDepartmentRepository,
  ) { }

  async execute(userId: string): Promise<EnrichedUserProfile> {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException(AUTH_MESSAGES.USER_BLOCKED);
    }

    let companyName: string | null = null; // 👈 1. Create holder variable

    if (user.companyId) {
      await this.checkCompanySuspension(user.companyId);
      
      // 👈 2. Retrieve the company domain model structure
      const company = await this._companyRepository.findById(user.companyId);
      if (company) {
        companyName = company.name; // Assumes your CompanyEntity profile defines a 'name' field
      }
    }

    const departments = await this._departmentRepository.findAllByEmployeeId(userId);
    const departmentNames = departments.map(d => d.name);

    return UserProfileResponseMapper.toEnrichedProfile(user, departmentNames, companyName);
  }

  private async checkCompanySuspension(
    companyId: string | undefined,
  ): Promise<void> {
    if (!companyId || !isValidObjectId(companyId)) return;

    const company = await this._companyRepository.findById(companyId);

    if (company?.status === CompanyStatus.SUSPENDED) {
      throw new ForbiddenException(AUTH_MESSAGES.COMPANY_SUSPENDED);
    }
  }
}