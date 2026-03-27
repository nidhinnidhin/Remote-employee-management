import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  Inject,
  UseGuards,
} from '@nestjs/common';
import type {
  IInviteEmployeeUseCase,
  IVerifyInviteUseCase,
  ISetPasswordUseCase,
  IGetEmployeesUseCase,
  IUpdateEmployeeStatusUseCase,
} from '../../application/interfaces/employee-use-cases.interface';
import type { IRedisService } from 'src/shared/services/redis/interfaces/iredis.service';
import type { Request, Response } from 'express';
import type { IJwtService } from 'src/shared/services/auth/interfaces/ijwt.service';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  INVITE_SESSION_COOKIE_NAME,
  INVITE_SESSION_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from 'src/shared/config/cookies.config';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { InviteEmployeeDto } from '../../application/dto/invite-employee.dto';
import { EMPLOYEE_MESSAGES } from 'src/shared/constants/messages/employee/employee.messages';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { POLICY_MESSAGES } from 'src/shared/constants/messages/company-policy/company-policy.message';
import { generateSecureToken } from 'src/shared/utils/token.util';
import type { IEmployeeRepository } from '../../domain/repositories/employee.repository';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';

@Controller('company/employees')
export class EmployeesController {
  constructor(
    @Inject('IInviteEmployeeUseCase')
    private readonly _inviteEmployee: IInviteEmployeeUseCase,
    @Inject('IVerifyInviteUseCase')
    private readonly _verifyInviteUseCase: IVerifyInviteUseCase,
    @Inject('ISetPasswordUseCase')
    private readonly _setPasswordUseCase: ISetPasswordUseCase,
    @Inject('IGetEmployeesUseCase')
    private readonly _getEmployeesUseCase: IGetEmployeesUseCase,
    @Inject('IUpdateEmployeeStatusUseCase')
    private readonly _updateEmployeeStatusUseCase: IUpdateEmployeeStatusUseCase,
    @Inject('IEmployeeRepository')
    private readonly _employeeRepo: IEmployeeRepository,
    @Inject('IRedisService')
    private readonly _redisService: IRedisService,
    @Inject('IJwtService')
    private readonly _jwtService: IJwtService,
  ) {
    console.log('[EmployeesController] Initialized');
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: Request) {
    console.log(
      '[EmployeesController] findAll called for company:',
      req.user?.companyId,
    );
    const companyId = req.user?.companyId;
    if (!companyId) {
      throw new UnauthorizedException(POLICY_MESSAGES.COMPANY_ID_NOT_FOUND);
    }
    return await this._getEmployeesUseCase.execute(companyId);
  }

  @Get('verify-invite')
  async verifyInvite(
    @Query('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { employeeId } = await this._verifyInviteUseCase.execute(token);

    // Create temp session
    const { rawToken: sessionId } = generateSecureToken();
    const redisKey = `invite:temp:${sessionId}`;

    await this._redisService.set(redisKey, employeeId, 10 * 60); // 10 min

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
    const employeeId = await this._redisService.get(redisKey);

    if (!employeeId) {
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.INVITE_SESSION_EXPIRED);
    }

    // 1️⃣ Set password
    const employee = await this._setPasswordUseCase.execute(
      employeeId,
      password,
    );

    // 2️⃣ Generate JWT tokens
    const accessToken = this._jwtService.generateAccessToken({
      userId: employee.id,
      role: employee.role,
      companyId: employee.companyId,
    });

    const refreshToken = this._jwtService.generateRefreshToken({
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
    await this._redisService.del(redisKey);
    res.clearCookie(INVITE_SESSION_COOKIE_NAME);

    return {
      message: AUTH_MESSAGES.PASSWORD_SET,
      accessToken,
      user: {
        id: employee.id,
        email: employee.email,
        role: employee.role,
        companyId: employee.companyId,
      },
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    // Basic check: employee should belong to the same company
    const employee = await this._employeeRepo.findById(id);
    if (!employee || employee.companyId !== req.user?.companyId) {
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND);
    }
    return employee;
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Req() req: Request,
    @Param('id') id: string,
    @Body('status') status: UserStatus,
    @Body('reason') reason?: string,
  ) {
    // Basic check: employee should belong to the same company
    const employee = await this._employeeRepo.findById(id);
    if (!employee || employee.companyId !== req.user?.companyId) {
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    await this._updateEmployeeStatusUseCase.execute(id, status, reason);
    return { message: 'Employee status updated successfully' };
  }

  @Post('invite')
  @UseGuards(JwtAuthGuard)
  async invite(@Req() req: Request, @Body() InviteEmployeeDto: InviteEmployeeDto) {
    const companyId = req.user?.companyId;
    if (!companyId) {
      throw new UnauthorizedException(POLICY_MESSAGES.COMPANY_ID_NOT_FOUND);
    }

    await this._inviteEmployee.execute({
      ...InviteEmployeeDto,
      companyId,
    });
    return { message: EMPLOYEE_MESSAGES.INVITATION_SENT };
  }

  @Post(':id/resend-invite')
  @UseGuards(JwtAuthGuard)
  async resendInvite(@Req() req: Request, @Param('id') id: string) {
    const companyId = req.user?.companyId;
    if (!companyId) {
      throw new UnauthorizedException(POLICY_MESSAGES.COMPANY_ID_NOT_FOUND);
    }

    const employee = await this._employeeRepo.findById(id);
    if (!employee || employee.companyId !== companyId) {
      throw new UnauthorizedException(EMPLOYEE_MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    await this._inviteEmployee.execute({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      phone: employee.phone,
      companyId,
    });

    return { message: EMPLOYEE_MESSAGES.INVITATION_SENT };
  }
}
