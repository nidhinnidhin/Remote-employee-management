import { Injectable, Inject } from '@nestjs/common'; // Fixed: Removed unused OnModuleInit import
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type { IUserRepository } from 'src/modules/auth/domain/repositories/iuser.repository';
import { UserEntity } from 'src/modules/auth/domain/entities/user.entity';
import { UserRole } from 'src/shared/enums/user/user-role.enum';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import type { ILogger } from 'src/common/logger/interface/logger.interface';
import { LOGGER_SERVICE } from 'src/common/logger/tokens/logger.tokens';

import type { ISuperAdminSeedService } from './isuper-admin-seed.service';

@Injectable()
export class SuperAdminSeedService implements ISuperAdminSeedService {
  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: ILogger,
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private readonly _configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing Super Admin Seeder...');
    await this.seedSuperAdmin();
  }

  private async seedSuperAdmin() {
    const email = this._configService.get<string>('SUPER_ADMIN_EMAIL');
    const password = this._configService.get<string>('SUPER_ADMIN_PASSWORD');

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
        this.logger.log(
          `Found existing user with Role: ${existingUser.role}, Phone: ${existingUser.phone}`,
        );
        if (
          existingUser.role !== UserRole.SUPER_ADMIN ||
          existingUser.phone === UserRole.SUPER_ADMIN
        ) {
          this.logger.warn(`User ${email} has incorrect fields. FIXING NOW...`);
          await this.userRepository.updateUserFieldsByEmail(email, {
            role: UserRole.SUPER_ADMIN,
            phone: '0000000000',
          });
          this.logger.log(
            `Super Admin ${email} fields updated successfully in database.`,
          );
        } else {
          this.logger.log(
            `Super Admin ${email} already has correct role and phone.`,
          );
        }
        return;
      }

      this.logger.log(`Creating Super Admin user: ${email}...`);

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

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
        undefined,
        new Date(),
        new Date(),
        companyId,
      );

      await this.userRepository.create(newUser);
      this.logger.log(`Super Admin ${email} created successfully.`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      const errorStack = error instanceof Error ? error.stack : undefined;

      this.logger.error(
        `Failed to seed Super Admin: ${errorMessage}`,
        errorStack,
      );
    }
  }
}
