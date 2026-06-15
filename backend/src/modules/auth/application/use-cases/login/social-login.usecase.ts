import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import type { ICompanyRepository } from 'src/modules/auth/domain/repositories/icompany.repository';
import type { IJwtService } from 'src/shared/services/auth/interfaces/ijwt.service';
import { ISocialLoginUseCase } from '../../interfaces/auth/auth-use-case.interface';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { UserRole } from 'src/shared/enums/user/user-role.enum';
import { CompanyStatus } from 'src/shared/enums/company/company-status.enum';
import { UserEntity } from 'src/modules/auth/domain/entities/user.entity';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import {
  SocialLoginInput,
  SocialLoginResponse,
} from 'src/shared/types/auth/social-login.type';

// 🔹 Import Logging Interfaces
import type { ICreateActivityLogUseCase } from 'src/modules/activity-logs/application/interfaces/activity-log-use-cases.interface';
import { ActivityAction } from 'src/modules/activity-logs/domain/entities/activity-log.entity';

@Injectable()
export class SocialLoginUseCase implements ISocialLoginUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @Inject('ICompanyRepository')
    private readonly _companyRepository: ICompanyRepository,

    @Inject('IJwtService')
    private readonly _jwtService: IJwtService,

    @Inject('ICreateActivityLogUseCase')
    private readonly _createLogUseCase: ICreateActivityLogUseCase,
  ) {}

  async execute(input: SocialLoginInput): Promise<SocialLoginResponse> {
    const { email, firstName, lastName, provider, providerId } = input;
    let user = await this._userRepository.findByEmail(email.toLowerCase());
    let isNewAccount = false;

    console.log('-----------------------------------------');
    console.log(' SOCIAL LOGIN/REGISTER USE CASE');
    console.log(' Email:', email);
    console.log(' User Found:', !!user);

    if (!user) {
      console.log(' User NOT found - Creating new account...');
      isNewAccount = true;

      const newUser = new UserEntity(
        '', // MongoDB generates this _id
        firstName,
        lastName,
        email.toLowerCase(),
        UserRole.COMPANY_ADMIN,
        '', // Phone number default empty
        undefined, // Password hash not applicable for social accounts
        UserStatus.ACTIVE,
        undefined, // Title
        new Date(), // createdAt
        new Date(), // updatedAt
        undefined, // Company ID initialization
        undefined,
        undefined,
        false, // hasPassword (false since registering via OAuth provider)
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        [], // Skills
        false, // isOnboarded
        provider, // 'google' | 'facebook' | 'github'
        providerId,
      );

      user = await this._userRepository.create(newUser);
      console.log(' New User Created:', JSON.stringify(user, null, 2));
    } else {
      console.log(' User Found - ID:', user.id);
      console.log(' Role:', user.role);
      console.log(' IsOnboarded:', user.isOnboarded);
      console.log(' Company ID:', user.companyId);
    }
    console.log('-----------------------------------------');

    // 🔹 Validate Account Status
    if (user.status === UserStatus.SUSPENDED) {
      throw new ForbiddenException(AUTH_MESSAGES.USER_BLOCKED);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(AUTH_MESSAGES.ACCOUNT_NOT_ACTIVE);
    }

    // 🔹 Check company status context if user has completed onboarding steps
    if (user.isOnboarded) {
      await this.checkCompanySuspension(user.companyId);
    }

    // 🔹 Generate Access and Refresh JWT Tokens
    const accessToken = this._jwtService.generateAccessToken({
      userId: user.id,
      role: user.role,
      companyId: user.companyId,
    });

    const refreshToken = this._jwtService.generateRefreshToken({
      userId: user.id,
    });

    // 📝 PERSIST ACTIVITY METRICS IN AUDIT LOGS
    await this._createLogUseCase
      .execute({
        companyId: user.companyId || null,
        userId: user.id,
        userRole: user.role,
        action: isNewAccount ? ActivityAction.CREATE : ActivityAction.LOGIN,
        details: isNewAccount
          ? `Account dynamically registered via external OAuth provider: ${provider.toUpperCase()}.`
          : `User authenticated via continuous integration payload from provider: ${provider.toUpperCase()}.`,
      })
      .catch((err) => {
        // Catch error to protect auth lifecycle if logging cluster has standard network friction
        console.error(
          '[SocialLoginUseCase] Error persisting activity log:',
          err.message,
        );
      });

    // 🔹 Route redirection logic criteria according to onboarding phase completion
    if (user.role === UserRole.COMPANY_ADMIN && !user.isOnboarded) {
      console.log(
        ' SocialLogin: User NOT onboarded, returning tokens for onboarding redirect',
      );
      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isOnboarded: false,
        },
      };
    }

    console.log(' SocialLogin: User onboarded, issuing tokens');
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
        isOnboarded:
          user.role === UserRole.COMPANY_ADMIN ? user.isOnboarded : true,
      },
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
