import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schema
import {
  TicketSchemaClass,
  TicketSchema,
} from './infrastructure/database/mongoose/schemas/ticket.schema';

// Repository
import { MongoTicketRepository } from './infrastructure/database/repositories/mongo-ticket.repository';

// Use Cases
import { CreateTicketUseCase } from './application/use-cases/create-ticket.usecase';
import { GetMyTicketsUseCase } from './application/use-cases/get-my-tickets.usecase';
import { GetAllTicketsUseCase } from './application/use-cases/get-all-tickets.usecase';
import { GetTicketByIdUseCase } from './application/use-cases/get-ticket-by-id.usecase';
import { UpdateTicketStatusUseCase } from './application/use-cases/update-ticket-status.usecase';

// Controller
import { TicketController } from './presentation/controllers/ticket.controller';

// Guards (CompanyAdminGuard depends on ICompanyRepository — import AuthModule)
import { AuthModule } from '../auth/presentation/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TicketSchemaClass.name, schema: TicketSchema },
    ]),
    AuthModule, // Provides ICompanyRepository (required by CompanyAdminGuard)
  ],
  controllers: [TicketController],
  providers: [
    { provide: 'ITicketRepository', useClass: MongoTicketRepository },
    { provide: 'ICreateTicketUseCase', useClass: CreateTicketUseCase },
    { provide: 'IGetMyTicketsUseCase', useClass: GetMyTicketsUseCase },
    { provide: 'IGetAllTicketsUseCase', useClass: GetAllTicketsUseCase },
    { provide: 'IGetTicketByIdUseCase', useClass: GetTicketByIdUseCase },
    {
      provide: 'IUpdateTicketStatusUseCase',
      useClass: UpdateTicketStatusUseCase,
    },
  ],
  exports: ['ITicketRepository'],
})
export class TicketModule {}
