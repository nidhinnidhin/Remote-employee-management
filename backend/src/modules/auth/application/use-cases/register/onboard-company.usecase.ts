import { Injectable, Inject, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { OnboardingDto } from '../../dto/onboarding.dto';
import type { ICompanyRepository } from '../../../domain/repositories/icompany.repository';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { CompanyEntity } from '../../../domain/entities/company.entity';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import type { IJwtService } from 'src/shared/services/auth/interfaces/ijwt.service';
import { IOnboardCompanyUseCase } from '../../interfaces/onboarding/onboarding-use-case.interface';

import { OnboardingStep } from 'src/shared/enums/company/onboarding-step.enum';

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

    async getStatus(userId: string) {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
        }

        if (!user.companyId) {
            return {
                step: OnboardingStep.ORGANIZATION,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    isOnboarded: user.isOnboarded
                }
            };
        }

        const company = await this._companyRepository.findById(user.companyId);
        return {
            step: company?.onboardingStep || OnboardingStep.ORGANIZATION,
            company,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isOnboarded: user.isOnboarded
            }
        };
    }

    async execute(userId: string, dto: OnboardingDto) {
        const user = await this._userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
        }

        let company: CompanyEntity;

        if (!user.companyId) {
            if (!dto.company) {
                throw new BadRequestException('Company details are required for initial onboarding');
            }
            // Check if company email already exists
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
                0,
                undefined,
                OnboardingStep.SUBSCRIPTION // Move to next step
            );

            company = await this._companyRepository.create(companyEntity);
            await this._userRepository.updateUserFieldsById(userId, {
                companyId: company.id,
            });
        } else {
            // Update existing company details
            const existingCompany = await this._companyRepository.findById(user.companyId);
            if (!existingCompany) throw new NotFoundException('Company not found');
            
            const updateData: Record<string, unknown> = {};
            if (dto.company) {
                updateData.name = dto.company.name;
                updateData.size = dto.company.size;
                updateData.industry = dto.company.industry;
                updateData.website = dto.company.website;
                updateData.onboardingStep = OnboardingStep.SUBSCRIPTION;
            }
            
            if (Object.keys(updateData).length > 0) {
                await this._companyRepository.updateById(user.companyId, updateData);
            }
            
            company = (await this._companyRepository.findById(user.companyId))!;
        }

        // Generate tokens (allow them to stay logged in during onboarding)
        const accessToken = this._jwtService.generateAccessToken({
            userId: user.id,
            role: user.role,
            companyId: company.id,
        });

        const refreshToken = this._jwtService.generateRefreshToken({
            userId: user.id,
        });

        return {
            message: 'Organization registered. Proceed to subscription.',
            step: OnboardingStep.SUBSCRIPTION,
            company,
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isOnboarded: user.isOnboarded,
            }
        };
    }

    async finalize(userId: string, companyId: string) {
        await this._companyRepository.updateById(companyId, {
            onboardingStep: OnboardingStep.COMPLETED
        });
        await this._userRepository.updateUserFieldsById(userId, {
            isOnboarded: true
        });
    }
}
