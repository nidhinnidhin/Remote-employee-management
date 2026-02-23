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
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ email });
    return user ? this.toEntity(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userModel.findById(id);
    return user ? this.toEntity(user) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    console.log('!!! DEBUG: MongoUserRepository - Creating User Entity:', {
      role: user.role,
      phone: user.phone,
      email: user.email,
    });
    const created = await this.userModel.create({
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
    });

    return this.toEntity(created);
  }

  async updatePasswordByEmail(
    email: string,
    passwordHash: string,
  ): Promise<void> {
    const result = await this.userModel.updateOne(
      { email: email.toLowerCase() },
      {
        $set: {
          passwordHash: passwordHash, // 🔥 MUST MATCH LOGIN
          hasPassword: true,
        },
      },
    );

    if (result.matchedCount === 0) {
      throw new Error(`${AUTH_MESSAGES.USER_NOT_FOUND_FOR_EMAIL} ${email}`);
    }
  }
  private toEntity(doc: UserDocument): UserEntity {
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
    );
  }

  async updateStatusByEmail(email: string, status: UserStatus): Promise<void> {
    await this.userModel.updateOne({ email }, { status });
  }

  async updateRoleByEmail(email: string, role: string): Promise<void> {
    await this.userModel.updateOne({ email }, { role });
  }

  async updateUserFieldsById(
    id: string,
    fields: Partial<UserEntity>,
  ): Promise<void> {
    console.log('Updating user ID:', id);
    console.log('Fields:', fields);

    const result = await this.userModel.updateOne(
      { _id: id },
      { $set: fields },
      { runValidators: true },
    );

    console.log('Update result:', result);

    if (result.matchedCount === 0) {
      throw new Error('User not found for update');
    }
  }

  async updateUserFieldsByEmail(
    email: string,
    fields: Partial<UserEntity>,
  ): Promise<void> {
    await this.userModel.updateOne({ email }, { $set: fields });
  }
}
