import { Employee } from '../entities/employee.entity';

export interface EmployeeRepository {
  create(input: {
    name: string;
    email: string;
    role: string;
    department: string;
    isActive: boolean;
    hasPassword: boolean;
    inviteStatus: 'PENDING' | 'USED';
  }): Promise<Employee>;

  findByEmail(email: string): Promise<Employee | null>;
  findById(id: string): Promise<Employee | null>;
  activateEmployee(id: string): Promise<void>;
  setPassword(id: string, passwordHash: string): Promise<void>;
}