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

import { AuthModule } from '../../auth/presentation/auth/auth.module';

@Module({
  imports: [
    AuthModule,
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
  ],
})
export class DepartmentModule {}
