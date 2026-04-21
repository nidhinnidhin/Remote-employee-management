import type { FilterQuery, UpdateQuery, ClientSession } from "mongoose";

export interface IBaseRepository<TDocument, TEntity = TDocument> {
  save(data: Partial<TDocument>): Promise<TEntity>;
  findAll(filter?: FilterQuery<TDocument>): Promise<TEntity[]>;
  findById(id: string): Promise<TEntity | null>;
  findByEmail(email: string): Promise<TEntity | null>;
  findAllByCompanyId(companyId: string): Promise<TEntity[]>;
  findOne(filter: FilterQuery<TDocument>): Promise<TEntity | null>;
  updateById(id: string, data: UpdateQuery<TDocument>): Promise<TEntity | null>;
  deleteById(id: string): Promise<TEntity | null>;
  exists(filter: FilterQuery<TDocument>): Promise<boolean>;
  count(filter?: FilterQuery<TDocument>): Promise<number>;
  findAllPaginated(
    filter: FilterQuery<TDocument>,
    skip: number,
    limit: number,
    sort?: Record<string, 1 | -1 | 'asc' | 'desc'> | string
  ): Promise<{ data: TEntity[]; total: number }>;
  createMany(data: Partial<TDocument>[]): Promise<TEntity[]>;
  updateMany(filter: FilterQuery<TDocument>, data: UpdateQuery<TDocument>): Promise<void>;
  softDelete(id: string): Promise<boolean>;
  restore(id: string): Promise<boolean>;
  upsert(filter: FilterQuery<TDocument>, data: UpdateQuery<TDocument>): Promise<TEntity>;
  withTransaction<R>(fn: (session: ClientSession) => Promise<R>): Promise<R>;
}