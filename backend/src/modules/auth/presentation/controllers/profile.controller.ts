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
import { Inject } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import type {
    IGetUserProfileUseCase,
    IUpdateProfileUseCase,
    IUploadProfileImageUseCase,
    IUpdateSkillsUseCase,
    IRequestEmailChangeUseCase,
    IVerifyEmailChangeUseCase,
} from '../../application/interfaces/profile/profile-use-case.interface';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { RequestEmailChangeDto } from '../dto/email-update/request-email-change.dto';

@Controller('auth/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
    constructor(
        @Inject('IGetUserProfileUseCase')
        private readonly getUserProfileUseCase: IGetUserProfileUseCase,
        @Inject('IUpdateProfileUseCase')
        private readonly updateProfileUseCase: IUpdateProfileUseCase,
        @Inject('IUploadProfileImageUseCase')
        private readonly uploadProfileImageUseCase: IUploadProfileImageUseCase,
        @Inject('IUpdateSkillsUseCase')
        private readonly updateSkillsUseCase: IUpdateSkillsUseCase,
        @Inject('IRequestEmailChangeUseCase')
        private readonly requestEmailChangeUseCase: IRequestEmailChangeUseCase,
        @Inject('IVerifyEmailChangeUseCase')
        private readonly verifyEmailChangeUseCase: IVerifyEmailChangeUseCase,
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
        return this.requestEmailChangeUseCase.execute(req.user!.userId, dto);
    }

    @Post('verify-email-change')
    async verifyEmailChange(@Req() req: Request, @Body('otp') otp: string) {
        return this.verifyEmailChangeUseCase.execute(req.user!.userId, otp);
    }
}
