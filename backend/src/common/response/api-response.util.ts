import { ApiResponseModel, ApiErrorModel } from './response.model';
import { IApiResponse, IApiMeta } from './response.interface';

export class ApiResponse {
  static success<T>(
    data: T,
    message: string = 'Request successful',
    meta?: Partial<IApiMeta>,
  ): IApiResponse<T> {
    return new ApiResponseModel(data, message, 200, meta);
  }

  static error(
    message: string,
    errors: unknown = null,
    meta?: Partial<IApiMeta>,
  ): IApiResponse<null> {
    return new ApiErrorModel(message, 500, errors, meta);
  }
}
