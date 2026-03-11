import { InviteEmployeeDto } from '../../presentation/dto/invite-employee.dto';
import { Employee } from '../../domain/entities/employee.entity';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';

export interface IInviteEmployeeUseCase {
    execute(dto: InviteEmployeeDto & { companyId: string }): Promise<void>;
}

export interface IVerifyInviteUseCase {
    execute(token: string): Promise<{ employeeId: string }>;
}

export interface ISetPasswordUseCase {
    execute(employeeId: string, password: string): Promise<Employee>;
}

export interface IGetEmployeesUseCase {
    execute(companyId: string): Promise<Employee[]>;
}

export interface IUpdateEmployeeStatusUseCase {
    execute(id: string, status: UserStatus, reason?: string): Promise<void>;
}
