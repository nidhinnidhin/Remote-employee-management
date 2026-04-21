import { Inject, Injectable } from '@nestjs/common';
import type { IDepartmentRepository } from '../../domain/repositories/idepartment.repository';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { IAddEmployeeToDepartmentUseCase } from '../interfaces/department-usecase.interface';

@Injectable()
export class AddEmployeeToDepartmentUseCase
  implements IAddEmployeeToDepartmentUseCase
{
  constructor(
    @Inject('IDepartmentRepository')
    private readonly _departmentRepository: IDepartmentRepository,

    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(departmentId: string, employeeId: string) {
    // add to department
    await this._departmentRepository.addEmployee(
      departmentId,
      employeeId,
    );

    // 🔥 sync user (VERY IMPORTANT)
    await this._userRepository.updateUserFieldsById(employeeId, {
      department: departmentId,
    });
  }
}