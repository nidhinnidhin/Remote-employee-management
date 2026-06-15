// src/modules/meeting/application/interfaces/meeting-use-cases.interface.ts
import { ScheduleMeetingDto } from '../dto/schedule-meeting.dto';
import { CreateInstantMeetingDto } from '../dto/create-instant-meeting.dto';
import { AddParticipantsDto } from '../dto/add-participants.dto';
import { MeetingResponseDto } from '../dto/meeting-response.dto';

export interface IScheduleMeetingUseCase {
  execute(companyId: string, creatorId: string, dto: ScheduleMeetingDto): Promise<MeetingResponseDto>;
}

export interface ICreateInstantMeetingUseCase {
  execute(companyId: string, creatorId: string, dto: CreateInstantMeetingDto): Promise<MeetingResponseDto>;
}

export interface IStartMeetingUseCase {
  execute(meetingId: string, companyId: string, userId: string): Promise<MeetingResponseDto>;
}

export interface IEndMeetingUseCase {
  execute(meetingId: string, companyId: string, userId: string): Promise<MeetingResponseDto>;
}

export interface IAddParticipantUseCase {
  execute(meetingId: string, companyId: string, userId: string, dto: AddParticipantsDto): Promise<MeetingResponseDto>;
}

export interface IRemoveParticipantUseCase {
  execute(meetingId: string, companyId: string, adminId: string, participantId: string): Promise<MeetingResponseDto>;
}
