import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/repositories/base.repository';
import { EmployeeRepository } from '../../domain/repositories/employee.repository';
import { Employee } from '../../domain/entities/employee.entity';
import { UserDocument } from 'src/modules/auth/infrastructure/database/mongoose/schemas/userSchema';
import { InviteStatus } from 'src/shared/enums/user/user-invite-status.enum';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { UserRole } from 'src/shared/enums/user/user-role.enum';

@Injectable()
export class EmployeeRepositoryImpl
  extends BaseRepository<UserDocument, Employee>
  implements EmployeeRepository
{
  constructor(
    @InjectModel(UserDocument.name)
    private readonly _userModel: Model<UserDocument>,
  ) {
    super(_userModel);
  }

  protected toEntity(doc: UserDocument): Employee {
    return new Employee(
      (doc as any)._id?.toString() ?? (doc as any).id,
      `${doc.firstName} ${doc.lastName}`.trim(),
      doc.email,
      doc.role,
      doc.department || '',
      doc.phone || '',
      doc.status === UserStatus.ACTIVE,
      doc.hasPassword,
      (doc.inviteStatus as InviteStatus) || InviteStatus.PENDING,
      doc.companyId,
    );
  }

  async create(input: {
    name: string;
    email: string;
    role: string;
    department: string;
    phone: string;
    companyId: string;
    isActive: boolean;
    hasPassword: boolean;
    inviteStatus: InviteStatus;
    isOnboarded: boolean;
  }): Promise<Employee> {
    const [firstName, ...rest] = input.name.split(' ');
    const lastName = rest.join(' ') || '';

    return super.create({
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

    await this._userModel.updateOne({ _id: id }, { $set: updateData });
  }

  async updateStatus(id: string, status: UserStatus): Promise<void> {
    await this._userModel.updateOne({ _id: id }, { $set: { status } });
  }

  async activateEmployee(id: string): Promise<void> {
    await this._userModel.updateOne(
      { _id: id },
      { $set: { status: UserStatus.ACTIVE, inviteStatus: InviteStatus.USED } },
    );
  }

  async setPassword(id: string, passwordHash: string): Promise<void> {
    await this._userModel.updateOne(
      { _id: id },
      { $set: { passwordHash, hasPassword: true } },
    );
  }
}
