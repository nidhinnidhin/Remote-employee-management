import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/presentation/auth/auth.module';
import {
  InviteLinkDocument,
  InviteLinkSchema,
} from './infrastructure/schema/invite-link.schema';
import { UserDocument, UserSchema } from 'src/modules/auth/infrastructure/database/mongoose/schemas/userSchema';
import { EmployeesController } from './presentation/controller/employees.controller';
import { InviteEmployeeUseCase } from './application/use-cases/invite-employee.usecase';
import { VerifyInviteUseCase } from './application/use-cases/verify-invite.usecase';
import { GetEmployeesUseCase } from './application/use-cases/get-employees.usecase';
import { UpdateEmployeeStatusUseCase } from './application/use-cases/update-employee-status.usecase';
import { EmailService } from 'src/shared/services/email.service';
import { EmployeeRepositoryImpl } from './infrastructure/repository/employee.repository.impl';
import { InviteLinkRepositoryImpl } from './infrastructure/repository/invite-link.repository.impl';
import { SetPasswordUseCase } from './application/use-cases/set-password.usecase';
import { RedisService } from 'src/shared/services/redis.service';
import { JwtService } from 'src/shared/services/jwt.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: InviteLinkDocument.name, schema: InviteLinkSchema },
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [EmployeesController],
  providers: [
    {
      provide: 'IInviteEmployeeUseCase',
      useClass: InviteEmployeeUseCase,
    },
    {
      provide: 'IVerifyInviteUseCase',
      useClass: VerifyInviteUseCase,
    },
    {
      provide: 'ISetPasswordUseCase',
      useClass: SetPasswordUseCase,
    },
    {
      provide: 'IGetEmployeesUseCase',
      useClass: GetEmployeesUseCase,
    },
    {
      provide: 'IUpdateEmployeeStatusUseCase',
      useClass: UpdateEmployeeStatusUseCase,
    },
    EmailService,
    RedisService,
    JwtService,
    {
      provide: 'IEmployeeRepository',
      useClass: EmployeeRepositoryImpl,
    },
    {
      provide: 'IInviteLinkRepository',
      useClass: InviteLinkRepositoryImpl,
    },
  ],
  exports: ['IEmployeeRepository', 'IInviteLinkRepository'],
})
export class EmployeesModule { }
