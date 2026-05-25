// src/modules/meeting/infrastructure/database/repositories/mongo-meeting.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IMeetingRepository } from '../../../domain/repositories/imeeting.repository';
import { MeetingEntity } from '../../../domain/entities/meeting.entity';
import { Meeting, MeetingDocument } from '../mongoose/schemas/meeting.schema';
import { MeetingMapper } from '../../../application/mappers/meeting.mapper';
import { MeetingStatus } from 'src/shared/enums/meeting/meeting-status.enum';

@Injectable()
export class MongoMeetingRepository implements IMeetingRepository {
  constructor(
    @InjectModel(Meeting.name)
    private readonly _meetingModel: Model<MeetingDocument>,
  ) {}

  async create(meeting: MeetingEntity): Promise<MeetingEntity> {
    const created = await this._meetingModel.create({
      companyId: new Types.ObjectId(meeting.companyId),
      creatorId: new Types.ObjectId(meeting.creatorId),
      type: meeting.type,
      status: meeting.status,
      participants: meeting.participants.map(p => new Types.ObjectId(p)),
      scheduledAt: meeting.scheduledAt,
      endedAt: meeting.endedAt,
    });
    return MeetingMapper.toDomain(created);
  }

  async findById(id: string): Promise<MeetingEntity | null> {
    const found = await this._meetingModel.findById(id);
    return found ? MeetingMapper.toDomain(found) : null;
  }

  async findByCompanyId(companyId: string): Promise<MeetingEntity[]> {
    const meetings = await this._meetingModel.find({ companyId: new Types.ObjectId(companyId) }).sort({ createdAt: -1 });
    return meetings.map(MeetingMapper.toDomain);
  }

  async updateStatus(id: string, status: MeetingStatus, endedAt?: Date): Promise<MeetingEntity | null> {
    const updated = await this._meetingModel.findByIdAndUpdate(
      id,
      { status, ...(endedAt && { endedAt }) },
      { new: true }
    );
    return updated ? MeetingMapper.toDomain(updated) : null;
  }

  async addParticipants(id: string, participants: string[]): Promise<MeetingEntity | null> {
    const objectIds = participants.map(p => new Types.ObjectId(p));
    const updated = await this._meetingModel.findByIdAndUpdate(
      id,
      { $addToSet: { participants: { $each: objectIds } } },
      { new: true }
    );
    return updated ? MeetingMapper.toDomain(updated) : null;
  }

  async removeParticipant(id: string, participantId: string): Promise<MeetingEntity | null> {
    const updated = await this._meetingModel.findByIdAndUpdate(
      id,
      { $pull: { participants: new Types.ObjectId(participantId) } },
      { new: true }
    );
    return updated ? MeetingMapper.toDomain(updated) : null;
  }
}
