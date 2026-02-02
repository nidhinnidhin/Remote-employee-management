import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InviteEmployeeUseCase } from '../../application/use-cases/invite-employee.usecase';
import { VerifyInviteUseCase } from '../../application/use-cases/verify-invite.usecase';
import { SetPasswordUseCase } from '../../application/use-cases/set-password.usecase';
import { RedisService } from 'src/shared/services/redis.service';
import { randomBytes } from 'crypto';
import type { Response } from 'express';
import { JwtService } from 'src/shared/services/jwt.service';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from 'src/shared/config/cookies.config';

@Controller('company/employees')
export class EmployeesController {
  constructor(
    private readonly inviteEmployee: InviteEmployeeUseCase,
    private readonly verifyInviteUseCase: VerifyInviteUseCase,
    private readonly setPasswordUseCase: SetPasswordUseCase,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('invite')
  async invite(@Body() body) {
    console.log('Hited invitation');
    await this.inviteEmployee.execute(body);
    return { message: 'Invitation sent successfully' };
  }

  @Get('verify-invite')
  async verifyInvite(
    @Query('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { employeeId } = await this.verifyInviteUseCase.execute(token);

    // 🔐 Create temp session
    const sessionId = randomBytes(32).toString('hex');
    const redisKey = `invite:temp:${sessionId}`;

    await this.redisService.set(redisKey, employeeId, 10 * 60); // 10 min

    // 🍪 Store temp session id
    res.cookie('invite_session', sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000,
    });

    return { nextStep: 'SET_PASSWORD' };
  }

  @Post('set-password')
  async setPassword(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Body('password') password: string,
  ) {
    const sessionId = req.cookies?.invite_session;

    if (!sessionId) {
      throw new UnauthorizedException('Invite session expired');
    }

    const redisKey = `invite:temp:${sessionId}`;
    const employeeId = await this.redisService.get(redisKey);

    if (!employeeId) {
      throw new UnauthorizedException('Invite session expired');
    }

    // 1️⃣ Set password
    await this.setPasswordUseCase.execute(employeeId, password);

    // 2️⃣ Generate JWT tokens
    const accessToken = this.jwtService.generateAccessToken({
      userId: employeeId,
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      userId: employeeId,
    });

    // 3️⃣ Store JWTs in cookies
    res.cookie(
      ACCESS_TOKEN_COOKIE_NAME,
      accessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS,
    );

    res.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    // 4️⃣ Cleanup temp invite session
    await this.redisService.del(redisKey);
    res.clearCookie('invite_session');

    return {
      message: 'Password set & logged in successfully',
    };
  }
}
