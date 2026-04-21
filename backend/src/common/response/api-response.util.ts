import { IApiResponse, IApiMeta } from './response.interface';

/**
 * Standardized API Response utility class.
 * Follows SOLID principles and Clean Architecture by being framework-agnostic.
 */
export class ApiResponse {
  /**
   * Generates a standardized success response.
   * @param data The data to be returned in the response.
   * @param message A descriptive message (default: 'Request successful').
   * @param meta Optional metadata (pagination, etc.).
   */
  static success<T>(
    data: T,
    message: string = 'Request successful',
    meta?: Partial<IApiMeta>,
  ): IApiResponse<T> {
    return {
      success: true,
      message,
      data: data ?? null,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }

  /**
   * Generates a standardized error response.
   * @param message A descriptive error message.
   * @param errors Detailed error information (e.g., validation errors).
   * @param meta Optional metadata.
   */
  static error(
    message: string,
    errors: unknown = null,
    meta?: Partial<IApiMeta>,
  ): IApiResponse<null> {
    return {
      success: false,
      message,
      data: null,
      errors,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }
}
