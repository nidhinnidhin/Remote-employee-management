import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { Employee } from '../../domain/entities/employee.entity';
import { UserDocument } from '../../../auth/infrastructure/database/mongoose/schemas/userSchema';

export class EmployeeRepositoryImpl implements EmployeeRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly model: Model<UserDocument>,
  ) { }

  async create(input: any): Promise<Employee> {
    // Split name into firstName and lastName if possible
    const nameParts = input.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    const doc = await this.model.create({
      companyId: input.companyId || undefined,
      firstName,
      lastName: lastName || undefined,
      email: input.email.toLowerCase(),
      phone: input.phone || '',
      role: input.role,
      passwordHash: input.password || undefined,
      status: 'PENDING_VERIFICATION',
      department: input.department || undefined,
      inviteStatus: input.inviteStatus || 'PENDING',
      hasPassword: !!input.hasPassword,
    });

    return new Employee(
      doc.id,
      `${doc.firstName} ${doc.lastName}`.trim(),
      doc.email,
      doc.role,
      doc.department || '',
      doc.status === 'ACTIVE',
      doc.hasPassword,
      doc.inviteStatus || 'PENDING',
      doc.companyId,
    );
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const doc = await this.model.findOne({ email: email.toLowerCase() });
    if (!doc) return null;

    return new Employee(
      doc.id,
      `${doc.firstName} ${doc.lastName}`.trim(),
      doc.email,
      doc.role,
      doc.department || '',
      doc.status === 'ACTIVE',
      doc.hasPassword,
      doc.inviteStatus || 'PENDING',
      doc.companyId,
    );
  }

  async findById(id: string): Promise<Employee | null> {
    const doc = await this.model.findById(id);
    if (!doc) return null;

    return new Employee(
      doc.id,
      `${doc.firstName} ${doc.lastName}`.trim(),
      doc.email,
      doc.role,
      doc.department || '',
      doc.status === 'ACTIVE',
      doc.hasPassword,
      doc.inviteStatus || 'PENDING',
      doc.companyId,
    );
  }

  async activateEmployee(id: string): Promise<void> {
    await this.model.updateOne(
      { _id: id },
      {
        $set: {
          status: 'ACTIVE',
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
          passwordHash: passwordHash,
          hasPassword: true,
        },
      },
    );
  }
}
