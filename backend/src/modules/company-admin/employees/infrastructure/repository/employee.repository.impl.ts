import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { Employee } from '../../domain/entities/employee.entity';
import { UserDocument } from 'src/modules/auth/infrastructure/database/mongoose/schemas/userSchema';
import { InviteStatus } from 'src/shared/enums/user/user-invite-status.enum';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { UserRole } from 'src/shared/enums/user/user-role.enum';

@Injectable()
export class EmployeeRepositoryImpl implements EmployeeRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly model: Model<UserDocument>,
  ) { }

  private mapToEntity(doc: any): Employee {
    return new Employee(
      doc.id,
      `${doc.firstName} ${doc.lastName}`.trim(),
      doc.email,
      doc.role,
      doc.department || '',
      doc.status === UserStatus.ACTIVE,
      doc.hasPassword,
      doc.inviteStatus || InviteStatus.PENDING,
      doc.companyId,
    );
  }

  async create(input: any): Promise<Employee> {
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
      status: UserStatus.PENDING_VERIFICATION,
      department: input.department || undefined,
      inviteStatus: input.inviteStatus || InviteStatus.PENDING,
      hasPassword: !!input.hasPassword,
      isOnboarded: input.isOnboarded,
    });

    return this.mapToEntity(doc);
  }

  async findByEmail(email: string): Promise<Employee | null> {
    const doc = await this.model.findOne({ email: email.toLowerCase() });
    if (!doc) return null;
    return this.mapToEntity(doc);
  }

  async findById(id: string): Promise<Employee | null> {
    const doc = await this.model.findById(id);
    if (!doc) return null;
    return this.mapToEntity(doc);
  }

  async findAllByCompanyId(companyId: string): Promise<Employee[]> {
    const docs = await this.model.find({
      companyId,
      role: UserRole.EMPLOYEE
    });
    return docs.map(doc => this.mapToEntity(doc));
  }

  async updateStatus(id: string, status: UserStatus): Promise<void> {
    await this.model.updateOne({ _id: id }, { $set: { status } });
  }

  async update(id: string, input: {
    name?: string;
    role?: string;
    department?: string;
    phone?: string;
    companyId?: string;
  }): Promise<void> {
    const updateData: any = {};
    if (input.name) {
      const nameParts = input.name.split(' ');
      updateData.firstName = nameParts[0];
      updateData.lastName = nameParts.slice(1).join(' ') || '';
    }
    if (input.role) updateData.role = input.role;
    if (input.department) updateData.department = input.department;
    if (input.phone) updateData.phone = input.phone;
    if (input.companyId) updateData.companyId = input.companyId;

    await this.model.updateOne({ _id: id }, { $set: updateData });
  }

  async activateEmployee(id: string): Promise<void> {
    await this.model.updateOne(
      { _id: id },
      {
        $set: {
          status: UserStatus.ACTIVE,
          inviteStatus: InviteStatus.USED,
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
