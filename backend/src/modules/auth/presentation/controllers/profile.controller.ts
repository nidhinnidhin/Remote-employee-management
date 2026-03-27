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
import { UpdateProfileDto } from '../../application/dto/update-profile.dto';
import { RequestEmailChangeDto } from '../../application/dto/email-update/request-email-change.dto';

@Controller('auth/profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    @Inject('IGetUserProfileUseCase')
    private readonly _getUserProfileUseCase: IGetUserProfileUseCase,
    @Inject('IUpdateProfileUseCase')
    private readonly _updateProfileUseCase: IUpdateProfileUseCase,
    @Inject('IUploadProfileImageUseCase')
    private readonly _uploadProfileImageUseCase: IUploadProfileImageUseCase,
    @Inject('IUpdateSkillsUseCase')
    private readonly _updateSkillsUseCase: IUpdateSkillsUseCase,
    @Inject('IRequestEmailChangeUseCase')
    private readonly _requestEmailChangeUseCase: IRequestEmailChangeUseCase,
    @Inject('IVerifyEmailChangeUseCase')
    private readonly _verifyEmailChangeUseCase: IVerifyEmailChangeUseCase,
  ) {}

  @Get('me')
  async getMyProfile(@Req() req: Request) {
    return this._getUserProfileUseCase.execute(req.user!.userId);
  }

  @Patch('update')
  async updateProfile(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
    return this._updateProfileUseCase.execute(req.user!.userId, updateProfileDto);
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

    return this._uploadProfileImageUseCase.execute(req.user!.userId, file);
  }

  @Patch('skills')
  async updateSkills(@Req() req: Request, @Body('skills') skills: string[]) {
    return this._updateSkillsUseCase.execute(req.user!.userId, skills);
  }

  @Post('request-email-change')
  async requestEmailChange(
    @Req() req: Request,
    @Body() emailChangeDto: RequestEmailChangeDto,
  ) {
    return this._requestEmailChangeUseCase.execute(req.user!.userId, emailChangeDto);
  }

  @Post('verify-email-change')
  async verifyEmailChange(@Req() req: Request, @Body('otp') verifyEmailChangeDto: string) {
    return this._verifyEmailChangeUseCase.execute(req.user!.userId, verifyEmailChangeDto);
  }
}
