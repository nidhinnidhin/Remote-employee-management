import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserDocument } from '../mongoose/schemas/userSchema';
import { UserStatus } from 'src/shared/enums/user/user-status.enum';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userModel.findOne({ email });
    return user ? this.toEntity(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userModel.findById(id);
    return user ? this.toEntity(user) : null;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const created = await this.userModel.create({
      companyId: user.companyId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      passwordHash: user.passwordHash,
      status: user.status,
    });

    return this.toEntity(created);
  }

  async updatePasswordByEmail(
    email: string,
    passwordHash: string,
  ): Promise<void> {
    await this.userModel.updateOne({ email }, { password: passwordHash });
  }

  private toEntity(doc: UserDocument): UserEntity {
    return new UserEntity(
      doc._id.toString(),
      doc.companyId,
      doc.firstName,
      doc.lastName,
      doc.email,
      doc.phone,
      doc.role,
      doc.passwordHash,
      doc.status as any,
      doc.createdAt,
      doc.updatedAt,
    );
  }
  async updateStatusByEmail(
    email: string,
    status: UserStatus,
  ): Promise<void> {
    await this.userModel.updateOne({ email }, { status });
  }
}
