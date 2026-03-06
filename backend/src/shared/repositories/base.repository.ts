import { Model, Document, FilterQuery, UpdateQuery, Types } from "mongoose";
import { IBaseRepository } from "./interfaces/base.repository.interface";

export abstract class BaseRepository<TDocument extends Document, TEntity = TDocument>
  implements IBaseRepository<TDocument, TEntity>
{
  constructor(protected readonly model: Model<TDocument>) {}

  protected abstract toEntity(doc: TDocument): TEntity;

  protected get emailField(): string { return 'email'; }
  protected get companyIdField(): string { return 'companyId'; }

  async create(data: Partial<TDocument>): Promise<TEntity> {
    const created = new this.model(data);
    const saved = await created.save();
    return this.toEntity(saved as TDocument);
  }

  async findAll(filter: FilterQuery<TDocument> = {}): Promise<TEntity[]> {
    const docs = await this.model.find(filter).lean().exec() as TDocument[];
    return docs.map((doc) => this.toEntity(doc));
  }

  async findById(id: string): Promise<TEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model.findById(id).lean().exec() as TDocument | null;
    return doc ? this.toEntity(doc) : null;
  }

  async findByEmail(email: string): Promise<TEntity | null> {
    const filter = { [this.emailField]: email.toLowerCase() } as FilterQuery<TDocument>;
    const doc = await this.model.findOne(filter).lean().exec() as TDocument | null;
    return doc ? this.toEntity(doc) : null;
  }

  async findAllByCompanyId(companyId: string): Promise<TEntity[]> {
    const filter = { [this.companyIdField]: companyId } as FilterQuery<TDocument>;
    const docs = await this.model.find(filter).lean().exec() as TDocument[];
    return docs.map((doc) => this.toEntity(doc));
  }

  async findOne(filter: FilterQuery<TDocument>): Promise<TEntity | null> {
    const doc = await this.model.findOne(filter).lean().exec() as TDocument | null;
    return doc ? this.toEntity(doc) : null;
  }

  async update(id: string, data: UpdateQuery<TDocument>): Promise<TEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model
      .findByIdAndUpdate(id, data, { new: true })
      .lean()
      .exec() as TDocument | null;
    return doc ? this.toEntity(doc) : null;
  }

  async delete(id: string): Promise<TEntity | null> {
    if (!Types.ObjectId.isValid(id)) return null;
    const doc = await this.model
      .findByIdAndDelete(id)
      .lean()
      .exec() as TDocument | null;
    return doc ? this.toEntity(doc) : null;
  }

  async exists(filter: FilterQuery<TDocument>): Promise<boolean> {
    const result = await this.model.exists(filter).exec();
    return result !== null;
  }

  async count(filter: FilterQuery<TDocument> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}