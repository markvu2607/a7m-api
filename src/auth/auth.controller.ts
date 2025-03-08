import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Public } from '@/common/decorators/public.decorator';

import { AuthService } from './auth.service';
import { RefreshToken } from './decorators/refresh.decorator';
import { RegisterRequestDto } from './dtos/requests/register.request.dto';
import { JwtLocalGuard } from './guards/jwt-local.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // TODO: add interceptor for reponse dto
  // TODO: add interceptor for response format
  @Public()
  @Post('register')
  @HttpCode(StatusCodes.CREATED)
  async register(@Body() registerDto: RegisterRequestDto) {
    return await this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(JwtLocalGuard)
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

  // @Public()
  // @HttpCode(200)
  // @Post('verify-email')
  // verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
  //   return this.authService.verifyEmail(verifyEmailDto);
  // }

  // @Public()
  // @HttpCode(200)
  // @Post('forgot-password')
  // forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
  //   return this.authService.forgotPassword(forgotPasswordDto);
  // }

  // @Public()
  // @HttpCode(200)
  // @Post('reset-password')
  // resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
  //   return this.authService.resetPassword(resetPasswordDto);
  // }
}
