import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  DepartmentDocument,
  DepartmentSchema,
} from '../infrastructure/database/mongoose/schemas/department.schema';

import { DepartmentController } from './controllers/department.controller';

import { MongoDepartmentRepository } from '../infrastructure/database/repositories/mongo-department.repository';

import { CreateDepartmentUseCase } from '../application/use-cases/create-department.usecase';
import { GetDepartmentsUseCase } from '../application/use-cases/get-departments.usecase';
import { AddEmployeeToDepartmentUseCase } from '../application/use-cases/add-employee-to-department.usecase';
import { UpdateDepartmentUseCase } from '../application/use-cases/update-department.usecase';
import { DeleteDepartmentUseCase } from '../application/use-cases/delete-department.usecase';
import { RemoveEmployeeFromDepartmentUseCase } from '../application/use-cases/remove-employee-from-department.usecase';

import { AuthModule } from '../../auth/presentation/auth/auth.module';
import { EmployeesModule } from '../../employees/employees.module';

@Module({
  imports: [
    AuthModule,
    EmployeesModule,
    MongooseModule.forFeature([
      { name: DepartmentDocument.name, schema: DepartmentSchema },
    ]),
  ],
  controllers: [DepartmentController],
  providers: [
    {
      provide: 'IDepartmentRepository',
      useClass: MongoDepartmentRepository,
    },
    {
      provide: 'ICreateDepartmentUseCase',
      useClass: CreateDepartmentUseCase,
    },
    {
      provide: 'IGetDepartmentsUseCase',
      useClass: GetDepartmentsUseCase,
    },
    {
      provide: 'IAddEmployeeToDepartmentUseCase',
      useClass: AddEmployeeToDepartmentUseCase,
    },
    {
      provide: 'IUpdateDepartmentUseCase',
      useClass: UpdateDepartmentUseCase,
    },
    {
      provide: 'IDeleteDepartmentUseCase',
      useClass: DeleteDepartmentUseCase,
    },
    {
      provide: 'IRemoveEmployeeFromDepartmentUseCase',
      useClass: RemoveEmployeeFromDepartmentUseCase,
    },
  ],
})
export class DepartmentModule {}
