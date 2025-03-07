import { TokenType } from '../constants/token-types.constant';

export interface JwtPayload {
  sub: string;
  type: TokenType;
  iat: number;
  exp: number;
}

export type JwtPayloadKey = keyof JwtPayload;
