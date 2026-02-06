import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { LoginSuperAdminDto } from '../dtos/login-super-admin.dto';
import { LoginSuperAdminUseCase } from '../../application/use-cases/login-super-admin.usecase';
import {
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from 'src/shared/config/cookies.config';

@Controller('super-admin/auth')
export class SuperAdminAuthController {
  constructor(private readonly loginUseCase: LoginSuperAdminUseCase) {}

  @Post('login')
  async login(
    @Body() dto: LoginSuperAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.loginUseCase.execute(
      dto.email,
      dto.password,
    );

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    return { accessToken, refreshToken };
  }
}
