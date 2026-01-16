import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserDocument } from '../mongoose/schemas/userSchema';

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

  async create(user: UserEntity): Promise<UserEntity> {
    const created = await this.userModel.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      passwordHash: user.passwordHash,
      status: user.status,
    });

    return this.toEntity(created);
  }

  private toEntity(doc: UserDocument): UserEntity {
    return new UserEntity(
      doc._id.toString(),
      doc.firstName,
      doc.lastName,
      doc.email,
      doc.phone,
      doc.passwordHash,
      doc.status as any,
      doc.createdAt,
      doc.updatedAt,
    );
  }
  async updateStatusByEmail(
    email: string,
    status: 'ACTIVE' | 'SUSPENDED',
  ): Promise<void> {
    await this.userModel.updateOne({ email }, { status });
  }
}
