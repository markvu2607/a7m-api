import { Controller, Get, HttpCode } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';

import { MESSAGES } from '@/common/constants/message.constant';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponse } from '@/common/decorators/message-response.decorator';
import { Serialize } from '@/common/interceptors/serilize.interceptor';

import { GetMeResponseDto } from './dtos/responses/get-me.response.dto';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @HttpCode(StatusCodes.OK)
  @MessageResponse(MESSAGES.GET_ME_SUCCESS)
  @Serialize(GetMeResponseDto)
  async getMe(@CurrentUser('sub') userId: string) {
    const user = await this.usersService.findOneById(userId);
    return {
      data: user,
    };
  }
}
