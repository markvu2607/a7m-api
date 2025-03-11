import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

import { MESSAGES } from '@/common/constants/message.constant';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponse } from '@/common/decorators/message-response.decorator';
import { Public } from '@/common/decorators/public.decorator';
import { Serialize } from '@/common/interceptors/serilize.interceptor';

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
import { LocalGuard } from './guards/local.guard';

// TODO: implement permission with role (casl)

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(StatusCodes.CREATED)
  @MessageResponse(MESSAGES.REGISTER_SUCCESS)
  @Serialize(RegisterResponseDto)
  async register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const { data } = await this.authService.register(registerDto);
    return {
      data,
    };
  }

  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(StatusCodes.OK)
  @MessageResponse(MESSAGES.LOGIN_SUCCESS)
  @Serialize(LoginResponseDto)
  login(@CurrentUser('sub') userId: string): LoginResponseDto {
    const { data } = this.authService.login(userId);
    return {
      data,
    };
  }

  @RefreshToken()
  @Post('refresh-token')
  @HttpCode(StatusCodes.OK)
  @MessageResponse(MESSAGES.REFRESH_TOKEN_SUCCESS)
  @Serialize(RefreshTokenResponseDto)
  async refreshToken(
    @CurrentUser('jti') jti: string,
    @CurrentUser('sub') userId: string,
  ): Promise<RefreshTokenResponseDto> {
    const { data } = await this.authService.refreshToken(jti, userId);
    return {
      data,
    };
  }

  @Post('logout')
  @HttpCode(StatusCodes.OK)
  @MessageResponse(MESSAGES.LOGOUT_SUCCESS)
  async logout(
    @CurrentUser('jti') jti: string,
    @CurrentUser('sub') userId: string,
  ) {
    await this.authService.logout(jti, userId);
    return {};
  }

  @VerifyEmail()
  @Post('verify-email')
  @HttpCode(StatusCodes.OK)
  @MessageResponse(MESSAGES.VERIFY_EMAIL_SUCCESS)
  async verifyEmail(
    @CurrentUser('jti') jti: string,
    @CurrentUser('sub') userId: string,
  ) {
    await this.authService.verifyEmail(jti, userId);
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
  @Post('reset-password')
  @HttpCode(StatusCodes.OK)
  @MessageResponse(MESSAGES.RESET_PASSWORD_SUCCESS)
  async resetPassword(
    @CurrentUser('jti') jti: string,
    @CurrentUser('sub') userId: string,
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ) {
    await this.authService.resetPassword(jti, userId, resetPasswordRequestDto);
    return {};
  }
}
