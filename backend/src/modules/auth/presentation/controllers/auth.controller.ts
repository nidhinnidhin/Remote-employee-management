import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  Get,
  UseGuards,
  Inject,
  Patch,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
  BadRequestException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CloudinaryResourceType } from 'src/shared/enums/employees/media/cloudinary-resource.enum';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from 'src/shared/config/cookies.config';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';

import { RegisterCompanyAdminUseCase } from '../../application/use-cases/register/register-company-admin.usecase';
import { VerifyEmailOtpUseCase } from '../../application/use-cases/otp/verify-email-otp.usecase';
import { LoginUseCase } from '../../application/use-cases/login/login.usecase';
import { ResendEmailOtpUseCase } from '../../application/use-cases/otp/resend-email-otp.usecase';
import { RefreshAccessTokenUseCase } from '../../application/use-cases/token/refresh-access-token.usecase';
import { ForgotPasswordUseCase } from '../../application/use-cases/reset-password/forgot-password.usecase';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password/reset-password.usecase';
import { VerifyResetPasswordOtpUseCase } from '../../application/use-cases/reset-password/verify-reset-password-otp.usecase';
import { SocialLoginUseCase } from '../../application/use-cases/login/social-login.usecase';
import { GetUserProfileUseCase } from '../../application/use-cases/profile/get-user-profile.usecase';
import { UpdateProfileUseCase } from '../../application/use-cases/profile/update-user-profile.useCase';
import { RequestEmailChangeUseCase } from '../../application/use-cases/update-email/request-email-change.usecase';
import { VerifyEmailChangeUseCase } from '../../application/use-cases/update-email/verify-email-change.usecase';
import { UploadProfileImageUseCase } from '../../application/use-cases/profile/upload-profile-image.usecase';
import { UpdateSkillsUseCase } from '../../application/use-cases/skills/update-skills.usecase';
import { UploadDocumentUseCase } from '../../application/use-cases/document/upload-document.usecase';
import { DeleteDocumentUseCase } from '../../application/use-cases/document/delete-document.usecase';
import { EditDocumentUseCase } from '../../application/use-cases/document/edit-document.usecase';

import { RegisterCompanyAdminDto } from '../../presentation/dto/register-company-admin.dto';
import { VerifyEmailOtpDto } from '../../presentation/dto/verify-email-otp.dto';
import { LoginDto } from '../../presentation/dto/login.dto';
import { ResendOtpDto } from '../dto/resend-otp.dto';
import { ResetPasswordDto } from '../../presentation/dto/reset-password.dto';
import { VerifyResetPasswordOtpDto } from '../../presentation/dto/verify-reset-password-otp.dto';
import { ForgotPasswordDto } from '../../presentation/dto/forgot-password.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { RequestEmailChangeDto } from '../dto/email-update/request-email-change.dto';
import type { SocialLoginInput } from 'src/shared/types/auth/social-login.type';

// ─── Constants ───────────────────────────────────────────────────────────────

const DOCUMENT_FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

const ALLOWED_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
];

const documentFileFilter: MulterOptions['fileFilter'] = (
  _req,
  file,
  callback,
) => {
  if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimetype)) {
    return callback(new BadRequestException('Invalid file type'), false);
  }
  callback(null, true);
};

const documentInterceptor = FileInterceptor('file', {
  limits: { fileSize: DOCUMENT_FILE_SIZE_LIMIT },
  fileFilter: documentFileFilter,
});

