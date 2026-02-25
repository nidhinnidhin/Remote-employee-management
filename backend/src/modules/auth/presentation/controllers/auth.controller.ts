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
import { RegisterCompanyAdminUseCase } from '../../application/use-cases/register/register-company-admin.usecase';
import { VerifyEmailOtpUseCase } from '../../application/use-cases/otp/verify-email-otp.usecase';
import { LoginUseCase } from '../../application/use-cases/login/login.usecase';
import { ResendEmailOtpUseCase } from '../../application/use-cases/otp/resend-email-otp.usecase';
import { RegisterCompanyAdminDto } from '../../presentation/dto/register-company-admin.dto';
import { VerifyEmailOtpDto } from '../../presentation/dto/verify-email-otp.dto';
import { LoginDto } from '../../presentation/dto/login.dto';
import { ResendOtpDto } from '../dto/resend-otp.dto';
import { RefreshAccessTokenUseCase } from '../../application/use-cases/token/refresh-access-token.usecase';
import { ForgotPasswordUseCase } from '../../application/use-cases/reset-password/forgot-password.usecase';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password/reset-password.usecase';
import { VerifyResetPasswordOtpUseCase } from '../../application/use-cases/reset-password/verify-reset-password-otp.usecase';
import { ResetPasswordDto } from '../../presentation/dto/reset-password.dto';
import { VerifyResetPasswordOtpDto } from '../../presentation/dto/verify-reset-password-otp.dto';
import { ForgotPasswordDto } from '../../presentation/dto/forgot-password.dto';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from 'src/shared/config/cookies.config';
import { SocialLoginUseCase } from '../../application/use-cases/login/social-login.usecase';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { GetUserProfileUseCase } from '../../application/use-cases/profile/get-user-profile.usecase';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdateProfileUseCase } from '../../application/use-cases/profile/update-user-profile.useCase';
import { VerifyEmailChangeDto } from '../dto/email-update/verify-email-change.dto';
import { RequestEmailChangeDto } from '../dto/email-update/request-email-change.dto';
import { VerifyEmailChangeUseCase } from '../../application/use-cases/update-email/verify-email-change.usecase';
import { RequestEmailChangeUseCase } from '../../application/use-cases/update-email/request-email-change.usecase';
import { UploadProfileImageUseCase } from '../../application/use-cases/profile/upload-profile-image.usecase';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateSkillsUseCase } from '../../application/use-cases/skills/update-skills.usecase';
import { UploadDocumentUseCase } from '../../application/use-cases/document/upload-document.usecase';
import { DeleteDocumentUseCase } from '../../application/use-cases/document/delete-document.usecase';
import { EditDocumentUseCase } from '../../application/use-cases/document/edit-document.usecase';

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
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
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

  // LOGIN
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('!!! Login Called !!!');

    const result = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });

    res.cookie(
      ACCESS_TOKEN_COOKIE_NAME,
      result.accessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS,
    );

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      result.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    console.log(
      'Login successful for user:',
      result.user.id,
      'Role:',
      result.user.role,
    );

    return result; // ← return full object including message
  }

  @Post('social-login')
  async socialLogin(
    @Body()
    body: {
      email: string;
      firstName: string;
      lastName: string;
      provider: string;
      providerId: string;
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.socialLoginUseCase.execute(body);

    res.cookie(
      ACCESS_TOKEN_COOKIE_NAME,
      result.accessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS,
    );

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      result.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    return result;
  }

  // @Get('me')
  // @UseGuards(JwtAuthGuard)
  // async getMe(@Req() req: any) {
  //   const user = await this.userRepository.findById(req.user.userId);
  //   if (!user) {
  //     throw new UnauthorizedException(AUTH_MESSAGES.USER_NOT_FOUND);
  //   }

  //   return {
  //     user: {
  //       id: user.id,
  //       email: user.email,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       role: user.role,
  //       companyId: user.companyId,
  //     },
  //   };
  // }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Req() req: any) {
    return this.getUserProfileUseCase.execute(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    console.log('DTO received:', dto);

    return this.updateProfileUseCase.execute(req.user.userId, dto);
  }

  // Register
  @Post('register')
  async register(@Body() dto: RegisterCompanyAdminDto) {
    return this.registerCompanyAdminUseCase.execute(dto);
  }

  // Verify Email OTP
  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: VerifyEmailOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(
      '!!! FINGERPRINT: VERIFY_OTP_CALLED_v7_FINAL_FIX_RESTART_REQUIRED !!!',
    );
    const result = await this.verifyEmailOtpUseCase.execute({
      email: dto.email,
      otp: dto.otp,
    });

    res.cookie(
      ACCESS_TOKEN_COOKIE_NAME,
      result.accessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS,
    );

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      result.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    console.log('OTP Verification successful for user:', result.user.id);
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    };
  }

  // Resend OTP
  @Post('resend-otp')
  async resendOtp(@Body() dto: ResendOtpDto) {
    await this.resendEmailOtpUseCase.execute(dto.email);

    return { message: OTP_MESSAGES.OTP_RESENT };
  }

  // Refresh Access Token
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

    res.cookie(
      ACCESS_TOKEN_COOKIE_NAME,
      accessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS,
    );

    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfileImage(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new UnauthorizedException('No file uploaded');
    }

    return this.uploadProfileImageUseCase.execute(req.user.userId, file);
  }

  // Forgot Password
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.forgotPasswordUseCase.execute({ email: dto.email });
    return { message: OTP_MESSAGES.OTP_SENT };
  }

  // Verify Reset Password OTP
  @Post('verify-reset-password-otp')
  verifyResetOtp(@Body() dto: VerifyResetPasswordOtpDto) {
    return this.verifyResetPasswordOtpUseCase.execute({
      email: dto.email,
      otp: dto.otp,
    });
  }

  // Reset Password
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute({
      email: dto.email,
      newPassword: dto.newPassword,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('request-email-change')
  async requestEmailChange(
    @Req() req: any,
    @Body() dto: RequestEmailChangeDto,
  ) {
    return this.requestEmailChangeUseCase.execute(
      req.user.userId,
      dto.newEmail,
    );
  }

  @Post('verify-email-change')
  @UseGuards(JwtAuthGuard)
  async verifyEmailChange(@Req() req: any, @Body('otp') otp: string) {
    return this.verifyEmailChangeUseCase.execute(req.user.userId, otp);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/skills')
  async updateSkills(@Req() req: any, @Body('skills') skills: string[]) {
    return this.updateSkillsUseCase.execute(req.user.userId, skills);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/documents')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, callback) => {
        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
        ];

        if (!allowedTypes.includes(file.mimetype)) {
          return callback(new BadRequestException('Invalid file type'), false);
        }

        callback(null, true);
      },
    }),
  )
  async uploadDocument(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('name') name: string,
    @Body('category') category: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.uploadDocumentUseCase.execute(
      req.user.userId,
      file,
      name,
      category,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile/documents/:id')
  async deleteDocument(
    @Req() req: any,
    @Param('id') documentId: string,
    @Body('publicId') publicId: string,
  ) {
    return this.deleteDocumentUseCase.execute(
      req.user.userId,
      documentId,
      publicId,
    );
  }

  @Patch('profile/documents/:id')
  @UseGuards(JwtAuthGuard)
  async editDocument(
    @Req() req: any,
    @Param('id') documentId: string,
    @Body('name') name: string,
    @Body('category') category: string,
  ) {
    return this.editDocumentUseCase.execute(
      req.user.userId,
      documentId,
      name,
      category,
    );
  }
}
