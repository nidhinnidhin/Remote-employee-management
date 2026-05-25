// src/modules/meeting/application/use-cases/create-instant-meeting.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import { ICreateInstantMeetingUseCase } from '../interfaces/meeting-use-cases.interface';
import type { IMeetingRepository } from '../../domain/repositories/imeeting.repository';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { CreateInstantMeetingDto } from '../dto/create-instant-meeting.dto';
import { MeetingEntity } from '../../domain/entities/meeting.entity';
import { MeetingResponseDto, ParticipantDetailsDto } from '../dto/meeting-response.dto';
import { MeetingType } from 'src/shared/enums/meeting/meeting-type.enum';
import { MeetingStatus } from 'src/shared/enums/meeting/meeting-status.enum';

@Injectable()
export class CreateInstantMeetingUseCase implements ICreateInstantMeetingUseCase {
  constructor(
    @Inject('IMeetingRepository')
    private readonly _meetingRepository: IMeetingRepository,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(companyId: string, creatorId: string, dto: CreateInstantMeetingDto): Promise<MeetingResponseDto> {
    const participants = Array.from(new Set([...dto.participants, creatorId]));

    const meeting = new MeetingEntity(
      '',
      companyId,
      creatorId,
      MeetingType.INSTANT,
      MeetingStatus.ONGOING,
      participants,
    );

    const created = await this._meetingRepository.create(meeting);
    return this.enrichMeeting(created);
  }

  private async enrichMeeting(meeting: MeetingEntity): Promise<MeetingResponseDto> {
    const participants = await this._userRepository.findAll({
      _id: { $in: meeting.participants }
    });

    const participantDetails: ParticipantDetailsDto[] = participants.map(p => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      email: p.email,
      avatar: p.profileImageUrl
    }));

    return {
      ...meeting,
      participantDetails
    };
  }
}
