import { InviteStatus } from 'src/shared/enums/user/user-invite-status.enum';
import { Employee } from '../entities/employee.entity';

export interface EmployeeRepository {
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
  }): Promise<Employee>;

  update(id: string, input: {
    name?: string;
    role?: string;
    department?: string;
    phone?: string;
    companyId?: string;
  }): Promise<void>;

  findByEmail(email: string): Promise<Employee | null>;
  findById(id: string): Promise<Employee | null>;
  activateEmployee(id: string): Promise<void>;
  setPassword(id: string, passwordHash: string): Promise<void>;
}
