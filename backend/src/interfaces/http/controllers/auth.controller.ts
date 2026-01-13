import { Body, Controller, Post } from '@nestjs/common';
import { RegisterCompanyAdminDto } from 'src/presentation/dto/register-company-admin.dto';
import { RegisterCompanyAdminUseCase } from '../../../application/use-cases/register-company-admin.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerCompanyAdminUseCase: RegisterCompanyAdminUseCase,
  ) {}

  @Post('register')
  async registerCompanyAdmin(@Body() dto: RegisterCompanyAdminDto) {
    const user = await this.registerCompanyAdminUseCase.execute(dto);

    return {
      message: 'Registration successful. Please verify OTP.',
      userId: user.id,
    };
  }
}
