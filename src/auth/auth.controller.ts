import { Body, Controller, Post, UseGuards } from '@nestjs/common';

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
  @Post('register')
  async register(@Body() registerDto: RegisterRequestDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(JwtLocalGuard)
  @Post('login')
  login(userId: string) {
    return this.authService.login(userId);
  }

  @RefreshToken()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refreshToken(@CurrentUser('sub') userId: string) {
    // return this.authService.refreshToken(userId);
  }
}
