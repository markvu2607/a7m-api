import { JwtPayload } from '@/auth/interfaces/jwt-payload.interface';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
