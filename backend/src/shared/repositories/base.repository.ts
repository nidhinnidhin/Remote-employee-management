import { Model, Document, FilterQuery, UpdateQuery, Types, ClientSession } from "mongoose";
import { IBaseRepository } from "./interfaces/base.repository.interface";

export abstract class BaseRepository<TDocument extends Document, TEntity = TDocument>
  implements IBaseRepository<TDocument, TEntity> {
  constructor(protected readonly model: Model<TDocument>) { }

  protected abstract toEntity(doc: TDocument): TEntity;

  // ==================== CREATE ====================

  async save(data: Partial<TDocument>): Promise<TEntity> {
    const created = new this.model(data);
    const saved = await created.save();
    return this.toEntity(saved as TDocument);
  }

  async createMany(data: Partial<TDocument>[]): Promise<TEntity[]> {
    const docs = await this.model.insertMany(data);
    return (docs as unknown as TDocument[]).map((doc) => this.toEntity(doc));
  }

  // ==================== READ ====================

  async findAll(filter: FilterQuery<TDocument> = {}): Promise<TEntity[]> {
    const docs = await this.model.find(filter).lean().exec() as TDocument[];
    return docs.map((doc) => this.toEntity(doc));
  }

  async findAllPaginated(
    filter: FilterQuery<TDocument>,
    skip: number,
    limit: number,
    sort: Record<string, 1 | -1 | 'asc' | 'desc'> | string = { createdAt: -1 }
  ): Promise<{ data: TEntity[]; total: number }> {
    const [data, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).lean().exec() as Promise<TDocument[]>,
      this.model.countDocuments(filter).exec(),
    ]);

    return {
      data: data.map((doc) => this.toEntity(doc)),
      total,
    };
  }

  async findById(id: string): Promise<TEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).lean().exec() as TDocument | null;
    return doc ? this.toEntity(doc) : null;
  }

  async findOne(filter: FilterQuery<TDocument>): Promise<TEntity | null> {
    const doc = await this.model.findOne(filter).lean().exec() as TDocument | null;
    return doc ? this.toEntity(doc) : null;
  }

  async exists(filter: FilterQuery<TDocument>): Promise<boolean> {
    const result = await this.model.exists(filter).exec();
    return result !== null;
  }

  async count(filter: FilterQuery<TDocument> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  // ==================== UPDATE ====================

  async updateById(id: string, data: UpdateQuery<TDocument>): Promise<TEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec() as TDocument | null;
    return doc ? this.toEntity(doc) : null;
  }

  async updateMany(filter: FilterQuery<TDocument>, data: UpdateQuery<TDocument>): Promise<void> {
    await this.model.updateMany(filter, data).exec();
  }

  async upsert(filter: FilterQuery<TDocument>, data: UpdateQuery<TDocument>): Promise<TEntity> {
    const doc = await this.model
      .findOneAndUpdate(filter, data, { upsert: true, new: true })
      .lean()
      .exec() as TDocument;
    return this.toEntity(doc);
  }

  // ==================== DELETE ====================

  async deleteById(id: string): Promise<TEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model
      .findByIdAndDelete(id)
      .lean()
      .exec() as TDocument | null;
    return doc ? this.toEntity(doc) : null;
  }

  // ==================== UTILS ====================

  async withTransaction<R>(fn: (session: ClientSession) => Promise<R>): Promise<R> {
    const session = await this.model.db.startSession();
    session.startTransaction();
    try {
      const result = await fn(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }
}