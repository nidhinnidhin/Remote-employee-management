import { InviteStatus } from 'src/shared/enums/user/user-invite-status.enum';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { Employee } from '../entities/employee.entity';

export interface IEmployeeRepository {
  create(input: {
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
  }): Promise<Employee>;

  updateEmployee(id: string, input: {
    name?: string;
    role?: string;
    department?: string;
    phone?: string;
    companyId?: string;
  }): Promise<void>;

  findByEmail(email: string): Promise<Employee | null>;
  findById(id: string): Promise<Employee | null>;
  findAllByCompanyId(companyId: string): Promise<Employee[]>;
  updateStatus(id: string, status: UserStatus): Promise<void>;
  activateEmployee(id: string): Promise<void>;
  setPassword(id: string, passwordHash: string): Promise<void>;
}