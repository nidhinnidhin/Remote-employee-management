import { UpdateProfileDto } from '../../dto/update-profile.dto';
import { RequestEmailChangeDto } from '../../dto/email-update/request-email-change.dto';

export interface IGetUserProfileUseCase {
    execute(userId: string): Promise<any>;
}

export interface IUpdateProfileUseCase {
    execute(userId: string, dto: UpdateProfileDto): Promise<any>;
}

export interface IRequestEmailChangeUseCase {
    execute(userId: string, dto: RequestEmailChangeDto): Promise<any>;
}

export interface IVerifyEmailChangeUseCase {
    execute(userId: string, otp: string): Promise<any>;
}

export interface IUploadProfileImageUseCase {
    execute(userId: string, file: any): Promise<any>;
}

export interface IUpdateSkillsUseCase {
    execute(userId: string, skills: string[]): Promise<any>;
}
