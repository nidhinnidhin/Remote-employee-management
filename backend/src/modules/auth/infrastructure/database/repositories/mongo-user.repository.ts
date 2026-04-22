import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateQuery } from 'mongoose';
import { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserDocument } from '../mongoose/schemas/userSchema';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { UserRole } from 'src/shared/enums/user/user-role.enum';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { DocumentPayload } from 'src/shared/types/profile/document.type';
import { PopulatedDepartment } from 'src/shared/types/profile/populated-department.type';
import { BaseRepository } from 'src/shared/repositories/base.repository';

@Injectable()
export class MongoUserRepository
  extends BaseRepository<UserDocument, UserEntity>
  implements IUserRepository
{
  constructor(
    @InjectModel(UserDocument.name)
    private readonly _userModel: Model<UserDocument>,
  ) {
    super(_userModel);
  }

  protected toEntity(user: UserDocument): UserEntity {
    const departmentValue =
      user.department && typeof user.department === 'object'
        ? (user.department as unknown as PopulatedDepartment).name ||
          (user.department as unknown as PopulatedDepartment)._id?.toString()
        : user.department?.toString();

    return new UserEntity(
      (user._id as Types.ObjectId).toString(),
      user.firstName,
      user.lastName,
      user.email,
      user.role,
      user.phone,
      user.passwordHash,
      user.status as UserStatus,
      user.title,
      user.createdAt,
      user.updatedAt,
      user.companyId,
      departmentValue,
      user.inviteStatus,
      user.hasPassword,
      user.dateOfBirth,
      user.gender,
      user.maritalStatus,
      user.nationality,
      user.bloodGroup,
      user.timeZone,
      user.bio,
      user.streetAddress,
      user.city,
      user.state,
      user.country,
      user.zipCode,
      user.emergencyContactName,
      user.emergencyContactPhone,
      user.emergencyContactRelation,
      user.linkedInUrl,
      user.personalWebsite,
      user.profileImageUrl,
      user.profileImagePublicId,
      user.skills,
      user.isOnboarded,
      user.provider,
      user.providerId,
      user.documents,
    );
  }

  async findById(id: string): Promise<UserEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).populate('department').exec();

    return doc ? this.toEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  async create(user: UserEntity): Promise<UserEntity> {
    return this.save({
      companyId: user.companyId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      passwordHash: user.passwordHash,
      status: user.status,
      department: user.department,
      inviteStatus: user.inviteStatus,
      hasPassword: user.hasPassword,
      isOnboarded: user.isOnboarded,
      provider: user.provider,
      providerId: user.providerId,
    } as Partial<UserDocument>);
  }

  async findAllByCompanyIdAndRole(
    companyId: string,
    role: UserRole,
  ): Promise<UserEntity[]> {
    return this.findAll({ companyId, role });
  }

  async updatePasswordByEmail(
    email: string,
    passwordHash: string,
  ): Promise<void> {
    const result = await this.model.updateOne(
      { email: email.toLowerCase() },
      { $set: { passwordHash, hasPassword: true } },
    );
    if (result.matchedCount === 0) {
      throw new Error(`${AUTH_MESSAGES.USER_NOT_FOUND_FOR_EMAIL} ${email}`);
    }
  }

  async updateStatusByEmail(email: string, status: UserStatus): Promise<void> {
    await this.model.updateOne({ email: email.toLowerCase() }, { status });
  }

  async updateRoleByEmail(email: string, role: string): Promise<void> {
    await this.model.updateOne({ email: email.toLowerCase() }, { role });
  }

  async updateUserFieldsById(
    id: string,
    fields: Partial<UserEntity>,
  ): Promise<void> {
    const result = await this.model.updateOne({ _id: id }, { $set: fields });
    if (result.matchedCount === 0) {
      throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
    }
  }

  async updateUserFieldsByEmail(
    email: string,
    fields: Partial<UserEntity>,
  ): Promise<void> {
    await this.model.updateOne(
      { email: email.toLowerCase() },
      { $set: fields },
    );
  }

  async updateEmail(userId: string, email: string): Promise<void> {
    await this.model.updateOne({ _id: userId }, { $set: { email } });
  }

  async updateProfileImage(
    userId: string,
    imageUrl: string,
    publicId: string,
  ): Promise<void> {
    await this.model.updateOne(
      { _id: userId },
      {
        $set: {
          profileImageUrl: imageUrl,
          profileImagePublicId: publicId,
        },
      },
    );
  }

  async updateSkills(userId: string, skills: string[]): Promise<void> {
    await this.model.updateOne({ _id: userId }, { $set: { skills } });
  }

  async addDocument(userId: string, document: DocumentPayload): Promise<void> {
    await this.model.updateOne({ _id: userId }, {
      $push: { documents: document },
    } as unknown as UpdateQuery<UserDocument>);
  }

  async removeDocument(userId: string, documentId: string): Promise<void> {
    await this.model.updateOne({ _id: userId }, {
      $pull: { documents: { _id: documentId } },
    } as unknown as UpdateQuery<UserDocument>);
  }

  async updateDocument(
    userId: string,
    documentId: string,
    update: Partial<DocumentPayload>,
  ): Promise<void> {
    const setFields: Record<string, DocumentPayload[keyof DocumentPayload]> =
      {};
    (Object.keys(update) as Array<keyof DocumentPayload>).forEach((key) => {
      setFields[`documents.$.${key}`] = update[key];
    });

    await this.model.updateOne({ _id: userId, 'documents._id': documentId }, {
      $set: setFields,
    } as UpdateQuery<UserDocument>);
  }
}
