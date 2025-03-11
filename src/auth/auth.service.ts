import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Cache } from 'cache-manager';
import ms, { StringValue } from 'ms';
import { v4 as uuidv4 } from 'uuid';

import { MESSAGES } from '@/common/constants/message.constant';
import { MailerService } from '@/mailer/mailer.service';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';

import { TOKEN_SCHEMES } from './constants/token-schemes.constant';
import { TOKEN_TYPES, TokenType } from './constants/token-types.constant';
import { ForgotPasswordRequestDto } from './dtos/requests/forgot-password.request.dto';
import { RegisterRequestDto } from './dtos/requests/register.request.dto';
import { ResetPasswordRequestDto } from './dtos/requests/reset-password.request.dto';

type TokenPayload = { type: TokenType; sub: string } & Record<string, unknown>;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  generateJwt(tokenPayload: TokenPayload): {
    token: string;
    expiresIn: number;
  } {
    const expiresIn = this.configService.get<StringValue>(
      `jwt.${tokenPayload.type}.expiresIn`,
    )!;
    const token = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get(`jwt.${tokenPayload.type}.secret`),
      expiresIn,
    });

    return { token, expiresIn: ms(expiresIn) / 1000 };
  }

  generateJwts(tokenPayloads: TokenPayload[]) {
    return tokenPayloads.map((tokenPayload) => this.generateJwt(tokenPayload));
  }

  async validateUser({ email, password }: { email: string; password: string }) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException(MESSAGES.INVALID_EMAIL_OR_PASSWORD);
    }

    const isPasswordValid = await argon2.verify(user.hashedPassword, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(MESSAGES.INVALID_EMAIL_OR_PASSWORD);
    }

    return user;
  }

  login(userId: string) {
    const jti = uuidv4();
    const tokenPayloads = [
      { type: TOKEN_TYPES.ACCESS, sub: userId, jti },
      { type: TOKEN_TYPES.REFRESH, sub: userId, jti },
    ];
    const [accessTokenData, refreshTokenData] =
      this.generateJwts(tokenPayloads);

    return {
      data: {
        tokenType: TOKEN_SCHEMES.BEARER,
        accessToken: accessTokenData.token,
        expiresIn: accessTokenData.expiresIn,
        refreshToken: refreshTokenData.token,
      },
    };
  }

  async register(registerRequestDto: RegisterRequestDto) {
    const user = await this.usersService.findOneByEmail(
      registerRequestDto.email,
    );
    if (user) {
      throw new UnauthorizedException(MESSAGES.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await argon2.hash(registerRequestDto.password);

    const newUser = new User();
    newUser.email = registerRequestDto.email;
    newUser.hashedPassword = hashedPassword;
    newUser.username = registerRequestDto.username;
    const savedUser = await this.usersService.save(newUser);

    const jti = uuidv4();
    const tokenPayloads = [
      { type: TOKEN_TYPES.ACCESS, sub: savedUser.id, jti },
      { type: TOKEN_TYPES.REFRESH, sub: savedUser.id, jti },
    ];
    const [accessTokenData, refreshTokenData] =
      this.generateJwts(tokenPayloads);

    const jtiVerifyEmail = uuidv4();
    const { token: verifyEmailToken } = this.generateJwt({
      type: TOKEN_TYPES.VERIFY_EMAIL,
      sub: savedUser.id,
      email: savedUser.email,
      jti: jtiVerifyEmail,
    });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.mailerService.sendVerificationEmail(savedUser.email, verifyEmailToken);

    return {
      data: {
        tokenType: TOKEN_SCHEMES.BEARER,
        accessToken: accessTokenData.token,
        expiresIn: accessTokenData.expiresIn,
        refreshToken: refreshTokenData.token,
      },
    };
  }

  async refreshToken(oldJti: string, userId: string) {
    const key = `blacklist-token:${userId}:${oldJti}`;
    if (await this.cacheManager.get(key)) {
      throw new UnauthorizedException(MESSAGES.TOKEN_REVOKED);
    }

    await this.cacheManager.set(
      key,
      true,
      Number(ms(this.configService.get('jwt.refresh.expiresIn')!)),
    );

    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException(MESSAGES.USER_NOT_FOUND);
    }

    const jti = uuidv4();
    const tokenPayloads = [
      { type: TOKEN_TYPES.ACCESS, sub: userId, jti },
      { type: TOKEN_TYPES.REFRESH, sub: userId, jti },
    ];
    const [accessTokenData, refreshTokenData] =
      this.generateJwts(tokenPayloads);

    return {
      data: {
        tokenType: TOKEN_SCHEMES.BEARER,
        accessToken: accessTokenData.token,
        expiresIn: accessTokenData.expiresIn,
        refreshToken: refreshTokenData.token,
      },
    };
  }

  async logout(jti: string, userId: string): Promise<void> {
    const key = `blacklist-token:${userId}:${jti}`;
    await this.cacheManager.set(
      key,
      true,
      Number(ms(this.configService.get('jwt.refresh.expiresIn')!)),
    );
  }

  async verifyEmail(jti: string, userId: string) {
    const key = `blacklist-token:${userId}:${jti}`;
    if (await this.cacheManager.get(key)) {
      throw new UnauthorizedException(MESSAGES.TOKEN_REVOKED);
    }

    await this.cacheManager.set(
      key,
      true,
      Number(ms(this.configService.get('jwt.verifyEmail.expiresIn')!)),
    );

    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException(MESSAGES.USER_NOT_FOUND);
    }
    if (user.isVerified) {
      throw new UnauthorizedException(MESSAGES.USER_ALREADY_VERIFIED);
    }

    await this.usersService.save({
      ...user,
      isVerified: true,
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.mailerService.sendWelcomeEmail(user.email);
  }

  async forgotPassword({ email }: ForgotPasswordRequestDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException(MESSAGES.USER_NOT_FOUND);
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(MESSAGES.USER_NOT_VERIFIED);
    }

    const jti = uuidv4();
    const { token: resetPasswordToken } = this.generateJwt({
      type: TOKEN_TYPES.RESET_PASSWORD,
      sub: user.id,
      email: user.email,
      jti,
    });

    await this.mailerService.sendPasswordResetEmail(email, resetPasswordToken);
  }

  async resetPassword(
    jti: string,
    userId: string,
    resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    const key = `blacklist-token:${userId}:${jti}`;
    if (await this.cacheManager.get(key)) {
      throw new UnauthorizedException(MESSAGES.TOKEN_REVOKED);
    }

    await this.cacheManager.set(
      key,
      true,
      Number(ms(this.configService.get('jwt.resetPassword.expiresIn')!)),
    );

    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException(MESSAGES.USER_NOT_FOUND);
    }

    const hashedPassword = await argon2.hash(resetPasswordRequestDto.password);

    await this.usersService.save({
      ...user,
      hashedPassword,
    });
  }
}
