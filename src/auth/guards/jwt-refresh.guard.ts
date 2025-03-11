import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { METADATA_KEYS } from '@/common/constants/metadata-key.constant';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isRefreshTokenRoute = this.reflector.getAllAndOverride<boolean>(
      METADATA_KEYS.IS_REFRESH_TOKEN_ROUTE,
      [context.getHandler(), context.getClass()],
    );

    if (!isRefreshTokenRoute) {
      return true;
    }

    return super.canActivate(context);
  }
}
