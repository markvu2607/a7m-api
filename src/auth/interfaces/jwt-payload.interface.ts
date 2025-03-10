import { TokenType } from '../constants/token-types.constant';

export interface JwtPayload {
  jti: string;
  sub: string;
  type: TokenType;
  iat: number;
  exp: number;
}

export type JwtPayloadKey = keyof JwtPayload;
