import { SuperAdmin } from '../entities/super-admin.entity';

export interface SuperAdminRepository {
  findByEmail(email: string): Promise<SuperAdmin | null>;
}
