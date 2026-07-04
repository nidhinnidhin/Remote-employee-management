import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Inject,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { CompanyAdminGuard } from 'src/shared/guards/company-admin.guard';
import { SuperAdminGuard } from 'src/shared/guards/super-admin.guard';
import { ApiResponse } from 'src/common/response/api-response.util';
import { CreateTicketDto } from '../../application/dto/create-ticket.dto';
import { UpdateTicketStatusDto } from '../../application/dto/update-ticket-status.dto';
import type {
  ICreateTicketUseCase,
  IGetMyTicketsUseCase,
  IGetAllTicketsUseCase,
  IGetTicketByIdUseCase,
  IUpdateTicketStatusUseCase,
} from '../../application/interfaces/ticket-use-case.interface';
import { TicketPriority } from 'src/shared/enums/ticket/ticket-priority.enum';
import { TicketStatus } from 'src/shared/enums/ticket/ticket-status.enum';

interface AuthenticatedUser {
  userId: string;
  companyId: string;
  role: string;
}

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(
    @Inject('ICreateTicketUseCase')
    private readonly _createTicketUseCase: ICreateTicketUseCase,

    @Inject('IGetMyTicketsUseCase')
    private readonly _getMyTicketsUseCase: IGetMyTicketsUseCase,

    @Inject('IGetAllTicketsUseCase')
    private readonly _getAllTicketsUseCase: IGetAllTicketsUseCase,

    @Inject('IGetTicketByIdUseCase')
    private readonly _getTicketByIdUseCase: IGetTicketByIdUseCase,

    @Inject('IUpdateTicketStatusUseCase')
    private readonly _updateTicketStatusUseCase: IUpdateTicketStatusUseCase,
  ) {}

  // ─── Company Admin: Raise a ticket ───────────────────────────────────────────
  @Post()
  @UseGuards(CompanyAdminGuard)
  async createTicket(
    @Req() req: Request,
    @Body() dto: CreateTicketDto,
  ) {
    const { companyId, userId } = req.user as AuthenticatedUser;
    const ticket = await this._createTicketUseCase.execute(companyId, userId, dto);
    return ApiResponse.success(ticket, 'Ticket raised successfully.');
  }

  // ─── Company Admin: List own company tickets (paginated + filtered) ──────────
  @Get('my')
  @UseGuards(CompanyAdminGuard)
  async getMyTickets(
    @Req() req: Request,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('priority') priority?: TicketPriority,
    @Query('status') status?: TicketStatus,
  ) {
    const { companyId } = req.user as AuthenticatedUser;
    const result = await this._getMyTicketsUseCase.execute(
      companyId,
      parseInt(page, 10),
      parseInt(limit, 10),
      { search, priority, status },
    );
    return ApiResponse.success(result, 'Tickets fetched successfully.');
  }

  // ─── Super Admin: List all tickets across all companies ───────────────────────
  @Get()
  @UseGuards(SuperAdminGuard)
  async getAllTickets(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('priority') priority?: TicketPriority,
    @Query('status') status?: TicketStatus,
  ) {
    const result = await this._getAllTicketsUseCase.execute(
      parseInt(page, 10),
      parseInt(limit, 10),
      { search, priority, status },
    );
    return ApiResponse.success(result, 'All tickets fetched successfully.');
  }

  // ─── Super Admin: Update ticket status ───────────────────────────────────────
  @Patch(':id/status')
  @UseGuards(SuperAdminGuard)
  async updateTicketStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTicketStatusDto,
  ) {
    const ticket = await this._updateTicketStatusUseCase.execute(id, dto);
    return ApiResponse.success(ticket, 'Ticket status updated successfully.');
  }

  // ─── Shared: Get a single ticket by ID ───────────────────────────────────────
  @Get(':id')
  async getTicketById(@Param('id') id: string) {
    const ticket = await this._getTicketByIdUseCase.execute(id);
    return ApiResponse.success(ticket, 'Ticket fetched successfully.');
  }
}
