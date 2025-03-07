import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TOKEN_TYPES } from '../constants/token-types.constant';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refresh.secret')!,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (payload.type !== TOKEN_TYPES.REFRESH) {
      throw new UnauthorizedException('Invalid token type');
    }
    return payload;
  }
}
