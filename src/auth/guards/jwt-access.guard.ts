import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { METADATA_KEYS } from '@/common/constants/metadata-key.constant';

const listOfIgnoreRoutes = [
  METADATA_KEYS.IS_PUBLIC_ROUTE,
  METADATA_KEYS.IS_REFRESH_TOKEN_ROUTE,
  METADATA_KEYS.IS_VERIFY_EMAIL_ROUTE,
  METADATA_KEYS.IS_RESET_PASSWORD_ROUTE,
];

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isIgnoreRoute = listOfIgnoreRoutes.some((route) =>
      this.reflector.getAllAndOverride<boolean>(route, [
        context.getHandler(),
        context.getClass(),
      ]),
    );

    if (isIgnoreRoute) {
      return true;
    }

    return super.canActivate(context);
  }
}
