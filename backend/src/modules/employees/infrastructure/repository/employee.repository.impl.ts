import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { IEmployeeRepository } from '../../domain/repositories/employee.repository';
import { Employee } from '../../domain/entities/employee.entity';
import { UserDocument } from 'src/modules/auth/infrastructure/database/mongoose/schemas/userSchema';
import { InviteStatus } from 'src/shared/enums/user/user-invite-status.enum';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { UserRole } from 'src/shared/enums/user/user-role.enum';
import { BaseRepository } from 'src/shared/repositories/base.repository'; // Adjust path

@Injectable()
export class EmployeeRepositoryImpl
  extends BaseRepository<UserDocument, Employee>
  implements IEmployeeRepository
{
  constructor(
    @InjectModel(UserDocument.name)
    private readonly _userModel: Model<UserDocument>,
  ) {
    super(_userModel);
  }

  // Bulletproof mapping to prevent 500 errors on lean() documents
  protected toEntity(userDoc: any): Employee {
    return new Employee(
      userDoc._id?.toString() || userDoc.id,
      `${userDoc.firstName || ''} ${userDoc.lastName || ''}`.trim(),
      userDoc.email,
      userDoc.role,
      userDoc.department || '',
      userDoc.phone || '',
      userDoc.status === UserStatus.ACTIVE,
      !!userDoc.hasPassword,
      userDoc.inviteStatus || InviteStatus.PENDING,
      userDoc.companyId,
      userDoc.profileImageUrl,
    );
  }

  async create(input: {
    name: string;
    email: string;
    role: string;
    department?: string;
    phone?: string;
    companyId: string;
    isActive: boolean;
    hasPassword: boolean;
    inviteStatus: InviteStatus;
    isOnboarded: boolean;
  }): Promise<Employee> {
    const [firstName, ...rest] = input.name.split(' ');
    const lastName = rest.join(' ') || '';

    // Delegate to the generic base save() method
    return this.save({
      companyId: input.companyId || undefined,
      firstName,
      lastName: lastName || undefined,
      email: input.email.toLowerCase(),
      phone: input.phone || '',
      role: input.role,
      status: UserStatus.PENDING_VERIFICATION,
      department: input.department || undefined,
      inviteStatus: input.inviteStatus || InviteStatus.PENDING,
      hasPassword: !!input.hasPassword,
      isOnboarded: input.isOnboarded,
    } as Partial<UserDocument>);
  }

  async findAllByCompanyId(companyId: string): Promise<Employee[]> {
    return this.findAll({ companyId, role: UserRole.EMPLOYEE });
  }

  async findByIds(ids: string[]): Promise<Employee[]> {
    return this.findAll({ _id: { $in: ids } });
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  async updateEmployee(
    id: string,
    input: {
      name?: string;
      role?: string;
      department?: string;
      phone?: string;
      companyId?: string;
    },
  ): Promise<void> {
    const updateData: Record<string, any> = {};

    if (input.name) {
      const [firstName, ...rest] = input.name.split(' ');
      updateData.firstName = firstName;
      updateData.lastName = rest.join(' ') || '';
    }
    if (input.role) updateData.role = input.role;
    if (input.department) updateData.department = input.department;
    if (input.phone) updateData.phone = input.phone;
    if (input.companyId) updateData.companyId = input.companyId;

    await this.model.updateOne({ _id: id }, {
      $set: updateData,
    } as UpdateQuery<UserDocument>);
  }

  async updateStatus(id: string, status: UserStatus): Promise<void> {
    await this.model.updateOne({ _id: id }, {
      $set: { status },
    } as UpdateQuery<UserDocument>);
  }

  async activateEmployee(id: string): Promise<void> {
    await this.model.updateOne({ _id: id }, {
      $set: { status: UserStatus.ACTIVE, inviteStatus: InviteStatus.USED },
    } as UpdateQuery<UserDocument>);
  }

  async setPassword(id: string, passwordHash: string): Promise<void> {
    await this.model.updateOne({ _id: id }, {
      $set: { passwordHash, hasPassword: true },
    } as UpdateQuery<UserDocument>);
  }
}
