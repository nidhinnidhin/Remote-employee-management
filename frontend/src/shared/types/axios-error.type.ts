/**
 * Minimal typing for Axios-like error objects caught in catch blocks.
 * Use this instead of `catch (error: any)` throughout the frontend.
 */
export interface AxiosLikeError {
  response?: {
    data?: { message?: string | string[] };
    status?: number;
  };
  message?: string;
}
