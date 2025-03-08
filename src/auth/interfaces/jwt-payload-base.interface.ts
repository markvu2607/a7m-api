import { TokenType } from '../constants/token-types.constant';

export interface JwtPayloadBase {
  sub: string;
  type: TokenType;
  iat: number;
  exp: number;
}

export type JwtPayloadBaseKey = keyof JwtPayloadBase;
