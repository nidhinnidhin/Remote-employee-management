import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { UserEntity } from 'src/modules/auth/domain/entities/user.entity';
import { UserRole } from 'src/shared/enums/user/user-role.enum';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';

import type { ISuperAdminSeedService } from './isuper-admin-seed.service';

@Injectable()
export class SuperAdminSeedService implements ISuperAdminSeedService {
  private readonly logger = new Logger(SuperAdminSeedService.name);

  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
  ) { }

  async onModuleInit() {
    this.logger.log('Initializing Super Admin Seeder...');
    await this.seedSuperAdmin();
  }

  private async seedSuperAdmin() {
    const email = this.configService.get<string>('SUPER_ADMIN_EMAIL');
    const password = this.configService.get<string>('SUPER_ADMIN_PASSWORD');

    if (!email || !password) {
      this.logger.warn(
        'SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD not set. Skipping seed.',
      );
      return;
    }

    try {
      const existingUser = await this.userRepository.findByEmail(email);
      this.logger.log(`Checking existing Super Admin user: ${email}...`);

      if (existingUser) {
        this.logger.log(`Found existing user with Role: ${existingUser.role}, Phone: ${existingUser.phone}`);
        if (
          existingUser.role !== UserRole.SUPER_ADMIN ||
          existingUser.phone === UserRole.SUPER_ADMIN
        ) {
          this.logger.warn(
            `User ${email} has incorrect fields. FIXING NOW...`,
          );
          await this.userRepository.updateUserFieldsByEmail(email, {
            role: UserRole.SUPER_ADMIN,
            phone: '0000000000',
          });
          this.logger.log(`Super Admin ${email} fields updated successfully in database.`);
        } else {
          this.logger.log(`Super Admin ${email} already has correct role and phone.`);
        }
        return;
      }

      this.logger.log(`Creating Super Admin user: ${email}...`);

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create a dummy companyId or handle it appropriately.
      // UserEntity requires companyId. For Super Admin, it might not be relevant but required by schema.
      // We'll generate a random string or use a static one.
      const companyId = 'super-admin-company';

      const newUser = new UserEntity(
        '',
        'Super',
        'Admin',
        email,
        UserRole.SUPER_ADMIN,
        '0000000000',
        passwordHash,
        UserStatus.ACTIVE,
        new Date(),
        new Date(),
        companyId,
      );

      await this.userRepository.create(newUser);
      this.logger.log(`Super Admin ${email} created successfully.`);
    } catch (error) {
      this.logger.error(
        `Failed to seed Super Admin: ${error.message}`,
        error.stack,
      );
    }
  }
}
