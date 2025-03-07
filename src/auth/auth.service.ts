import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import ms, { StringValue } from 'ms';

import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';

import { RegisterRequestDto } from './dtos/requests/register.request.dto';
import { TOKEN_SCHEMES } from './constants/token-schemes.constant';
import { TOKEN_TYPES, TokenType } from './constants/token-types.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
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

  login(userId: string) {
    const { token: accessToken, expiresIn: accessTokenExpiresIn } =
      this.generateJwt(TOKEN_TYPES.ACCESS, userId);
    const { token: refreshToken } = this.generateJwt(
      TOKEN_TYPES.REFRESH,
      userId,
    );

    return {
      tokenType: TOKEN_SCHEMES.BEARER,
      accessToken,
      expiresIn: accessTokenExpiresIn,
      refreshToken,
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

    const { token: accessToken, expiresIn: accessTokenExpiresIn } =
      this.generateJwt(TOKEN_TYPES.ACCESS, savedUser.id);
    const { token: refreshToken } = this.generateJwt(
      TOKEN_TYPES.REFRESH,
      savedUser.id,
    );

    return {
      tokenType: TOKEN_SCHEMES.BEARER,
      accessToken,
      expiresIn: accessTokenExpiresIn,
      refreshToken,
    };
  }

  generateJwt(
    tokenType: TokenType,
    sub: string,
  ): { token: string; expiresIn: number } {
    const tokenPayload = {
      sub,
      type: tokenType,
    };

    const expiresIn = this.configService.get<StringValue>(
      `jwt.${tokenType}.expiresIn`,
    )!;
    const token = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get(`jwt.${tokenType}.secret`),
      expiresIn,
    });

    return { token, expiresIn: ms(expiresIn) / 1000 };
  }
}
