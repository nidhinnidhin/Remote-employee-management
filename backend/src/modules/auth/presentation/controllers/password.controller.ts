import { Body, Controller, Post, Inject } from '@nestjs/common';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import type {
  IForgotPasswordUseCase,
  IVerifyResetPasswordOtpUseCase,
  IResetPasswordUseCase,
} from '../../application/interfaces/auth/auth-use-case.interface';
import { ForgotPasswordDto } from '../../application/dto/forgot-password.dto';
import { VerifyResetPasswordOtpDto } from '../../application/dto/verify-reset-password-otp.dto';
import { ResetPasswordDto } from '../../application/dto/reset-password.dto';

@Controller('auth/password')
export class PasswordController {
  constructor(
    @Inject('IForgotPasswordUseCase')
    private readonly _forgotPasswordUseCase: IForgotPasswordUseCase,
    @Inject('IVerifyResetPasswordOtpUseCase')
    private readonly _verifyResetPasswordOtpUseCase: IVerifyResetPasswordOtpUseCase,
    @Inject('IResetPasswordUseCase')
    private readonly _resetPasswordUseCase: IResetPasswordUseCase,
  ) {}

  @Post('forgot')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this._forgotPasswordUseCase.execute({ email: forgotPasswordDto.email });
    return { message: OTP_MESSAGES.OTP_SENT };
  }

  @Post('verify-reset')
  verifyResetOtp(@Body() resetPasswordDto: VerifyResetPasswordOtpDto) {
    return this._verifyResetPasswordOtpUseCase.execute({
      email: resetPasswordDto.email,
      otp: resetPasswordDto.otp,
    });
  }

  @Post('reset')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this._resetPasswordUseCase.execute({
      email: resetPasswordDto.email,
      newPassword: resetPasswordDto.newPassword,
    });
  }
}
