export interface CompanyReadRepository {
  findAll(): Promise<any[]>;
}