import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayloadBase } from '../interfaces/jwt-payload-base.interface';

@Injectable()
export class JwtVerifyEmailStrategy extends PassportStrategy(
  Strategy,
  'jwt-verify-email',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.verifyEmail.secret')!,
    });
  }

  validate(payload: JwtPayloadBase): JwtPayloadBase {
    return payload;
  }
}
