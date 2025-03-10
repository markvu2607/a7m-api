import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { TOKEN_TYPES } from '@/auth/constants/token-types.constant';
import {
  JwtPayloadBase,
  JwtPayloadBaseKey,
} from '@/auth/interfaces/jwt-payload-base.interface';
import {
  JwtPayloadOneTimeUsed,
  JwtPayloadOneTimeUsedKey,
} from '@/auth/interfaces/jwt-payload-one-time-used.interface';

interface RequestWithUser extends Request {
  user: JwtPayloadBase | JwtPayloadOneTimeUsed;
}

function isVerifyEmailPayload(
  user: JwtPayloadBase | JwtPayloadOneTimeUsed,
): user is JwtPayloadOneTimeUsed {
  return user.type === TOKEN_TYPES.VERIFY_EMAIL;
}

export const CurrentUser = createParamDecorator(
  (
    data: JwtPayloadBaseKey | JwtPayloadOneTimeUsedKey,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!data) return user;

    if (isVerifyEmailPayload(user)) {
      return user[data as JwtPayloadOneTimeUsedKey];
    }
    return user[data as JwtPayloadBaseKey];
  },
);
