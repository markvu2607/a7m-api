import { Body, Controller, Post } from '@nestjs/common';

import { CurrentUser } from '@/common/decorators/current-user.decorator';

import { CodingService } from './coding.service';
import { RunCodeRequestDto } from './dtos/requests/run-code.request.dto';
import { SubmitCodeRequestDto } from './dtos/requests/submit-code.request.dto';

@Controller('coding')
export class CodingController {
  constructor(private readonly codingService: CodingService) {}

  @Post('run-code')
  async runCode(@Body() body: RunCodeRequestDto) {
    const { data } = await this.codingService.runCode(body);
    return { data };
  }

  @Post('submit-code')
  async submitCode(
    @CurrentUser('sub') userId: string,
    @Body() body: SubmitCodeRequestDto,
  ) {
    const { data } = await this.codingService.submitCode(userId, body);
    return { data };
  }
}
