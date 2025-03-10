import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

import { MESSAGES } from '@/common/constants/message.constant';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponse } from '@/common/decorators/message-response.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { ResponseData } from '@/common/types/response-data.type';

import { AuthService } from './auth.service';
import { RefreshToken } from './decorators/refresh.decorator';
import { ResetPassword } from './decorators/reset-password.decorator';
import { VerifyEmail } from './decorators/verify-email.decorator';
import { ForgotPasswordRequestDto } from './dtos/requests/forgot-password.request.dto';
import { RegisterRequestDto } from './dtos/requests/register.request.dto';
import { ResetPasswordRequestDto } from './dtos/requests/reset-password.request.dto';
import { LoginResponseDto } from './dtos/responses/login.response.dto';
import { RefreshTokenResponseDto } from './dtos/responses/refresh-token.response.dto';
import { RegisterResponseDto } from './dtos/responses/register.response.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtResetPasswordGuard } from './guards/jwt-reset-password.guard';
import { JwtVerifyEmailGuard } from './guards/jwt-verify-email.guard';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('register')
  @HttpCode(StatusCodes.CREATED)
  @MessageResponse(MESSAGES.REGISTER_SUCCESS)
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<ResponseData<RegisterResponseDto>> {
    const { data } = await this.authService.register(registerDto);
    const responseData = new RegisterResponseDto(data);
    return {
      data: responseData,
    };
  }

  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(StatusCodes.OK)
  @MessageResponse(MESSAGES.LOGIN_SUCCESS)
  async login(
    @CurrentUser('sub') userId: string,
  ): Promise<ResponseData<LoginResponseDto>> {
    const { data } = await this.authService.login(userId);
    const responseData = new LoginResponseDto(data);
    return {
      data: responseData,
    };
  }

  @RefreshToken()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  @HttpCode(StatusCodes.OK)
  @MessageResponse(MESSAGES.REFRESH_TOKEN_SUCCESS)
  async refreshToken(
    @CurrentUser('sub') userId: string,
  ): Promise<ResponseData<RefreshTokenResponseDto>> {
    const { data } = await this.authService.refreshToken(userId);
    const responseData = new RefreshTokenResponseDto(data);
    return {
      data: responseData,
    };
  }

  @Post('logout')
  @HttpCode(StatusCodes.OK)
  @MessageResponse(MESSAGES.LOGOUT_SUCCESS)
  async logout(@CurrentUser('sub') userId: string) {
    await this.authService.logout(userId);
    return {};
  }

  @VerifyEmail()
  @UseGuards(JwtVerifyEmailGuard)
  @Post('verify-email')
  @HttpCode(StatusCodes.OK)
  @MessageResponse(MESSAGES.VERIFY_EMAIL_SUCCESS)
  async verifyEmail(
    @CurrentUser('sub') userId: string,
    @CurrentUser('nonce') nonce: number,
  ) {
    await this.authService.verifyEmail(userId, nonce);
    return {};
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(StatusCodes.OK)
  @MessageResponse(MESSAGES.FORGOT_PASSWORD_SUCCESS)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordRequestDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return {};
  }

  @ResetPassword()
  @UseGuards(JwtResetPasswordGuard)
  @Post('reset-password')
  @HttpCode(StatusCodes.OK)
  @MessageResponse(MESSAGES.RESET_PASSWORD_SUCCESS)
  async resetPassword(
    @CurrentUser('sub') userId: string,
    @CurrentUser('nonce') nonce: number,
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    await this.authService.resetPassword(
      userId,
      nonce,
      resetPasswordRequestDto,
    );
    return {};
  }
}
