import { Inject, Injectable } from '@nestjs/common';
import { IDeleteDepartmentUseCase } from '../interfaces/department-usecase.interface';
import type { IDepartmentRepository } from '../../domain/repositories/idepartment.repository';

@Injectable()
export class DeleteDepartmentUseCase implements IDeleteDepartmentUseCase {
  constructor(
    @Inject('IDepartmentRepository')
    private readonly _departmentRepository: IDepartmentRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const department = await this._departmentRepository.findById(id);
    if (!department) {
      throw new Error('Department not found');
    }

    await this._departmentRepository.delete(id);
  }
}
