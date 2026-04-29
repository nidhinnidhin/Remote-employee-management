import { IApiResponse, IApiMeta } from './response.interface';

export class ApiResponseModel<T> implements IApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode: number;
  meta: IApiMeta;

  constructor(data: T | null, message: string = 'Request successful', statusCode: number = 200, meta?: Partial<IApiMeta>) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.meta = {
      timestamp: new Date().toISOString(),
      ...meta,
    };
  }
}

export class ApiErrorModel implements IApiResponse<null> {
  success: boolean;
  message: string;
  data: null;
  statusCode: number;
  errors: any;
  meta: IApiMeta;

  constructor(message: string, statusCode: number = 500, errors: any = null, meta?: Partial<IApiMeta>) {
    this.success = false;
    this.message = message;
    this.data = null;
    this.statusCode = statusCode;
    this.errors = errors;
    this.meta = {
      timestamp: new Date().toISOString(),
      ...meta,
    };
  }
}
