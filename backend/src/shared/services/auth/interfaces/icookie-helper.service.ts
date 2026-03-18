import { Response } from 'express';

export interface ICookieHelperService {
    setAuthCookies(
        res: Response,
        accessToken: string,
        refreshToken: string,
    ): void;
}
