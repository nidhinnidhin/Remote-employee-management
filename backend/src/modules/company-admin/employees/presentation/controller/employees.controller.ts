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

@Controller('company/employees')
export class EmployeesController {
  constructor(
    private readonly inviteEmployee: InviteEmployeeUseCase,
    private readonly verifyInviteUseCase: VerifyInviteUseCase,
    private readonly setPasswordUseCase: SetPasswordUseCase,
    private readonly redisService: RedisService,
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
  async setPassword(@Req() req, @Body('password') password: string) {
    const sessionId = req.cookies?.invite_session;

    if (!sessionId) {
      throw new UnauthorizedException('Invite session expired');
    }

    const redisKey = `invite:temp:${sessionId}`;
    const employeeId = await this.redisService.get(redisKey);

    if (!employeeId) {
      throw new UnauthorizedException('Invite session expired');
    }

    // 🔒 Set password
    const result = await this.setPasswordUseCase.execute(employeeId, password);

    // 🧹 Cleanup
    await this.redisService.del(redisKey);
    req.res.clearCookie('invite_session');

    return result;
  }
}
