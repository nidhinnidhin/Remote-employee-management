// src/modules/meeting/domain/repositories/imeeting.repository.ts
import { MeetingEntity } from '../entities/meeting.entity';
import { MeetingStatus } from 'src/shared/enums/meeting/meeting-status.enum';

export interface IMeetingRepository {
  create(meeting: MeetingEntity): Promise<MeetingEntity>;
  findById(id: string): Promise<MeetingEntity | null>;
  findByCompanyId(companyId: string): Promise<MeetingEntity[]>;
  updateStatus(id: string, status: MeetingStatus, endedAt?: Date): Promise<MeetingEntity | null>;
  addParticipants(id: string, participants: string[]): Promise<MeetingEntity | null>;
  removeParticipant(id: string, participantId: string): Promise<MeetingEntity | null>;
}
