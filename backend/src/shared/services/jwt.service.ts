import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
  JwtPayload,
  RefreshTokenPayload,
} from 'src/shared/types/jwt/jwt-payload.type';

@Injectable()
export class JwtService {
  generateAccessToken(payload: JwtPayload) {
    console.log("JWT_SERVICE: Generating Access Token for:", payload.userId);
    console.log("JWT_SERVICE: Access Secret present:", !!process.env.JWT_ACCESS_SECRET);
    const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: '15m',
    });
    console.log("JWT_SERVICE: Access Token generated (length):", token.length);
    return token;
  }

  generateRefreshToken(payload: RefreshTokenPayload) {
    console.log("JWT_SERVICE: Generating Refresh Token for:", payload.userId);
    console.log("JWT_SERVICE: Refresh Secret present:", !!process.env.JWT_REFRESH_SECRET);
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '30d',
    });
    console.log("JWT_SERVICE: Refresh Token generated (length):", token.length);
    return token;
  }
}
