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
import { VerifyEmailOtpDto } from '../../presentation/dto/verify-email-otp.dto';
import { ResendOtpDto } from '../dto/resend-otp.dto';

@Controller('auth/otp')
export class OtpController {
    constructor(
        @Inject('IVerifyEmailOtpUseCase')
        private readonly verifyEmailOtpUseCase: IVerifyEmailOtpUseCase,
        @Inject('IResendEmailOtpUseCase')
        private readonly resendEmailOtpUseCase: IResendEmailOtpUseCase,
    ) { }

    @Post('verify')
    async verifyOtp(@Body() dto: VerifyEmailOtpDto) {
        const result = await this.verifyEmailOtpUseCase.execute({
            email: dto.email,
            otp: dto.otp,
        });

        return {
            user: result.user,
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        };
    }

    @Post('resend')
    async resendOtp(@Body() dto: ResendOtpDto) {
        await this.resendEmailOtpUseCase.execute(dto);
        return { message: OTP_MESSAGES.OTP_RESENT };
    }
}
