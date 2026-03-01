import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { GetUserProfileUseCase } from '../../application/use-cases/profile/get-user-profile.usecase';
import { UpdateProfileUseCase } from '../../application/use-cases/profile/update-user-profile.useCase';
import { UploadProfileImageUseCase } from '../../application/use-cases/profile/upload-profile-image.usecase';
import { UpdateSkillsUseCase } from '../../application/use-cases/skills/update-skills.usecase';
import { UpdateProfileDto } from '../dto/update-profile.dto';

import { RequestEmailChangeUseCase } from '../../application/use-cases/update-email/request-email-change.usecase';
import { VerifyEmailChangeUseCase } from '../../application/use-cases/update-email/verify-email-change.usecase';
import { RequestEmailChangeDto } from '../dto/email-update/request-email-change.dto';

@Controller('auth/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(
        private readonly getUserProfileUseCase: GetUserProfileUseCase,
        private readonly updateProfileUseCase: UpdateProfileUseCase,
        private readonly uploadProfileImageUseCase: UploadProfileImageUseCase,
        private readonly updateSkillsUseCase: UpdateSkillsUseCase,
        private readonly requestEmailChangeUseCase: RequestEmailChangeUseCase,
        private readonly verifyEmailChangeUseCase: VerifyEmailChangeUseCase,
    ) { }

    @Get('me')
    async getMyProfile(@Req() req: Request) {
        return this.getUserProfileUseCase.execute(req.user!.userId);
    }

    @Patch('update')
    async updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
        return this.updateProfileUseCase.execute(req.user!.userId, dto);
    }

    @Post('upload-image')
    @UseInterceptors(FileInterceptor('file'))
    async uploadProfileImage(
        @Req() req: Request,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        return this.uploadProfileImageUseCase.execute(req.user!.userId, file);
    }

    @Patch('skills')
    async updateSkills(
        @Req() req: Request,
        @Body('skills') skills: string[],
    ) {
        return this.updateSkillsUseCase.execute(req.user!.userId, skills);
    }

    @Post('request-email-change')
    async requestEmailChange(
        @Req() req: Request,
        @Body() dto: RequestEmailChangeDto,
    ) {
        return this.requestEmailChangeUseCase.execute(req.user!.userId, dto.newEmail);
    }

    @Post('verify-email-change')
    async verifyEmailChange(@Req() req: Request, @Body('otp') otp: string) {
        return this.verifyEmailChangeUseCase.execute(req.user!.userId, otp);
    }
}
