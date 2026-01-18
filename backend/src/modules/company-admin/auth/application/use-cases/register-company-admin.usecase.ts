import { Injectable, ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UserEntity } from '../../domain/entities/user.entity';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { RegisterCompanyAdminDto } from 'src/modules/company-admin/auth/presentation/dto/register-company-admin.dto';
import { SendEmailOtpUseCase } from './send-email-otp.usecase';
import { UserStatus } from '@shared';
import { CompanyEntity } from '../../domain/entities/company.entity';
import type { CompanyRepository } from '../../domain/repositories/company.repository';

@Injectable()
export class RegisterCompanyAdminUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,

    @Inject('CompanyRepository')
    private readonly companyRepository: CompanyRepository,

    private readonly sendEmailOtpUseCase: SendEmailOtpUseCase,
  ) {}

  async execute(dto: RegisterCompanyAdminDto): Promise<UserEntity> {
    // 1️⃣ Check company email uniqueness
    const existingCompany = await this.companyRepository.findByEmail(
      dto.company.email,
    );
    if (existingCompany) {
      throw new ConflictException('Company email already registered');
    }

    // Create company
    const company = new CompanyEntity(
      randomUUID(),
      dto.company.name,
      dto.company.email,
      dto.company.size,
      dto.company.industry,
      dto.company.website,
      new Date(),
      new Date(),
    );

    const createdCompany = await this.companyRepository.create(company);

    // 3️⃣ Check admin email
    const adminEmail = dto.admin.email.toLowerCase();
    const existingUser = await this.userRepository.findByEmail(adminEmail);
    if (existingUser) {
      throw new ConflictException('Admin email already registered');
    }

    // 4️⃣ Create admin user
    const passwordHash = await bcrypt.hash(dto.admin.password, 10);

    const user = new UserEntity(
      randomUUID(),
      createdCompany.id, // 🔥 KEY CHANGE
      dto.admin.firstName,
      dto.admin.lastName,
      adminEmail,
      dto.admin.phone,
      'COMPANY_ADMIN',
      passwordHash,
      UserStatus.PENDING_VERIFICATION,
      new Date(),
      new Date(),
    );

    const createdUser = await this.userRepository.create(user);

    // 5️⃣ Send OTP
    await this.sendEmailOtpUseCase.execute(
      createdUser.id,
      createdUser.email,
    );

    return createdUser;
  }
}
