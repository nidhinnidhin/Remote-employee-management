// src/modules/meeting/application/use-cases/end-meeting.usecase.ts
import { Injectable, Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IEndMeetingUseCase } from '../interfaces/meeting-use-cases.interface';
import type { IMeetingRepository } from '../../domain/repositories/imeeting.repository';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { MeetingResponseDto, ParticipantDetailsDto } from '../dto/meeting-response.dto';
import { MeetingStatus } from 'src/shared/enums/meeting/meeting-status.enum';
import { MeetingEntity } from '../../domain/entities/meeting.entity';

@Injectable()
export class EndMeetingUseCase implements IEndMeetingUseCase {
  constructor(
    @Inject('IMeetingRepository')
    private readonly _meetingRepository: IMeetingRepository,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(meetingId: string, companyId: string, userId: string): Promise<MeetingResponseDto> {
    const meeting = await this._meetingRepository.findById(meetingId);
    if (!meeting) throw new NotFoundException('Meeting not found');
    if (meeting.companyId !== companyId) throw new UnauthorizedException('Access denied');
    if (meeting.creatorId !== userId) throw new UnauthorizedException('Only creator can end the meeting');

    const updated = await this._meetingRepository.updateStatus(meetingId, MeetingStatus.ENDED, new Date());
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
