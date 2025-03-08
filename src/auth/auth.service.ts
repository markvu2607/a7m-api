import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import ms, { StringValue } from 'ms';
import { Repository } from 'typeorm';

import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';

import { TOKEN_SCHEMES } from './constants/token-schemes.constant';
import { TOKEN_TYPES, TokenType } from './constants/token-types.constant';
import { RegisterRequestDto } from './dtos/requests/register.request.dto';
import { RefreshToken } from './entities/refresh-token.entity';

type TokenPayload = { type: TokenType; sub: string } & Record<string, unknown>;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await argon2.verify(user.hashedPassword, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  async login(userId: string) {
    const tokenPayloads = [
      { type: TOKEN_TYPES.ACCESS, sub: userId },
      { type: TOKEN_TYPES.REFRESH, sub: userId },
    ];
    const [accessTokenData, refreshTokenData] =
      this.generateJwts(tokenPayloads);

    await this.refreshTokenRepository.upsert(
      {
        userId,
        token: refreshTokenData.token,
        revoked: false,
      },
      ['userId'],
    );

    return {
      tokenType: TOKEN_SCHEMES.BEARER,
      accessToken: accessTokenData.token,
      expiresIn: accessTokenData.expiresIn,
      refreshToken: refreshTokenData.token,
    };
  }

  async register(registerRequestDto: RegisterRequestDto) {
    const user = await this.usersService.findOneByEmail(
      registerRequestDto.email,
    );
    if (user) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await argon2.hash(registerRequestDto.password);

    const newUser = new User();
    newUser.email = registerRequestDto.email;
    newUser.hashedPassword = hashedPassword;
    newUser.username = registerRequestDto.username;
    const savedUser = await this.usersService.save(newUser);

    const tokenPayloads = [
      { type: TOKEN_TYPES.ACCESS, sub: savedUser.id },
      { type: TOKEN_TYPES.REFRESH, sub: savedUser.id },
    ];
    const [accessTokenData, refreshTokenData] =
      this.generateJwts(tokenPayloads);

    await this.refreshTokenRepository.save({
      token: refreshTokenData.token,
      userId: savedUser.id,
    });

    return {
      tokenType: TOKEN_SCHEMES.BEARER,
      accessToken: accessTokenData.token,
      expiresIn: accessTokenData.expiresIn,
      refreshToken: refreshTokenData.token,
    };
  }

  async refreshToken(userId: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: {
        userId,
      },
    });
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (refreshToken.revoked) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const tokenPayloads = [
      { type: TOKEN_TYPES.ACCESS, sub: userId },
      { type: TOKEN_TYPES.REFRESH, sub: userId },
    ];
    const [accessTokenData, refreshTokenData] =
      this.generateJwts(tokenPayloads);

    await this.refreshTokenRepository.update(refreshToken.id, {
      token: refreshTokenData.token,
      revoked: false,
    });

    return {
      tokenType: TOKEN_SCHEMES.BEARER,
      accessToken: accessTokenData.token,
      expiresIn: accessTokenData.expiresIn,
      refreshToken: refreshTokenData.token,
    };
  }

  async logout(userId: string): Promise<void> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: {
        userId,
      },
    });
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (refreshToken.revoked) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    await this.refreshTokenRepository.update(refreshToken.id, {
      revoked: true,
    });
  }

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
}
