import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity>;
  updateStatusByEmail(
    email: string,
    status: UserStatus
  ): Promise<void>;

  updatePasswordByEmail(email: string, passwordHash: string): Promise<void>;
}
