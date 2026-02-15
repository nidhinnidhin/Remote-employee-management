import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InviteLinkDocument,
  InviteLinkSchema,
} from '../../infrastructure/schema/invite-link.schema';
import {
  UserDocument,
  UserSchema,
} from '../../../auth/infrastructure/database/mongoose/schemas/userSchema';
import { EmployeesController } from '../controller/employees.controller';
import { InviteEmployeeUseCase } from '../../application/use-cases/invite-employee.usecase';
import { VerifyInviteUseCase } from '../../application/use-cases/verify-invite.usecase';
import { EmailService } from 'src/shared/services/email.service';
import { EmployeeRepositoryImpl } from '../../infrastructure/repository/employee.repository.impl';
import { InviteLinkRepositoryImpl } from '../../infrastructure/repository/invite-link.repository.impl';
import { SetPasswordUseCase } from '../../application/use-cases/set-password.usecase';
import { RedisService } from 'src/shared/services/redis.service';
import { JwtService } from 'src/shared/services/jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InviteLinkDocument.name, schema: InviteLinkSchema },
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [EmployeesController],
  providers: [
    InviteEmployeeUseCase,
    VerifyInviteUseCase,
    SetPasswordUseCase,
    EmailService,
    RedisService,
    JwtService,
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
export class EmployeesModule {}
