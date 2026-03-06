import type { FilterQuery, UpdateQuery } from "mongoose";

export interface IBaseRepository<TDocument, TEntity = TDocument> {
  create(data: Partial<TDocument>): Promise<TEntity>;
  findAll(filter?: FilterQuery<TDocument>): Promise<TEntity[]>;
  findById(id: string): Promise<TEntity | null>;
  findByEmail(email: string): Promise<TEntity | null>;
  findAllByCompanyId(companyId: string): Promise<TEntity[]>;
  findOne(filter: FilterQuery<TDocument>): Promise<TEntity | null>;
  update(id: string, data: UpdateQuery<TDocument>): Promise<TEntity | null>;
  delete(id: string): Promise<TEntity | null>;
  exists(filter: FilterQuery<TDocument>): Promise<boolean>;
  count(filter?: FilterQuery<TDocument>): Promise<number>;
}