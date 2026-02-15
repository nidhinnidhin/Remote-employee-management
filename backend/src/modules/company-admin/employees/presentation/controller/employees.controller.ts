import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { InviteEmployeeUseCase } from '../../application/use-cases/invite-employee.usecase';
import { VerifyInviteUseCase } from '../../application/use-cases/verify-invite.usecase';
import { SetPasswordUseCase } from '../../application/use-cases/set-password.usecase';
import { RedisService } from 'src/shared/services/redis.service';
import type { Request, Response } from 'express';
import { JwtService } from 'src/shared/services/jwt.service';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  INVITE_SESSION_COOKIE_NAME,
  INVITE_SESSION_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from 'src/shared/config/cookies.config';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { InviteEmployeeDto } from '../dto/invite-employee.dto';
import { EMPLOYEE_MESSAGES } from 'src/shared/constants/messages/employee/employee.messages';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { POLICY_MESSAGES } from 'src/shared/constants/messages/company-policy/company-policy.message';
import { generateSecureToken } from 'src/shared/utils/token.util';

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
  @UseGuards(JwtAuthGuard)
  async invite(@Req() req: Request, @Body() dto: InviteEmployeeDto) {
    const companyId = req.user?.companyId;
    if (!companyId) {
      throw new UnauthorizedException(POLICY_MESSAGES.COMPANY_ID_NOT_FOUND);
    }

    await this.inviteEmployee.execute({
      ...dto,
      companyId,
    });
    return { message: EMPLOYEE_MESSAGES.INVITATION_SENT };
  }

  @Get('verify-invite')
  async verifyInvite(
    @Query('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { employeeId } = await this.verifyInviteUseCase.execute(token);

    // Create temp session
    const { rawToken: sessionId } = generateSecureToken();
    const redisKey = `invite:temp:${sessionId}`;

    await this.redisService.set(redisKey, employeeId, 10 * 60); // 10 min

    // Store temp session id
    res.cookie(
      INVITE_SESSION_COOKIE_NAME,
      sessionId,
      INVITE_SESSION_COOKIE_OPTIONS,
    );

    return { nextStep: 'SET_PASSWORD' };
  }

  @Post('set-password')
  async setPassword(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
    @Body('password') password: string,
  ) {
    const sessionId = req.cookies?.[INVITE_SESSION_COOKIE_NAME];

    if (!sessionId) {
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.INVITE_SESSION_EXPIRED);
    }

    const redisKey = `invite:temp:${sessionId}`;
    const employeeId = await this.redisService.get(redisKey);

    if (!employeeId) {
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.INVITE_SESSION_EXPIRED);
    }

    // 1️⃣ Set password
    const employee = await this.setPasswordUseCase.execute(
      employeeId,
      password,
    );

    // 2️⃣ Generate JWT tokens
    const accessToken = this.jwtService.generateAccessToken({
      userId: employee.id,
      role: employee.role,
      companyId: employee.companyId,
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      userId: employee.id,
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
    res.clearCookie(INVITE_SESSION_COOKIE_NAME);

    return {
      message: AUTH_MESSAGES.PASSWORD_SET,
    };
  }
}
