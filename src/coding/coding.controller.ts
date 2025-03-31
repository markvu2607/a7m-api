import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { MESSAGES } from '@/common/constants/message.constant';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponse } from '@/common/decorators/message-response.decorator';

import { CodingService } from './coding.service';
import { RunCodeRequestDto } from './dtos/requests/run-code.request.dto';
import { SubmitCodeRequestDto } from './dtos/requests/submit-code.request.dto';

@Controller('coding')
export class CodingController {
  constructor(private readonly codingService: CodingService) {}

  @Post('run-code')
  @HttpCode(HttpStatus.OK)
  @MessageResponse(MESSAGES.CODE_RUN_SUCCESS)
  async runCode(@Body() body: RunCodeRequestDto) {
    const { data } = await this.codingService.runCode(body);
    return { data };
  }

  @Post('submit-code')
  @HttpCode(HttpStatus.OK)
  @MessageResponse(MESSAGES.CODE_SUBMITTED_SUCCESS)
  async submitCode(
    @CurrentUser('sub') userId: string,
    @Body() body: SubmitCodeRequestDto,
  ) {
    const { data } = await this.codingService.submitCode(userId, body);
    return { data };
  }
}
