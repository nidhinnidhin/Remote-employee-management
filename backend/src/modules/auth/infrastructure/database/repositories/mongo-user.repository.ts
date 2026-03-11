import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUserRepository } from '../../../domain/repositories/iuser.repository';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserDocument } from '../mongoose/schemas/userSchema';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { UserRole } from 'src/shared/enums/user/user-role.enum';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';
import { DocumentPayload } from 'src/shared/types/profile/document.type';

import { BaseRepository } from 'src/shared/repositories/base.repository';

@Injectable()
export class MongoUserRepository
  extends BaseRepository<UserDocument, UserEntity>
  implements IUserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly _userModel: Model<UserDocument>,
  ) {
    super(_userModel);
  }

  protected toEntity(doc: UserDocument): UserEntity {
    return new UserEntity(
      (doc as any)._id.toString(),
      doc.firstName,
      doc.lastName,
      doc.email,
      doc.role,
      doc.phone,
      doc.passwordHash,
      doc.status as UserStatus,
      doc.createdAt,
      doc.updatedAt,
      doc.companyId,
      doc.department,
      doc.inviteStatus,
      doc.hasPassword,
      doc.dateOfBirth,
      doc.gender,
      doc.maritalStatus,
      doc.nationality,
      doc.bloodGroup,
      doc.timeZone,
      doc.bio,
      doc.streetAddress,
      doc.city,
      doc.state,
      doc.country,
      doc.zipCode,
      doc.emergencyContactName,
      doc.emergencyContactPhone,
      doc.emergencyContactRelation,
      doc.linkedInUrl,
      doc.personalWebsite,
      doc.profileImageUrl,
      doc.profileImagePublicId,
      doc.skills,
      doc.isOnboarded,
      doc.provider,
      doc.providerId,
      doc.documents,
    );
  }

  // --- Override create: input is UserEntity not Partial<UserDocument> ---
  async create(user: UserEntity): Promise<UserEntity> {
    const created = new this._userModel({
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
    const saved = await created.save();
    return this.toEntity(saved as UserDocument);
  }

  // Use base findByEmail which already handles toEntity and case-insensitive check via emailField logic if we set it
  // However, the original findByEmail uses a regex. Let's stick to base findByEmail if it works.
  // Base findByEmail: const filter = { [this.emailField]: email.toLowerCase() } as FilterQuery<TDocument>;
  // That should be enough for case-insensitive if stored lowercased.

  async findAllByCompanyIdAndRole(
    companyId: string,
    role: UserRole,
  ): Promise<UserEntity[]> {
    const docs = await this._userModel.find({ companyId, role }).lean().exec();
    return docs.map((doc) => this.toEntity(doc as unknown as UserDocument));
  }

  // --- Domain-specific update methods ---

  async updatePasswordByEmail(
    email: string,
    passwordHash: string,
  ): Promise<void> {
    const result = await this._userModel.updateOne(
      { email: email.toLowerCase() },
      { $set: { passwordHash, hasPassword: true } },
    );
    if (result.matchedCount === 0) {
      throw new Error(`${AUTH_MESSAGES.USER_NOT_FOUND_FOR_EMAIL} ${email}`);
    }
  }

  async updateStatusByEmail(email: string, status: UserStatus): Promise<void> {
    await this._userModel.updateOne({ email: email.toLowerCase() }, { status });
  }

  async updateRoleByEmail(email: string, role: string): Promise<void> {
    await this._userModel.updateOne({ email: email.toLowerCase() }, { role });
  }

  async updateUserFieldsById(
    id: string,
    fields: Partial<UserEntity>,
  ): Promise<void> {
    const result = await this.updateById(id, { $set: fields });
    if (!result) {
      throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
    }
  }

  async updateUserFieldsByEmail(
    email: string,
    fields: Partial<UserEntity>,
  ): Promise<void> {
    await this._userModel.updateOne({ email }, { $set: fields });
  }

  async updateEmail(userId: string, email: string): Promise<void> {
    await this._userModel.updateOne({ _id: userId }, { $set: { email } });
  }

  async updateProfileImage(
    userId: string,
    imageUrl: string,
    publicId: string,
  ): Promise<void> {
    await this._userModel.findByIdAndUpdate(userId, {
      profileImageUrl: imageUrl,
      profileImagePublicId: publicId,
    });
  }

  async updateSkills(userId: string, skills: string[]): Promise<void> {
    await this._userModel.updateOne({ _id: userId }, { $set: { skills } });
  }

  async addDocument(userId: string, document: DocumentPayload): Promise<void> {
    await this._userModel.updateOne(
      { _id: userId },
      { $push: { documents: document } },
    );
  }

  async removeDocument(userId: string, documentId: string): Promise<void> {
    await this._userModel.updateOne(
      { _id: userId },
      { $pull: { documents: { _id: documentId } } },
    );
  }

  async updateDocument(
    userId: string,
    documentId: string,
    update: Partial<DocumentPayload>,
  ): Promise<void> {
    const setFields: Record<string, any> = {};
    Object.keys(update).forEach((key) => {
      setFields[`documents.$.${key}`] = (update as any)[key];
    });
    await this._userModel.updateOne(
      { _id: userId, 'documents._id': documentId },
      { $set: setFields },
    );
  }
}