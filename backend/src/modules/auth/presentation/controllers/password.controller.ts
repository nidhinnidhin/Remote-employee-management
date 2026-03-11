import {
    Body,
    Controller,
    Post,
    Inject,
} from '@nestjs/common';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import type {
    IForgotPasswordUseCase,
    IVerifyResetPasswordOtpUseCase,
    IResetPasswordUseCase,
} from '../../application/interfaces/auth-use-cases.interfaces';
import { ForgotPasswordDto } from '../../presentation/dto/forgot-password.dto';
import { VerifyResetPasswordOtpDto } from '../../presentation/dto/verify-reset-password-otp.dto';
import { ResetPasswordDto } from '../../presentation/dto/reset-password.dto';

@Controller('auth/password')
export class PasswordController {
    constructor(
        @Inject('IForgotPasswordUseCase')
        private readonly forgotPasswordUseCase: IForgotPasswordUseCase,
        @Inject('IVerifyResetPasswordOtpUseCase')
        private readonly verifyResetPasswordOtpUseCase: IVerifyResetPasswordOtpUseCase,
        @Inject('IResetPasswordUseCase')
        private readonly resetPasswordUseCase: IResetPasswordUseCase,
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
