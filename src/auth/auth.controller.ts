import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';

import { AuthService } from './auth.service';
import { RefreshToken } from './decorators/refresh.decorator';
import { ResetPassword } from './decorators/reset-password.decorator';
import { VerifyEmail } from './decorators/verify-email.decorator';
import { ForgotPasswordRequestDto } from './dtos/requests/forgot-password.request.dto';
import { RegisterRequestDto } from './dtos/requests/register.request.dto';
import { ResetPasswordRequestDto } from './dtos/requests/reset-password.request.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtResetPasswordGuard } from './guards/jwt-reset-password.guard';
import { JwtVerifyEmailGuard } from './guards/jwt-verify-email.guard';
import { LocalGuard } from './guards/local.guard';

// TODO: add interceptor for reponse dto
// TODO: add interceptor for response format
// TODO: implement redis module to save nonce -> check if nonce is used

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  @HttpCode(StatusCodes.CREATED)
  async register(@Body() registerDto: RegisterRequestDto) {
    return await this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(StatusCodes.OK)
  async login(@CurrentUser('sub') userId: string) {
    return await this.authService.login(userId);
  }

  @RefreshToken()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  @HttpCode(StatusCodes.OK)
  async refreshToken(@CurrentUser('sub') userId: string) {
    return await this.authService.refreshToken(userId);
  }

  @Post('logout')
  @HttpCode(StatusCodes.OK)
  async logout(@CurrentUser('sub') userId: string) {
    await this.authService.logout(userId);
    return {};
  }

  @VerifyEmail()
  @UseGuards(JwtVerifyEmailGuard)
  @Post('verify-email')
  @HttpCode(StatusCodes.OK)
  verifyEmail(
    @CurrentUser('sub') userId: string,
    @CurrentUser('nonce') nonce: number,
  ) {
    return this.authService.verifyEmail(userId, nonce);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(StatusCodes.OK)
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordRequestDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @ResetPassword()
  @UseGuards(JwtResetPasswordGuard)
  @Post('reset-password')
  @HttpCode(StatusCodes.OK)
  resetPassword(
    @CurrentUser('sub') userId: string,
    @CurrentUser('nonce') nonce: number,
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    return this.authService.resetPassword(
      userId,
      nonce,
      resetPasswordRequestDto,
    );
  }
}
