export interface IApiMeta {
  timestamp: string;
  path?: string;
  requestId?: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  errors?: unknown;
  meta?: IApiMeta;
}