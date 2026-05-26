import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaveRequest, LeaveRequestSchema } from './infrastructure/database/mongoose/schemas/leave-request.schema';
import { MongoLeaveRequestRepository } from './infrastructure/database/repositories/mongo-leave-request.repository';
import { ApplyLeaveUseCase } from './application/use-cases/apply-leave.usecase';
import { ApproveLeaveUseCase } from './application/use-cases/approve-leave.usecase';
import { RejectLeaveUseCase } from './application/use-cases/reject-leave.usecase';
import { CancelLeaveUseCase } from './application/use-cases/cancel-leave.usecase';
import { GetEmployeeLeavesUseCase } from './application/use-cases/get-employee-leaves.usecase';
import { GetCompanyLeavesUseCase } from './application/use-cases/get-company-leaves.usecase';
import { GetLeaveBalanceUseCase } from './application/use-cases/get-leave-balance.usecase';
import { GetLeaveByIdUseCase } from './application/use-cases/get-leave-by-id.usecase';
import { LeaveController } from './presentation/controllers/leave.controller';
import { CompanyPolicyModule } from '../company-admin/company-policy.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LeaveRequest.name, schema: LeaveRequestSchema },
    ]),
    CompanyPolicyModule,
  ],
  controllers: [LeaveController],
  providers: [
    {
      provide: 'ILeaveRequestRepository',
      useClass: MongoLeaveRequestRepository,
    },
    {
      provide: 'IApplyLeaveUseCase',
      useClass: ApplyLeaveUseCase,
    },
    {
      provide: 'IApproveLeaveUseCase',
      useClass: ApproveLeaveUseCase,
    },
    {
      provide: 'IRejectLeaveUseCase',
      useClass: RejectLeaveUseCase,
    },
    {
      provide: 'ICancelLeaveUseCase',
      useClass: CancelLeaveUseCase,
    },
    {
      provide: 'IGetEmployeeLeavesUseCase',
      useClass: GetEmployeeLeavesUseCase,
    },
    {
      provide: 'IGetCompanyLeavesUseCase',
      useClass: GetCompanyLeavesUseCase,
    },
    {
      provide: 'IGetLeaveBalanceUseCase',
      useClass: GetLeaveBalanceUseCase,
    },
    {
      provide: 'IGetLeaveByIdUseCase',
      useClass: GetLeaveByIdUseCase,
    },
  ],
  exports: ['ILeaveRequestRepository'],
})
export class LeaveModule {}
