import type { FilterQuery, UpdateQuery, ClientSession } from "mongoose";

export interface IBaseRepository<TDocument, TEntity = TDocument> {
  save(data: Partial<TDocument>): Promise<TEntity>;
  createMany(data: Partial<TDocument>[]): Promise<TEntity[]>;
  findAll(filter?: FilterQuery<TDocument>): Promise<TEntity[]>;
  findAllPaginated(
    filter: FilterQuery<TDocument>,
    skip: number,
    limit: number,
    sort?: Record<string, 1 | -1 | 'asc' | 'desc'> | string
  ): Promise<{ data: TEntity[]; total: number }>;
  findById(id: string): Promise<TEntity | null>;
  findOne(filter: FilterQuery<TDocument>): Promise<TEntity | null>;
  exists(filter: FilterQuery<TDocument>): Promise<boolean>;
  count(filter?: FilterQuery<TDocument>): Promise<number>;

  updateById(id: string, data: UpdateQuery<TDocument>): Promise<TEntity | null>;
  updateMany(filter: FilterQuery<TDocument>, data: UpdateQuery<TDocument>): Promise<void>;
  upsert(filter: FilterQuery<TDocument>, data: UpdateQuery<TDocument>): Promise<TEntity>;
  deleteById(id: string): Promise<TEntity | null>;
  withTransaction<R>(fn: (session: ClientSession) => Promise<R>): Promise<R>;
}