// src/modules/meeting/application/use-cases/remove-participant.usecase.ts
import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IRemoveParticipantUseCase } from '../interfaces/meeting-use-cases.interface';
import type { IMeetingRepository } from '../../domain/repositories/imeeting.repository';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { MeetingResponseDto, ParticipantDetailsDto } from '../dto/meeting-response.dto';
import { MeetingEntity } from '../../domain/entities/meeting.entity';

@Injectable()
export class RemoveParticipantUseCase implements IRemoveParticipantUseCase {
  constructor(
    @Inject('IMeetingRepository')
    private readonly _meetingRepository: IMeetingRepository,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(meetingId: string, companyId: string, adminId: string, participantId: string): Promise<MeetingResponseDto> {
    const meeting = await this._meetingRepository.findById(meetingId);
    if (!meeting) throw new NotFoundException('Meeting not found');
    if (meeting.companyId !== companyId) throw new UnauthorizedException('Access denied');
    if (meeting.creatorId !== adminId) throw new UnauthorizedException('Only creator can remove participants');
    if (meeting.creatorId === participantId) throw new UnauthorizedException('Creator cannot be removed');

    const updated = await this._meetingRepository.removeParticipant(meetingId, participantId);
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
