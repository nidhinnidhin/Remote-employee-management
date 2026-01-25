import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
  JwtPayload,
  RefreshTokenPayload,
} from 'src/shared/types/jwt/jwt-payload.type';

@Injectable()
export class JwtService {
  generateAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(payload: RefreshTokenPayload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '30d',
    });
  }
}
