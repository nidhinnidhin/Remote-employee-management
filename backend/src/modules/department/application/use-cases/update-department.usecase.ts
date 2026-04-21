import { Inject, Injectable } from '@nestjs/common';
import { IUpdateDepartmentUseCase } from '../interfaces/department-usecase.interface';
import type { IDepartmentRepository } from '../../domain/repositories/idepartment.repository';

@Injectable()
export class UpdateDepartmentUseCase implements IUpdateDepartmentUseCase {
  constructor(
    @Inject('IDepartmentRepository')
    private readonly _departmentRepository: IDepartmentRepository,
  ) {}

  async execute(id: string, name: string): Promise<void> {
    const department = await this._departmentRepository.findById(id);
    if (!department) {
      throw new Error('Department not found');
    }

    await this._departmentRepository.update(id, name);
  }
}
