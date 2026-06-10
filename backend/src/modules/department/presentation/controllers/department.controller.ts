import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/shared/types/express/authenticated-request.interface';

import type {
  ICreateDepartmentUseCase,
  IGetDepartmentsUseCase,
  IAddEmployeeToDepartmentUseCase,
  IUpdateDepartmentUseCase,
  IDeleteDepartmentUseCase,
  IRemoveEmployeeFromDepartmentUseCase,
  IGetEmployeeDepartmentsUseCase,
  ISearchDepartmentsUseCase,
} from '../../application/interfaces/department-usecase.interface';

import { CreateDepartmentDto } from '../../application/dto/create-department.dto';
import { SearchDepartmentsDto } from '../../application/dto/search-departments.dto';
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

    @Inject('IUpdateDepartmentUseCase')
    private readonly _updateDepartmentUseCase: IUpdateDepartmentUseCase,

    @Inject('IDeleteDepartmentUseCase')
    private readonly _deleteDepartmentUseCase: IDeleteDepartmentUseCase,

    @Inject('IRemoveEmployeeFromDepartmentUseCase')
    private readonly _removeEmployeeUseCase: IRemoveEmployeeFromDepartmentUseCase,

    @Inject('IGetEmployeeDepartmentsUseCase')
    private readonly _getEmployeeDepartmentsUseCase: IGetEmployeeDepartmentsUseCase,
    @Inject('ISearchDepartmentsUseCase')
    private readonly _searchDepartmentsUseCase: ISearchDepartmentsUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseGuards(CompanyAdminGuard)
  async create(@Body() createDepartmentDto: CreateDepartmentDto, @Req() req: AuthenticatedRequest) {
    const companyId = req.user.companyId;
    return this._createDepartmentUseCase.execute(createDepartmentDto.name, companyId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Req() req: AuthenticatedRequest) {
    const companyId = req.user.companyId;
    return this._getDepartmentsUseCase.execute(companyId);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async search(@Req() req: AuthenticatedRequest, @Query() dto: SearchDepartmentsDto) {
    const companyId = req.user.companyId;
    return this._searchDepartmentsUseCase.execute(companyId, dto);
  }

  @Get('my-departments')
  @UseGuards(JwtAuthGuard)
  async getMyDepartments(@Req() req: AuthenticatedRequest) {
    const employeeId = req.user.userId;
    const companyId = req.user.companyId;
    return this._getEmployeeDepartmentsUseCase.execute(employeeId, companyId);
  }

  @Post('add-employee')
  @UseGuards(JwtAuthGuard)
  @UseGuards(CompanyAdminGuard)
  async addEmployee(@Body() addEmployeeDto: AddEmployeeToDepartmentDto) {
    await this._addEmployeeUseCase.execute(addEmployeeDto.departmentId, addEmployeeDto.employeeId);

    return { message: EMPLOYEE_MESSAGES.EMPLOYEE_ADDED_TO_DEPARTMENT };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(CompanyAdminGuard)
  async update(@Param('id') id: string, @Body() updateDepartmentDto: CreateDepartmentDto) {
    await this._updateDepartmentUseCase.execute(id, updateDepartmentDto.name);
    return { message: 'Department updated successfully' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseGuards(CompanyAdminGuard)
  async delete(@Param('id') id: string) {
    await this._deleteDepartmentUseCase.execute(id);
    return { message: 'Department deleted successfully' };
  }

  @Post('remove-employee')
  @UseGuards(JwtAuthGuard)
  @UseGuards(CompanyAdminGuard)
  async removeEmployee(@Body() removeEmployeeDto: AddEmployeeToDepartmentDto) {
    await this._removeEmployeeUseCase.execute(removeEmployeeDto.departmentId, removeEmployeeDto.employeeId);
    return { message: 'Employee removed from department successfully' };
  }
}
