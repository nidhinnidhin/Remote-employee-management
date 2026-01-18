import { Body, Controller, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { LoginSuperAdminDto } from '../dtos/login-super-admin.dto';
import { LoginSuperAdminUseCase } from '../../application/use-cases/login-super-admin.usecase';

@Controller('super-admin/auth')
export class SuperAdminAuthController {
  constructor(
    private readonly loginUseCase: LoginSuperAdminUseCase,
  ) { }

  @Post('login')
  async login(
    @Body() dto: LoginSuperAdminDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.loginUseCase.execute(
      dto.email,
      dto.password,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/super-admin/auth/refresh',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    return { accessToken };
  }
}
