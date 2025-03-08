import { TOKEN_TYPES } from '../constants/token-types.constant';
import { JwtPayloadBase } from './jwt-payload-base.interface';

export interface JwtPayloadVerifyEmail extends JwtPayloadBase {
  type: typeof TOKEN_TYPES.VERIFY_EMAIL;
  email: string;
  nonce: number;
}

export type JwtPayloadVerifyEmailKey = keyof JwtPayloadVerifyEmail;
