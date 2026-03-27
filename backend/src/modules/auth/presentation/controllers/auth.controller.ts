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

import type {
  IRegisterAdminUseCase,
  ILoginUseCase,
  IRefreshAccessTokenUseCase,
  ISocialLoginUseCase,
} from '../../application/interfaces/auth/auth-use-case.interface';
import type { IOnboardCompanyUseCase } from '../../application/interfaces/onboarding/onboarding-use-case.interface';
import type { ICookieHelperService } from 'src/shared/services/auth/interfaces/icookie-helper.service';
import { Inject } from '@nestjs/common';

import { OnboardingDto } from '../../application/dto/onboarding.dto';
import { RegisterAdminDto } from '../../application/dto/register-admin.dto';
import { LoginDto } from '../../application/dto/login.dto';
import type { SocialLoginInput } from 'src/shared/types/auth/social-login.type';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('IRegisterAdminUseCase')
    private readonly _registerAdminUseCase: IRegisterAdminUseCase,
    @Inject('IOnboardCompanyUseCase')
    private readonly _onboardCompanyUseCase: IOnboardCompanyUseCase,
    @Inject('IRefreshAccessTokenUseCase')
    private readonly _refreshAccessTokenUseCase: IRefreshAccessTokenUseCase,
    @Inject('ILoginUseCase')
    private readonly _loginUseCase: ILoginUseCase,
    @Inject('ISocialLoginUseCase')
    private readonly _socialLoginUseCase: ISocialLoginUseCase,
    @Inject('ICookieHelperService')
    private readonly _cookieHelperService: ICookieHelperService,
  ) {}

  @Post('register')
  async register(@Body() registerAdminDto: RegisterAdminDto) {
    return this._registerAdminUseCase.execute(registerAdminDto);
  }

  @Post('onboard')
  async onboard(
    @Body() onboardingDto: OnboardingDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!onboardingDto.userId) {
      throw new BadRequestException('User ID is required for onboarding');
    }
    const result = await this._onboardCompanyUseCase.execute(onboardingDto.userId, onboardingDto);

    this._cookieHelperService.setAuthCookies(
      res,
      result.accessToken,
      result.refreshToken,
    );

    return result;
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this._loginUseCase.execute({
      email: loginDto.email,
      password: loginDto.password,
    });

    if (result.accessToken && result.refreshToken) {
      this._cookieHelperService.setAuthCookies(
        res,
        result.accessToken,
        result.refreshToken,
      );
    }
    return result;
  }

  @Post('social-login')
  async socialLogin(
    @Body() body: SocialLoginInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('[AuthController] socialLogin input:', body.email);
    const result = await this._socialLoginUseCase.execute(body);

    console.log(
      '[AuthController] sending result:',
      JSON.stringify({
        hasUser: !!result.user,
        isOnboarded: result.user?.isOnboarded,
        hasAccessToken: !!result.accessToken,
      }),
    );

    if (result.accessToken && result.refreshToken) {
      this._cookieHelperService.setAuthCookies(
        res,
        result.accessToken,
        result.refreshToken,
      );
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
      await this._refreshAccessTokenUseCase.execute(refreshToken);

    res.cookie(
      ACCESS_TOKEN_COOKIE_NAME,
      accessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS,
    );

    return { accessToken };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, ACCESS_TOKEN_COOKIE_OPTIONS);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_OPTIONS);
    return {
      message: AUTH_MESSAGES.LOGOUT_SUCCESS || 'Logged out successfully',
    };
  }
}
