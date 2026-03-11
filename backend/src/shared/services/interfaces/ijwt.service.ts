import { JwtPayload, RefreshTokenPayload } from 'src/shared/types/jwt/jwt-payload.type';

export abstract class IJwtService {
    abstract generateAccessToken(payload: JwtPayload): string;
    abstract generateRefreshToken(payload: RefreshTokenPayload): string;
}
