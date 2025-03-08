import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import {
  JwtPayloadBase,
  JwtPayloadBaseKey,
} from '@/auth/interfaces/jwt-payload-base.interface';
import {
  JwtPayloadVerifyEmail,
  JwtPayloadVerifyEmailKey,
} from '@/auth/interfaces/jwt-payload-verify-email.interface';
import { TOKEN_TYPES } from '@/auth/constants/token-types.constant';

interface RequestWithUser extends Request {
  user: JwtPayloadBase | JwtPayloadVerifyEmail;
}

function isVerifyEmailPayload(
  user: JwtPayloadBase | JwtPayloadVerifyEmail,
): user is JwtPayloadVerifyEmail {
  return user.type === TOKEN_TYPES.VERIFY_EMAIL;
}

export const CurrentUser = createParamDecorator(
  (
    data: JwtPayloadBaseKey | JwtPayloadVerifyEmailKey,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!data) return user;

    if (isVerifyEmailPayload(user)) {
      return user[data as JwtPayloadVerifyEmailKey];
    }
    return user[data as JwtPayloadBaseKey];
  },
);
