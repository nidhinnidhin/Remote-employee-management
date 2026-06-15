// src/modules/meeting/application/mappers/meeting.mapper.ts
import { MeetingEntity } from '../../domain/entities/meeting.entity';
import { MeetingDocument } from '../../infrastructure/database/mongoose/schemas/meeting.schema';

export class MeetingMapper {
  static toDomain(document: MeetingDocument): MeetingEntity {
    return new MeetingEntity(
      document._id.toString(),
      document.companyId.toString(),
      document.creatorId.toString(),
      document.type,
      document.status,
      document.participants.map(p => p.toString()),
      document.scheduledAt,
      document.endedAt,
      (document as unknown as { createdAt: Date }).createdAt,
      (document as unknown as { updatedAt: Date }).updatedAt,
    );
  }
}
