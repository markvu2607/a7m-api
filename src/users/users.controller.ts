import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { MESSAGES } from '@/common/constants/message.constant';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponse } from '@/common/decorators/message-response.decorator';
import { Serialize } from '@/common/interceptors/serilize.interceptor';

import { UserResponseDto } from './dtos/responses/user.response.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @MessageResponse(MESSAGES.GET_ME_SUCCESS)
  @Serialize(UserResponseDto)
  async getMe(@CurrentUser('sub') userId: string) {
    const user = await this.usersService.findOneById(userId);
    return {
      data: user,
    };
  }
}
