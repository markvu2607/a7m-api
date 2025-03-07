import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TOKEN_TYPES } from '../constants/token-types.constant';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.access.secret')!,
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (payload.type !== TOKEN_TYPES.ACCESS) {
      throw new UnauthorizedException('Invalid token type');
    }
    return payload;
  }
}
