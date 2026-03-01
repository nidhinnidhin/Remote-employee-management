import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from 'src/shared/config/cookies.config';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';

import { RegisterAdminUseCase } from '../../application/use-cases/register/register-admin.usecase';
import { OnboardCompanyUseCase } from '../../application/use-cases/register/onboard-company.usecase';
import { LoginUseCase } from '../../application/use-cases/login/login.usecase';
import { RefreshAccessTokenUseCase } from '../../application/use-cases/token/refresh-access-token.usecase';
import { SocialLoginUseCase } from '../../application/use-cases/login/social-login.usecase';

import { OnboardingDto } from '../../presentation/dto/onboarding.dto';
import { RegisterAdminDto } from '../../presentation/dto/register-admin.dto';
import { LoginDto } from '../../presentation/dto/login.dto';
import type { SocialLoginInput } from 'src/shared/types/auth/social-login.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerAdminUseCase: RegisterAdminUseCase,
    private readonly onboardCompanyUseCase: OnboardCompanyUseCase,
    private readonly refreshAccessTokenUseCase: RefreshAccessTokenUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly socialLoginUseCase: SocialLoginUseCase,
  ) { }

  @Post('register')
  async register(@Body() dto: RegisterAdminDto) {
    return this.registerAdminUseCase.execute(dto);
  }

  @Post('onboard')
  async onboard(@Body() dto: OnboardingDto, @Res({ passthrough: true }) res: Response) {
    if (!dto.userId) {
      throw new BadRequestException('User ID is required for onboarding');
    }
    const result = await this.onboardCompanyUseCase.execute(dto.userId, dto);

    // Set tokens in cookies upon successful onboarding
    this.setAuthCookies(res, result.accessToken, result.refreshToken);

    return result;
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.loginUseCase.execute({
      email: dto.email,
      password: dto.password,
    });

    if (result.accessToken && result.refreshToken) {
      this.setAuthCookies(res, result.accessToken, result.refreshToken);
    }
    return result;
  }

  @Post('social-login')
  async socialLogin(
    @Body() body: SocialLoginInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('[AuthController] socialLogin input:', body.email);
    const result = await this.socialLoginUseCase.execute(body);

    console.log('[AuthController] sending result:', JSON.stringify({
      hasUser: !!result.user,
      isOnboarded: result.user?.isOnboarded,
      hasAccessToken: !!result.accessToken
    }));

    if (result.accessToken && result.refreshToken) {
      this.setAuthCookies(res, result.accessToken, result.refreshToken);
    }
    return result;
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];

    if (!refreshToken) {
      throw new UnauthorizedException(AUTH_MESSAGES.MISSING_REFRESH_TOKEN);
    }

    const { accessToken } =
      await this.refreshAccessTokenUseCase.execute(refreshToken);

    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);

    return { accessToken };
  }

  private setAuthCookies(
    res: Response,
    accessToken: string | undefined,
    refreshToken: string | undefined,
  ): void {
    if (accessToken) {
      res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
    }
    if (refreshToken) {
      res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);
    }
  }
}
