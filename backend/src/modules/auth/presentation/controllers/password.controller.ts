import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import { ForgotPasswordUseCase } from '../../application/use-cases/reset-password/forgot-password.usecase';
import { VerifyResetPasswordOtpUseCase } from '../../application/use-cases/reset-password/verify-reset-password-otp.usecase';
import { ResetPasswordUseCase } from '../../application/use-cases/reset-password/reset-password.usecase';
import { ForgotPasswordDto } from '../../presentation/dto/forgot-password.dto';
import { VerifyResetPasswordOtpDto } from '../../presentation/dto/verify-reset-password-otp.dto';
import { ResetPasswordDto } from '../../presentation/dto/reset-password.dto';

@Controller('auth/password')
export class PasswordController {
    constructor(
        private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
        private readonly verifyResetPasswordOtpUseCase: VerifyResetPasswordOtpUseCase,
        private readonly resetPasswordUseCase: ResetPasswordUseCase,
    ) { }

    @Post('forgot')
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        await this.forgotPasswordUseCase.execute({ email: dto.email });
        return { message: OTP_MESSAGES.OTP_SENT };
    }

    @Post('verify-reset')
    verifyResetOtp(@Body() dto: VerifyResetPasswordOtpDto) {
        return this.verifyResetPasswordOtpUseCase.execute({
            email: dto.email,
            otp: dto.otp,
        });
    }

    @Post('reset')
    resetPassword(@Body() dto: ResetPasswordDto) {
        return this.resetPasswordUseCase.execute({
            email: dto.email,
            newPassword: dto.newPassword,
        });
    }
}
