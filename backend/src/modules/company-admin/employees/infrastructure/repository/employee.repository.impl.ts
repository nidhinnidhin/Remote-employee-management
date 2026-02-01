import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { Employee } from '../../domain/entities/employee.entity';
import { EmployeeDocument } from '../schema/employee.schema';

export class EmployeeRepositoryImpl implements EmployeeRepository {
  constructor(
    @InjectModel(EmployeeDocument.name)
    private readonly model: Model<EmployeeDocument>,
  ) {}

  async create(input): Promise<Employee> {
    const doc = await this.model.create(input);

    return new Employee(
      doc.id,
      doc.name,
      doc.email,
      doc.role,
      doc.department,
      doc.isActive,
      doc.hasPassword,
      doc.inviteStatus,
    );
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const doc = await this.model.findOne({ email });
    if (!doc) return null;

    return new Employee(
      doc.id,
      doc.name,
      doc.email,
      doc.role,
      doc.department,
      doc.isActive,
      doc.hasPassword,
      doc.inviteStatus,
    );
  }

  async findById(id: string): Promise<Employee | null> {
    const doc = await this.model.findById(id);
    if (!doc) return null;

    return new Employee(
      doc.id,
      doc.name,
      doc.email,
      doc.role,
      doc.department,
      doc.isActive,
      doc.hasPassword,
      doc.inviteStatus,
    );
  }

  async activateEmployee(id: string): Promise<void> {
    await this.model.updateOne(
      { _id: id },
      {
        $set: {
          isActive: true,
          inviteStatus: 'USED',
        },
      },
    );
  }

  async setPassword(id: string, passwordHash: string): Promise<void> {
    await this.model.updateOne(
      { _id: id },
      {
        $set: {
          password: passwordHash,
          hasPassword: true,
        },
      },
    );
  }
}
