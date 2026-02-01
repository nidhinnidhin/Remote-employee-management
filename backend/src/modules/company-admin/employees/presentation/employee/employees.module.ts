import { MongooseModule } from '@nestjs/mongoose';
import {
  InviteLinkDocument,
  InviteLinkSchema,
} from '../../infrastructure/schema/invite-link.schema';
import {
  EmployeeDocument,
  EmployeeSchema,
} from '../../infrastructure/schema/employee.schema';
import { EmployeesController } from '../controller/employees.controller';
import { InviteEmployeeUseCase } from '../../application/use-cases/invite-employee.usecase';
import { VerifyInviteUseCase } from '../../application/use-cases/verify-invite.usecase';
import { EmailService } from 'src/shared/services/email.service';
import { EmployeeRepositoryImpl } from '../../infrastructure/repository/employee.repository.impl';
import { InviteLinkRepositoryImpl } from '../../infrastructure/repository/invite-link.repository.impl';
import { Module } from '@nestjs/common';
import { SetPasswordUseCase } from '../../application/use-cases/set-password.usecase';
import { RedisService } from 'src/shared/services/redis.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InviteLinkDocument.name, schema: InviteLinkSchema },
      { name: EmployeeDocument.name, schema: EmployeeSchema },
    ]),
  ],
  controllers: [EmployeesController],
  providers: [
    InviteEmployeeUseCase,
    VerifyInviteUseCase,
    SetPasswordUseCase,
    EmailService,
    RedisService,
    {
      provide: 'EmployeeRepository',
      useClass: EmployeeRepositoryImpl,
    },
    {
      provide: 'InviteLinkRepository',
      useClass: InviteLinkRepositoryImpl,
    },
  ],
  exports: ['EmployeeRepository', 'InviteLinkRepository'],
})
export class EmployeesModule { }
