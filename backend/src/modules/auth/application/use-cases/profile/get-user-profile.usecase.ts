import { Inject, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import type { UserRepository } from '../../../domain/repositories/user.repository';
import type { CompanyRepository } from '../../../domain/repositories/company.repository';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class GetUserProfileUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly _userRepository: UserRepository,
    @Inject('CompanyRepository')
    private readonly _companyRepository: CompanyRepository,
  ) { }

  async execute(userId: string) {
    const user = await this._userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    // Check if user is suspended (blocked)
    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException(AUTH_MESSAGES.USER_BLOCKED);
    }

    // Check company suspension if user is associated with a company
    if (user.companyId) {
      await this.checkCompanySuspension(user.companyId);
    }

    return {
      ...user,
    };
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
