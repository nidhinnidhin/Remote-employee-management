// src/modules/meeting/presentation/controllers/meeting.controller.ts
import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, Inject, Req, NotFoundException, Query } from '@nestjs/common';
import type { AuthenticatedRequest } from 'src/shared/types/express/authenticated-request.interface';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { ApiResponse } from 'src/common/response/api-response.util';
import { ScheduleMeetingDto } from '../../application/dto/schedule-meeting.dto';
import { CreateInstantMeetingDto } from '../../application/dto/create-instant-meeting.dto';
import { AddParticipantsDto } from '../../application/dto/add-participants.dto';
import type { 
  IScheduleMeetingUseCase, 
  ICreateInstantMeetingUseCase,
  IStartMeetingUseCase,
  IEndMeetingUseCase,
  IAddParticipantUseCase,
  IRemoveParticipantUseCase
} from '../../application/interfaces/meeting-use-cases.interface';
import type { IMeetingRepository } from '../../domain/repositories/imeeting.repository';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { MeetingGateway } from '../gateways/meeting.gateway';

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingController {
  constructor(
    @Inject('IScheduleMeetingUseCase')
    private readonly _scheduleMeetingUseCase: IScheduleMeetingUseCase,
    @Inject('ICreateInstantMeetingUseCase')
    private readonly _createInstantMeetingUseCase: ICreateInstantMeetingUseCase,
    @Inject('IStartMeetingUseCase')
    private readonly _startMeetingUseCase: IStartMeetingUseCase,
    @Inject('IEndMeetingUseCase')
    private readonly _endMeetingUseCase: IEndMeetingUseCase,
    @Inject('IAddParticipantUseCase')
    private readonly _addParticipantUseCase: IAddParticipantUseCase,
    @Inject('IRemoveParticipantUseCase')
    private readonly _removeParticipantUseCase: IRemoveParticipantUseCase,
    @Inject('IMeetingRepository')
    private readonly _meetingRepository: IMeetingRepository,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    private readonly _meetingGateway: MeetingGateway,
  ) {}

  @Post('schedule')
  async scheduleMeeting(@Req() req: AuthenticatedRequest, @Body() dto: ScheduleMeetingDto) {
    const { companyId, userId } = req.user;
    const meeting = await this._scheduleMeetingUseCase.execute(companyId, userId, dto);
    return ApiResponse.success(meeting, 'Meeting scheduled successfully');
  }

  @Get()
  async getMeetings(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const { companyId } = req.user;
    const pageNum = parseInt(page || '1', 10);
    const limitNum = parseInt(limit || '9', 10); 

    const { meetings, total } = await this._meetingRepository.findByCompanyId(companyId, pageNum, limitNum);
    
    return ApiResponse.success({
      meetings,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      }
    }, 'Meetings fetched successfully');
  }

  @Get(':id')
  async getMeetingById(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const meeting = await this._meetingRepository.findById(id);
    if (!meeting) throw new NotFoundException('Meeting not found');

    const users = await this._userRepository.findAll({ _id: { $in: meeting.participants } });
    const participantDetails = users.map(u => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      avatar: u.profileImageUrl,
    }));

    return ApiResponse.success({
      id: meeting.id,
      companyId: meeting.companyId,
      creatorId: meeting.creatorId,
      type: meeting.type,
      status: meeting.status,
      participants: meeting.participants,
      scheduledAt: meeting.scheduledAt,
      endedAt: meeting.endedAt,
      createdAt: meeting.createdAt,
      updatedAt: meeting.updatedAt,
      participantDetails
    }, 'Meeting fetched successfully');
  }

  @Post('instant')
  async createInstantMeeting(@Req() req: AuthenticatedRequest, @Body() dto: CreateInstantMeetingDto) {
    const { companyId, userId } = req.user;
    const meeting = await this._createInstantMeetingUseCase.execute(companyId, userId, dto);
    return ApiResponse.success(meeting, 'Instant meeting created successfully');
  }

  @Put(':id/start')
  async startMeeting(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const { companyId, userId } = req.user;
    const meeting = await this._startMeetingUseCase.execute(id, companyId, userId);
    return ApiResponse.success(meeting, 'Meeting started successfully');
  }

  @Put(':id/end')
  async endMeeting(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    const { companyId, userId } = req.user;
    const meeting = await this._endMeetingUseCase.execute(id, companyId, userId);
    
    this._meetingGateway.notifyMeetingEnded(id);
    
    return ApiResponse.success(meeting, 'Meeting ended successfully');
  }

  @Put(':id/participants')
  async addParticipants(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() dto: AddParticipantsDto) {
    const { companyId, userId } = req.user;
    const meeting = await this._addParticipantUseCase.execute(id, companyId, userId, dto);
    return ApiResponse.success(meeting, 'Participants added successfully');
  }

  @Delete(':id/participants/:participantId')
  async removeParticipant(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Param('participantId') participantId: string) {
    const { companyId, userId } = req.user; // userId here is the admin who is requesting to remove participant
    const meeting = await this._removeParticipantUseCase.execute(id, companyId, userId, participantId);
    
    // Notify the removed participant
    this._meetingGateway.notifyParticipantKicked(id, participantId);
    
    return ApiResponse.success(meeting, 'Participant removed successfully');
  }
}
