import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import type { Request } from 'express';

import type {
  ICreateDepartmentUseCase,
  IGetDepartmentsUseCase,
  IAddEmployeeToDepartmentUseCase,
} from '../../application/interfaces/department-usecase.interface';

import { CreateDepartmentDto } from '../../application/dto/create-department.dto';
import { AddEmployeeToDepartmentDto } from '../../application/dto/add-employee-to-department.dto';
import { CompanyAdminGuard } from 'src/shared/guards/company-admin.guard';
import { EMPLOYEE_MESSAGES } from 'src/shared/constants/messages/employee/employee.messages';

@Controller('departments')
@UseGuards(JwtAuthGuard)
export class DepartmentController {
  constructor(
    @Inject('ICreateDepartmentUseCase')
    private readonly _createDepartmentUseCase: ICreateDepartmentUseCase,

    @Inject('IGetDepartmentsUseCase')
    private readonly _getDepartmentsUseCase: IGetDepartmentsUseCase,

    @Inject('IAddEmployeeToDepartmentUseCase')
    private readonly _addEmployeeUseCase: IAddEmployeeToDepartmentUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseGuards(CompanyAdminGuard)
  async create(@Body() createDepartmentDto: CreateDepartmentDto, @Req() req: Request) {
    const companyId = (req.user as any).companyId;
    return this._createDepartmentUseCase.execute(createDepartmentDto.name, companyId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseGuards(CompanyAdminGuard)
  async getAll(@Req() req: Request) {
    const companyId = (req.user as any).companyId;
    return this._getDepartmentsUseCase.execute(companyId);
  }

  @Post('add-employee')
  @UseGuards(JwtAuthGuard)
  @UseGuards(CompanyAdminGuard)
  async addEmployee(@Body() addEmployeeDto: AddEmployeeToDepartmentDto) {
    await this._addEmployeeUseCase.execute(addEmployeeDto.departmentId, addEmployeeDto.employeeId);

    return { message: EMPLOYEE_MESSAGES.EMPLOYEE_ADDED_TO_DEPARTMENT};
  }
}
