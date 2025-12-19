import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../users/user.entity';
import { Company } from '../companies/company.entity';
import { Role } from '../roles/role.entity';

import { LoginDto } from './dto/login.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';

import { JwtPayload } from '../../types/auth/jwt-payload.type';
import { UserStatus } from '../../types/user/user-status.enum';
import { SystemRoles } from '../../types/roles/system-roles.enum';

import { BillingClient } from './billing.client';

@Injectable()
export class AuthService {
  private billingClient = new BillingClient();

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    private readonly jwtService: JwtService,
  ) {}

  // =========================
  // LOGIN
  // =========================
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('User is not active');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 🔹 Load user role (simplified – adjust if many roles)
    const role = await this.roleRepo.findOne({
      where: { companyId: user.companyId },
    });

    const payload: JwtPayload = {
      userId: user.id,
      companyId: user.companyId,
      role: role?.name ?? SystemRoles.COMPANY_ADMIN,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  // =========================
  // REGISTER COMPANY
  // =========================
  async registerCompany(dto: RegisterCompanyDto) {
    // 1️⃣ Check company existence
    const existingCompany = await this.companyRepo.findOne({
      where: { email: dto.companyEmail },
    });

    if (existingCompany) {
      throw new ConflictException('Company already exists');
    }

    // 2️⃣ Call Billing Service (mock / external)
    const subscription = await this.billingClient.createSubscription({
      companyEmail: dto.companyEmail,
      planId: dto.subscriptionPlanId,
      billingCycle: dto.billingCycle,
    });

    // 3️⃣ Create Company
    const company = await this.companyRepo.save(
      this.companyRepo.create({
        name: dto.companyName,
        email: dto.companyEmail,
        subscriptionPlanId: subscription.subscriptionPlanId,
        subscriptionStatus: subscription.subscriptionStatus,
        billingCycle: subscription.billingCycle,
      }),
    );

    // 4️⃣ Create COMPANY_ADMIN role
    const adminRole = await this.roleRepo.save(
      this.roleRepo.create({
        companyId: company.id,
        name: SystemRoles.COMPANY_ADMIN,
      }),
    );

    // 5️⃣ Create Admin User
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const adminUser = await this.userRepo.save(
      this.userRepo.create({
        companyId: company.id,
        firstName: dto.adminFirstName,
        lastName: dto.adminLastName,
        email: dto.adminEmail,
        passwordHash,
        status: UserStatus.ACTIVE,
      }),
    );

    // 6️⃣ Issue JWT
    const payload: JwtPayload = {
      userId: adminUser.id,
      companyId: company.id,
      role: adminRole.name,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      company,
      user: adminUser,
    };
  }
}
