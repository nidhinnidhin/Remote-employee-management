// src/modules/meeting/application/use-cases/add-participant.usecase.ts
import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IAddParticipantUseCase } from '../interfaces/meeting-use-cases.interface';
import type { IMeetingRepository } from '../../domain/repositories/imeeting.repository';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { AddParticipantsDto } from '../dto/add-participants.dto';
import { MeetingResponseDto, ParticipantDetailsDto } from '../dto/meeting-response.dto';
import { MeetingEntity } from '../../domain/entities/meeting.entity';

@Injectable()
export class AddParticipantUseCase implements IAddParticipantUseCase {
  constructor(
    @Inject('IMeetingRepository')
    private readonly _meetingRepository: IMeetingRepository,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(meetingId: string, companyId: string, userId: string, dto: AddParticipantsDto): Promise<MeetingResponseDto> {
    const meeting = await this._meetingRepository.findById(meetingId);
    if (!meeting) throw new NotFoundException('Meeting not found');
    if (meeting.companyId !== companyId) throw new UnauthorizedException('Access denied');
    if (meeting.creatorId !== userId) throw new UnauthorizedException('Only creator can add participants');

    const updated = await this._meetingRepository.addParticipants(meetingId, dto.participants);
    return this.enrichMeeting(updated!);
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
