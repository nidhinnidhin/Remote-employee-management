import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { UserRole } from 'src/shared/enums/user/user-role.enum';
import { UserEntity } from '../entities/user.entity';
import { DocumentPayload } from 'src/shared/types/profile/document.type';
import { IBaseRepository } from 'src/shared/repositories/interfaces/base.repository.interface'; 
import { UserDocument } from '../../infrastructure/database/mongoose/schemas/userSchema'; 

export interface IUserRepository extends IBaseRepository<UserDocument, UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;
  
  create(user: UserEntity): Promise<UserEntity>;
  
  findAllByCompanyIdAndRole(
    companyId: string,
    role: UserRole,
  ): Promise<UserEntity[]>;

  updateStatusByEmail(email: string, status: UserStatus): Promise<void>;
  updateRoleByEmail(email: string, role: string): Promise<void>; // Added this to interface based on your class
  updatePasswordByEmail(email: string, passwordHash: string): Promise<void>;
  updateEmail(userId: string, email: string): Promise<void>;
  updateUserFieldsById(id: string, fields: Partial<UserEntity>): Promise<void>;
  updateUserFieldsByEmail(
    email: string,
    fields: Partial<UserEntity>,
  ): Promise<void>;
  updateProfileImage(
    userId: string,
    imageUrl: string,
    publicId: string,
  ): Promise<void>;
  updateSkills(userId: string, skills: string[]): Promise<void>;

  addDocument(userId: string, document: DocumentPayload): Promise<void>;
  removeDocument(userId: string, documentId: string): Promise<void>;
  updateDocument(
    userId: string,
    documentId: string,
    update: Partial<DocumentPayload>,
  ): Promise<void>;
}