import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';

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
import { TokenResponseDto } from './dtos/responses/token.response.dto';
import { LocalGuard } from './guards/local.guard';

// TODO: implement permission with role (casl)

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @MessageResponse(MESSAGES.REGISTER_SUCCESS)
  @Serialize(TokenResponseDto)
  async register(@Body() registerDto: RegisterRequestDto) {
    const { data } = await this.authService.register(registerDto);
    return {
      data,
    };
  }

  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @MessageResponse(MESSAGES.LOGIN_SUCCESS)
  @Serialize(TokenResponseDto)
  login(@CurrentUser('sub') userId: string) {
    const { data } = this.authService.login(userId);
    return {
      data,
    };
  }

  @RefreshToken()
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @MessageResponse(MESSAGES.REFRESH_TOKEN_SUCCESS)
  @Serialize(TokenResponseDto)
  async refreshToken(
    @CurrentUser('jti') jti: string,
    @CurrentUser('sub') userId: string,
  ) {
    const { data } = await this.authService.refreshToken(jti, userId);
    return {
      data,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
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
  @HttpCode(HttpStatus.OK)
  @MessageResponse(MESSAGES.FORGOT_PASSWORD_SUCCESS)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordRequestDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return {};
  }

  @ResetPassword()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
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
