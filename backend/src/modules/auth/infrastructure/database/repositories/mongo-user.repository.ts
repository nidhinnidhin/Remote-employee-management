import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserDocument } from '../mongoose/schemas/userSchema';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';
import { AUTH_MESSAGES } from 'src/shared/constants/messages/auth/auth.messages';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly _userModel: Model<UserDocument>,
  ) { }

  async findByEmail(email: string): Promise<UserEntity | null> {
    console.log('[MongoUserRepository] findByEmail:', email.toLowerCase());
    const user = await this._userModel.findOne({
      email: { $regex: new RegExp(`^${email.toLowerCase()}$`, 'i') }
    });
    return user ? this.toEntity(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this._userModel.findById(id);
    return user ? this.toEntity(user) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const created = await this._userModel.create({
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
    });

    return this.toEntity(created);
  }

  async updatePasswordByEmail(
    email: string,
    passwordHash: string,
  ): Promise<void> {
    const result = await this._userModel.updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          passwordHash: passwordHash,
          hasPassword: true,
        },
      },
    );

    if (result.matchedCount === 0) {
      throw new Error(`${AUTH_MESSAGES.USER_NOT_FOUND_FOR_EMAIL} ${email}`);
    }
  }
  private toEntity(doc: UserDocument): UserEntity {
    console.log('[MongoUserRepository] Mapping to Entity:', {
      email: doc.email,
      isOnboarded: doc.isOnboarded,
      role: doc.role
    });
    return new UserEntity(
      doc._id.toString(),
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
      doc.documents,
    );
  }

  async updateStatusByEmail(email: string, status: UserStatus): Promise<void> {
    await this._userModel.updateOne({ email }, { status });
  }

  async updateRoleByEmail(email: string, role: string): Promise<void> {
    await this._userModel.updateOne({ email }, { role });
  }

  async updateUserFieldsById(
    id: string,
    fields: Partial<UserEntity>,
  ): Promise<void> {

    const result = await this._userModel.updateOne(
      { _id: id },
      { $set: fields },
      { runValidators: true },
    );


    if (result.matchedCount === 0) {
      throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
    }
  }

  async updateUserFieldsByEmail(
    email: string,
    fields: Partial<UserEntity>,
  ): Promise<void> {
    await this._userModel.updateOne({ email }, { $set: fields });
  }

  // Update email
  async updateEmail(userId: string, email: string): Promise<void> {
    await this._userModel.updateOne({ _id: userId }, { $set: { email } });
  }

  // Add profile image
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

  async addDocument(userId: string, document: any): Promise<void> {
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
    update: any,
  ): Promise<void> {
    const setFields: any = {};
    Object.keys(update).forEach((key) => {
      setFields[`documents.$.${key}`] = update[key];
    });

    await this._userModel.updateOne(
      { _id: userId, 'documents._id': documentId },
      { $set: setFields },
    );
  }
}
