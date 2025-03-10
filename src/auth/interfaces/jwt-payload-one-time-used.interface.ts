import { TOKEN_TYPES } from '../constants/token-types.constant';
import { JwtPayloadBase } from './jwt-payload-base.interface';

export interface JwtPayloadOneTimeUsed extends JwtPayloadBase {
  type: typeof TOKEN_TYPES.VERIFY_EMAIL | typeof TOKEN_TYPES.RESET_PASSWORD;
  nonce: number;
}

export type JwtPayloadOneTimeUsedKey = keyof JwtPayloadOneTimeUsed;
