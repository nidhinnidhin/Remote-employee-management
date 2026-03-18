import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
import { OnboardingDto } from '../../dto/onboarding.dto';
import type { ICompanyRepository } from '../../../domain/repositories/icompany.repository';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { CompanyEntity } from '../../../domain/entities/company.entity';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import type { IJwtService } from 'src/shared/services/auth/interfaces/ijwt.service';
import { IOnboardCompanyUseCase } from '../../interfaces/onboarding/onboarding-use-case.interface';

@Injectable()
export class OnboardCompanyUseCase implements IOnboardCompanyUseCase {
    constructor(
        @Inject('ICompanyRepository')
        private readonly _companyRepository: ICompanyRepository,

        @Inject('IUserRepository')
        private readonly _userRepository: IUserRepository,

        @Inject('IJwtService')
        private readonly _jwtService: IJwtService,
    ) { }

    async execute(userId: string, dto: OnboardingDto) {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
        }

        if (user.isOnboarded) {
            throw new ConflictException('User is already onboarded');
        }

        const existingCompany = await this._companyRepository.findByEmail(dto.company.email);
        if (existingCompany) {
            throw new ConflictException(AUTH_MESSAGES.COMPANY_ALREADY_EXIST);
        }

        const companyEntity = new CompanyEntity(
            "",
            dto.company.name,
            dto.company.email,
            dto.company.size,
            dto.company.industry,
            dto.company.website,
            new Date(),
            new Date(),
        );

        const createdCompany = await this._companyRepository.create(companyEntity);

        await this._userRepository.updateUserFieldsById(userId, {
            companyId: createdCompany.id,
            isOnboarded: true,
        });

        const accessToken = this._jwtService.generateAccessToken({
            userId: user.id,
            role: user.role,
            companyId: createdCompany.id,
        });

        const refreshToken = this._jwtService.generateRefreshToken({
            userId: user.id,
        });

        return {
            message: 'Onboarding completed successfully',
            company: createdCompany,
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isOnboarded: true,
            }
        };
    }
}
