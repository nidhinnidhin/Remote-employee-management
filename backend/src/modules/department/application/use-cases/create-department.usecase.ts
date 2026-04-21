import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IDepartmentRepository } from '../../domain/repositories/idepartment.repository';
import { DepartmentEntity } from '../../domain/entities/department.entity';
import { ICreateDepartmentUseCase } from '../interfaces/department-usecase.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CreateDepartmentUseCase implements ICreateDepartmentUseCase {
  constructor(
    @Inject('IDepartmentRepository')
    private readonly _departmentRepository: IDepartmentRepository,
  ) {}

  async execute(name: string, companyId: string) {
    const trimmedName = name.trim();

    const exists = await this._departmentRepository.existsByNameAndCompany(
      trimmedName,
      companyId,
    );

    if (exists) {
      throw new BadRequestException('Department with this name already exists');
    }

    const department = new DepartmentEntity(
      uuid(),
      trimmedName,
      companyId,
      [],
      new Date(),
      new Date(),
    );

    return this._departmentRepository.create(department);
  }
}
