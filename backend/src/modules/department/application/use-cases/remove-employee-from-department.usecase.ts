import { Inject, Injectable } from '@nestjs/common';
import type { IDepartmentRepository } from '../../domain/repositories/idepartment.repository';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { IRemoveEmployeeFromDepartmentUseCase } from '../interfaces/department-usecase.interface';

@Injectable()
export class RemoveEmployeeFromDepartmentUseCase
  implements IRemoveEmployeeFromDepartmentUseCase
{
  constructor(
    @Inject('IDepartmentRepository')
    private readonly _departmentRepository: IDepartmentRepository,

    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(departmentId: string, employeeId: string) {
    // remove from department record
    await this._departmentRepository.removeEmployee(
      departmentId,
      employeeId,
    );

    // clear user's department field
    await this._userRepository.updateUserFieldsById(employeeId, {
      department: undefined,
    });
  }
}
