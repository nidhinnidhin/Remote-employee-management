import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { EmployeeRepository } from '../../domain/repositories/employee.repository';

@Injectable()
export class SetPasswordUseCase {
  constructor(
    @Inject('EmployeeRepository')
    private readonly employeeRepo: EmployeeRepository,
  ) {}

  async execute(employeeId: string, password: string) {
    if (!password || password.length < 8) {
      throw new BadRequestException('Password too short');
    }

    const employee = await this.employeeRepo.findById(employeeId);

    if (!employee) {
      throw new UnauthorizedException('Employee not found');
    }

    if (employee.hasPassword) {
      throw new BadRequestException('Password already set');
    }

    if (employee.inviteStatus !== 'USED') {
      throw new UnauthorizedException('Invite not verified');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await this.employeeRepo.setPassword(employee.id, passwordHash);

    return {
      message: 'Password set successfully',
    };
  }
}
