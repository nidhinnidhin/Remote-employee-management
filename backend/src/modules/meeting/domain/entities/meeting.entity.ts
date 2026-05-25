// src/modules/meeting/domain/entities/meeting.entity.ts
import { MeetingType } from 'src/shared/enums/meeting/meeting-type.enum';
import { MeetingStatus } from 'src/shared/enums/meeting/meeting-status.enum';

export class MeetingEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly creatorId: string,
    public readonly type: MeetingType,
    public status: MeetingStatus,
    public readonly participants: string[], // Array of Employee IDs
    public readonly scheduledAt?: Date,
    public readonly endedAt?: Date,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
