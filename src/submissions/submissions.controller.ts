import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';

import { MESSAGES } from '@/common/constants/message.constant';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MessageResponse } from '@/common/decorators/message-response.decorator';
import { Serialize } from '@/common/interceptors/serilize.interceptor';

import { SubmissionResponseDto } from './dtos/responses/submission.response.dto';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  // TODO: maybe need to add pagination
  @Get('problem/:problemSlug')
  @HttpCode(HttpStatus.OK)
  @MessageResponse(MESSAGES.GET_SUBMISSIONS_SUCCESS)
  @Serialize(SubmissionResponseDto)
  async getSubmissionsByProblemSlug(
    @CurrentUser('sub') userId: string,
    @Param('problemSlug') problemSlug: string,
  ) {
    const { data: submissions } =
      await this.submissionsService.getSubmissionsByProblemSlug(
        userId,
        problemSlug,
      );
    return {
      data: submissions,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @MessageResponse(MESSAGES.GET_SUBMISSION_SUCCESS)
  @Serialize(SubmissionResponseDto)
  async getSubmissionById(
    @CurrentUser('sub') userId: string,
    @Param('id') id: string,
  ) {
    const { data: submission } =
      await this.submissionsService.getSubmissionById(userId, id);
    return {
      data: submission,
    };
  }
}
