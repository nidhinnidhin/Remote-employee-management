import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { UserEntity } from '../entities/user.entity';

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  create(user: UserEntity): Promise<UserEntity>;
  updateStatusByEmail(email: string, status: UserStatus): Promise<void>;
  updateUserFieldsById(id: string, fields: Partial<UserEntity>): Promise<void>;
  updatePasswordByEmail(email: string, passwordHash: string): Promise<void>;
  updateRoleByEmail(email: string, role: string): Promise<void>;
  updateUserFieldsByEmail(
    email: string,
    fields: Partial<UserEntity>,
  ): Promise<void>;

  // Update email
  updateEmail(userId: string, email: string): Promise<void>;

  // Add profile image
  updateProfileImage(
    userId: string,
    imageUrl: string,
    publicId: string,
  ): Promise<void>;

  updateSkills(userId: string, skills: string[]): Promise<void>;

  addDocument(userId: string, document: any): Promise<void>;
  removeDocument(userId: string, documentId: string): Promise<void>;
  updateDocument(
    userId: string,
    documentId: string,
    update: any,
  ): Promise<void>;
}
