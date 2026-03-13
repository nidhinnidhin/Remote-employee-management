import { VerifyEmailOtpDto } from '../../../presentation/dto/verify-email-otp.dto';
import { ResendOtpDto } from '../../../presentation/dto/resend-otp.dto';
import { SendEmailOtpInput } from 'src/shared/types/company/otp/send-email-otp-input.type';

export interface IVerifyEmailOtpUseCase {
    execute(input: VerifyEmailOtpDto): Promise<any>;
}

export interface IResendEmailOtpUseCase {
    execute(input: ResendOtpDto): Promise<void>;
}

export interface ISendEmailOtpUseCase {
    execute(input: SendEmailOtpInput): Promise<void>;
}
