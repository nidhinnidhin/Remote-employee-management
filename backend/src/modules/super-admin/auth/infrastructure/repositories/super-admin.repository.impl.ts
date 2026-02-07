import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SuperAdminRepository } from '../../domain/repositories/super-admin.repository';
import { SuperAdmin } from '../../domain/entities/super-admin.entity';
import { SuperAdminDocument } from '../database/mongoose/schemas/super-admin.schema';

export class SuperAdminRepositoryImpl implements SuperAdminRepository {
  constructor(
    @InjectModel(SuperAdminDocument.name)
    private readonly model: Model<SuperAdminDocument>,
  ) {}

  async findByEmail(email: string): Promise<SuperAdmin | null> {
    const doc = await this.model.findOne({ email }).lean();
    if (!doc) return null;

    return new SuperAdmin(
      doc._id.toString(),
      doc.email,
      doc.password,
      doc.isActive,
    );
  }
  
}
