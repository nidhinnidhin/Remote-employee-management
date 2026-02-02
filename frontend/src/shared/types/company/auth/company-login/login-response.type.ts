import { AuthActionError } from "./login-error.type";
import { AuthActionSuccess } from "./login-success.type";

export interface LoginResponse {
  accessToken: string;
  userId: string;
  refreshToken?: string;
}

export type AuthActionResult<T> = AuthActionSuccess<T> | AuthActionError;