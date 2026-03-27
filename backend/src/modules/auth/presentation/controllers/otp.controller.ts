import {
    Body,
    Controller,
    Post,
    Inject,
} from '@nestjs/common';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import type {
    IVerifyEmailOtpUseCase,
    IResendEmailOtpUseCase,
} from '../../application/interfaces/otp/otp-use-case.interface';
import { VerifyEmailOtpDto } from '../../application/dto/verify-email-otp.dto';
import { ResendOtpDto } from '../../application/dto/resend-otp.dto';

@Controller('auth/otp')
export class OtpController {
    constructor(
        @Inject('IVerifyEmailOtpUseCase')
        private readonly _verifyEmailOtpUseCase: IVerifyEmailOtpUseCase,
        @Inject('IResendEmailOtpUseCase')
        private readonly _resendEmailOtpUseCase: IResendEmailOtpUseCase,
    ) { }

    @Post('verify')
    async verifyOtp(@Body() verifyEmailOtpDto: VerifyEmailOtpDto) {
        const result = await this._verifyEmailOtpUseCase.execute({
            email: verifyEmailOtpDto.email,
            otp: verifyEmailOtpDto.otp,
        });

        return {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        };
    }

    @Post('resend')
    async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
        await this._resendEmailOtpUseCase.execute(resendOtpDto);
        return { message: OTP_MESSAGES.OTP_RESENT };
    }
}
