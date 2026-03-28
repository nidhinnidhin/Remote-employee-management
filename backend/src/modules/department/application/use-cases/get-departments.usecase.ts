import { Inject, Injectable } from '@nestjs/common';
import type { IDepartmentRepository } from '../../domain/repositories/idepartment.repository';
import { IGetDepartmentsUseCase } from '../interfaces/department-usecase.interface';

@Injectable()
export class GetDepartmentsUseCase implements IGetDepartmentsUseCase {
  constructor(
    @Inject('IDepartmentRepository')
    private readonly _departmentRepository: IDepartmentRepository,
  ) {}

  async execute(companyId: string) {
    return this._departmentRepository.findAllByCompanyId(companyId);
  }
}