// ─── Controller ──────────────────────────────────────────────────────────────

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerCompanyAdminUseCase: RegisterCompanyAdminUseCase,
    private readonly verifyEmailOtpUseCase: VerifyEmailOtpUseCase,
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly resendEmailOtpUseCase: ResendEmailOtpUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly verifyResetPasswordOtpUseCase: VerifyResetPasswordOtpUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly socialLoginUseCase: SocialLoginUseCase,
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly requestEmailChangeUseCase: RequestEmailChangeUseCase,
    private readonly verifyEmailChangeUseCase: VerifyEmailChangeUseCase,
    private readonly uploadProfileImageUseCase: UploadProfileImageUseCase,
    private readonly updateSkillsUseCase: UpdateSkillsUseCase,
    private readonly uploadDocumentUseCase: UploadDocumentUseCase,
    private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
    private readonly editDocumentUseCase: EditDocumentUseCase,
  ) {}

  // ─── Auth ───────────────────────────────────────────────────────────────────

  @Post('register')
  async register(@Body() dto: RegisterCompanyAdminDto) {
    return this.registerCompanyAdminUseCase.execute(dto);
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });

    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return result;
  }

  @Post('social-login')
  async socialLogin(
    @Body() body: SocialLoginInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.socialLoginUseCase.execute(body);
    this.setAuthCookies(res, result.accessToken, result.refreshToken);
    return result;
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_MESSAGES.MISSING_REFRESH_TOKEN);
    }

    const { accessToken } =
      await this.refreshAccessTokenUseCase.execute(refreshToken);

    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

    return { accessToken };
  }

  // ─── OTP ────────────────────────────────────────────────────────────────────

  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: VerifyEmailOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.verifyEmailOtpUseCase.execute({
      email: dto.email,
      otp: dto.otp,
    });

    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto) {
    await this.resendEmailOtpUseCase.execute(dto.email);
    return { message: OTP_MESSAGES.OTP_RESENT };
  }

  // ─── Password ───────────────────────────────────────────────────────────────

  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.forgotPasswordUseCase.execute({ email: dto.email });
    return { message: OTP_MESSAGES.OTP_SENT };
  }

  @Post('verify-reset-password-otp')
  verifyResetOtp(@Body() dto: VerifyResetPasswordOtpDto) {
    return this.verifyResetPasswordOtpUseCase.execute({
      email: dto.email,
      otp: dto.otp,
    });
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute({
      email: dto.email,
      newPassword: dto.newPassword,
    });
  }

  // ─── Profile ────────────────────────────────────────────────────────────────

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Req() req: Request) {
    return this.getUserProfileUseCase.execute(req.user!.userId);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    return this.updateProfileUseCase.execute(req.user!.userId, dto);
  }

  @Post('upload-profile-image')
  @UseGuards(JwtAuthGuard)
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

  @Patch('profile/skills')
  @UseGuards(JwtAuthGuard)
  async updateSkills(
    @Req() req: Request,
    @Body('skills') skills: string[],
  ) {
    return this.updateSkillsUseCase.execute(req.user!.userId, skills);
  }

  // ─── Email Change ───────────────────────────────────────────────────────────

  @Post('request-email-change')
  @UseGuards(JwtAuthGuard)
  async requestEmailChange(
    @Req() req: Request,
    @Body() dto: RequestEmailChangeDto,
  ) {
    return this.requestEmailChangeUseCase.execute(req.user!.userId, dto.newEmail);
  }

  @Post('verify-email-change')
  @UseGuards(JwtAuthGuard)
  async verifyEmailChange(@Req() req: Request, @Body('otp') otp: string) {
    return this.verifyEmailChangeUseCase.execute(req.user!.userId, otp);
  }

  // ─── Documents ──────────────────────────────────────────────────────────────

  @Post('profile/documents')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(documentInterceptor)
  async uploadDocument(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
    @Body('category') category: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.uploadDocumentUseCase.execute({
      userId: req.user!.userId,
      file,
      name,
      category,
    });
  }

  @Delete('profile/documents/:id')
  @UseGuards(JwtAuthGuard)
  async deleteDocument(
    @Req() req: Request,
    @Param('id') documentId: string,
    @Body('publicId') publicId: string,
    @Body('resourceType') resourceType: CloudinaryResourceType,
  ) {
    return this.deleteDocumentUseCase.execute(
      req.user!.userId,
      documentId,
      publicId,
      resourceType,
    );
  }

  @Patch('profile/documents/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(documentInterceptor)
  async editDocument(
    @Req() req: Request,
    @Param('id') documentId: string,
    @Body('name') name: string,
    @Body('category') category: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.editDocumentUseCase.execute({
      userId: req.user!.userId,
      documentId,
      name,
      category,
      file
    });
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
  }
}