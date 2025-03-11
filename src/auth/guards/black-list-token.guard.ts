import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';

import { RequestWithUser } from '@/common/interfaces/request-with-user.interface';
import { METADATA_KEYS } from '@/common/constants/metadata-key.constant';

@Injectable()
export class BlackListTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
      METADATA_KEYS.IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );

    if (isPublicRoute) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    const { jti, sub } = user;
    const key = `blacklist-token:${sub}:${jti}`;
    const isBlackListed = await this.cacheManager.get<boolean>(key);
    if (isBlackListed) {
      throw new UnauthorizedException('Token is blacklisted');
    }
    return true;
  }
}
