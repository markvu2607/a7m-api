import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';

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

  // TODO: add reponse dto interceptor
  @Public()
  @HttpCode(201)
  @Post('register')
  async register(@Body() registerDto: RegisterRequestDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(JwtLocalGuard)
  @HttpCode(200)
  @Post('login')
  login(@CurrentUser('sub') userId: string) {
    return this.authService.login(userId);
  }

  @RefreshToken()
  @UseGuards(JwtRefreshGuard)
  @HttpCode(200)
  @Post('refresh-token')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refreshToken(@CurrentUser('sub') userId: string) {
    // return this.authService.refreshToken(userId);
    return {
      message: 'Token refreshed',
      userId,
    };
  }
}
