import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import type { IUserRepository } from '../../../domain/repositories/iuser.repository';
import type { ISendEmailOtpUseCase } from '../../interfaces/auth-use-cases.interfaces';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { ForgotPasswordDto } from '../../../presentation/dto/forgot-password.dto';
import { IForgotPasswordUseCase } from '../../interfaces/auth-use-cases.interfaces';

@Injectable()
export class ForgotPasswordUseCase implements IForgotPasswordUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @Inject('ISendEmailOtpUseCase')
    private readonly _sendEmailOtpUseCase: ISendEmailOtpUseCase,
  ) { }

  async execute(input: ForgotPasswordDto) {
    const user = await this._userRepository.findByEmail(input.email.toLowerCase());

    if (!user) {
      throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(AUTH_MESSAGES.USER_NOT_ACTIVE);
    }

    await this._sendEmailOtpUseCase.execute({
      userId: user.id,
      email: user.email,
    });
  }
}
