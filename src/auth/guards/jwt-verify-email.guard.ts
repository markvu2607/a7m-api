import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { METADATA_KEYS } from '@/common/constants/metadata-key.constant';

@Injectable()
export class JwtVerifyEmailGuard extends AuthGuard('jwt-verify-email') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isVerifyEmailRoute = this.reflector.getAllAndOverride<boolean>(
      METADATA_KEYS.IS_VERIFY_EMAIL_ROUTE,
      [context.getHandler(), context.getClass()],
    );

    if (!isVerifyEmailRoute) {
      return true;
    }

    return super.canActivate(context);
  }
}
