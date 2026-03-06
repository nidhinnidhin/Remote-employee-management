import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';
import { OTP_MESSAGES } from 'src/shared/constants/messages/otp/otp.messages';
import { VerifyEmailOtpUseCase } from '../../application/use-cases/otp/verify-email-otp.usecase';
import { ResendEmailOtpUseCase } from '../../application/use-cases/otp/resend-email-otp.usecase';
import { VerifyEmailOtpDto } from '../../presentation/dto/verify-email-otp.dto';
import { ResendOtpDto } from '../dto/resend-otp.dto';

@Controller('auth/otp')
export class OtpController {
    constructor(
        private readonly verifyEmailOtpUseCase: VerifyEmailOtpUseCase,
        private readonly resendEmailOtpUseCase: ResendEmailOtpUseCase,
    ) { }

    @Post('verify')
    async verifyOtp(@Body() dto: VerifyEmailOtpDto) {
        const result = await this.verifyEmailOtpUseCase.execute({
            email: dto.email,
            otp: dto.otp,
        });

        return {
            user: result.user,
        };
    }

    @Post('resend')
    async resendOtp(@Body() dto: ResendOtpDto) {
        await this.resendEmailOtpUseCase.execute(dto.email);
        return { message: OTP_MESSAGES.OTP_RESENT };
    }
}
