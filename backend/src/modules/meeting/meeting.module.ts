// src/modules/meeting/meeting.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MeetingController } from './presentation/controllers/meeting.controller';
import { MeetingGateway } from './presentation/gateways/meeting.gateway';
import { Meeting, MeetingSchema } from './infrastructure/database/mongoose/schemas/meeting.schema';
import { MongoMeetingRepository } from './infrastructure/database/repositories/mongo-meeting.repository';
import { ScheduleMeetingUseCase } from './application/use-cases/schedule-meeting.usecase';
import { CreateInstantMeetingUseCase } from './application/use-cases/create-instant-meeting.usecase';
import { StartMeetingUseCase } from './application/use-cases/start-meeting.usecase';
import { EndMeetingUseCase } from './application/use-cases/end-meeting.usecase';
import { AddParticipantUseCase } from './application/use-cases/add-participant.usecase';
import { RemoveParticipantUseCase } from './application/use-cases/remove-participant.usecase';
import { AuthModule } from '../auth/presentation/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Meeting.name, schema: MeetingSchema },
    ]),
    AuthModule, // Required for IUserRepository and WsJwtGuard
  ],
  controllers: [MeetingController],
  providers: [
    MeetingGateway,
    {
      provide: 'IMeetingRepository',
      useClass: MongoMeetingRepository,
    },
    {
      provide: 'IScheduleMeetingUseCase',
      useClass: ScheduleMeetingUseCase,
    },
    {
      provide: 'ICreateInstantMeetingUseCase',
      useClass: CreateInstantMeetingUseCase,
    },
    {
      provide: 'IStartMeetingUseCase',
      useClass: StartMeetingUseCase,
    },
    {
      provide: 'IEndMeetingUseCase',
      useClass: EndMeetingUseCase,
    },
    {
      provide: 'IAddParticipantUseCase',
      useClass: AddParticipantUseCase,
    },
    {
      provide: 'IRemoveParticipantUseCase',
      useClass: RemoveParticipantUseCase,
    },
  ],
  exports: [MeetingGateway],
})
export class MeetingModule {}
