import { METADATA_KEYS } from '@/common/constants/metadata-key.constant';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
      METADATA_KEYS.IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );

    const isRefreshTokenRoute = this.reflector.getAllAndOverride<boolean>(
      METADATA_KEYS.IS_REFRESH_TOKEN_ROUTE,
      [context.getHandler(), context.getClass()],
    );

    if (isPublicRoute || isRefreshTokenRoute) {
      return true;
    }

    return super.canActivate(context);
  }
}
