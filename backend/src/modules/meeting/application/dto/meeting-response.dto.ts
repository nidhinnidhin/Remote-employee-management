// src/modules/meeting/application/dto/meeting-response.dto.ts
import { MeetingType } from 'src/shared/enums/meeting/meeting-type.enum';
import { MeetingStatus } from 'src/shared/enums/meeting/meeting-status.enum';

export interface ParticipantDetailsDto {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface MeetingResponseDto {
  id: string;
  companyId: string;
  creatorId: string;
  type: MeetingType;
  status: MeetingStatus;
  participants: string[]; // Keep raw IDs if needed
  participantDetails?: ParticipantDetailsDto[];
  scheduledAt?: Date;
  endedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
