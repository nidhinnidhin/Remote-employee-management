import { UpdateProfileDto } from '../../dto/update-profile.dto';
import { RequestEmailChangeDto } from '../../dto/email-update/request-email-change.dto';
import { EnrichedUserProfile } from 'src/shared/types/profile/enriched-user-profile.type';

export interface IGetUserProfileUseCase {
    execute(userId: string): Promise<EnrichedUserProfile>;
}

export interface IUpdateProfileUseCase {
    execute(userId: string, dto: UpdateProfileDto): Promise<unknown>;
}

export interface IRequestEmailChangeUseCase {
    execute(userId: string, dto: RequestEmailChangeDto): Promise<unknown>;
}

export interface IVerifyEmailChangeUseCase {
    execute(userId: string, otp: string): Promise<unknown>;
}

export interface IUploadProfileImageUseCase {
    execute(userId: string, file: Express.Multer.File): Promise<unknown>;
}

export interface IUpdateSkillsUseCase {
    execute(userId: string, skills: string[]): Promise<unknown>;
}
