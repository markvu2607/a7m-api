import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { MailerModule } from '@/mailer/mailer.module';
import { UsersModule } from '@/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BlackListTokenGuard } from './guards/black-list-token.guard';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtResetPasswordGuard } from './guards/jwt-reset-password.guard';
import { JwtVerifyEmailGuard } from './guards/jwt-verify-email.guard';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtResetPasswordStrategy } from './strategies/jwt-reset-password.strategy';
import { JwtVerifyEmailStrategy } from './strategies/jwt-verify-email.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({}), UsersModule, MailerModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtVerifyEmailStrategy,
    JwtResetPasswordStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtRefreshGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtVerifyEmailGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtResetPasswordGuard,
    },
    {
      provide: APP_GUARD,
      useClass: BlackListTokenGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
