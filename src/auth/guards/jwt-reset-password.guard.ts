import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { METADATA_KEYS } from '@/common/constants/metadata-key.constant';

@Injectable()
export class JwtResetPasswordGuard extends AuthGuard('jwt-reset-password') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isResetPasswordRoute = this.reflector.getAllAndOverride<boolean>(
      METADATA_KEYS.IS_RESET_PASSWORD_ROUTE,
      [context.getHandler(), context.getClass()],
    );

    if (!isResetPasswordRoute) {
      return true;
    }

    return super.canActivate(context);
  }
}
