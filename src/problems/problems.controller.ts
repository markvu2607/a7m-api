import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { MESSAGES } from '@/common/constants/message.constant';
import { MessageResponse } from '@/common/decorators/message-response.decorator';
import { Serialize } from '@/common/interceptors/serilize.interceptor';

import { CreateProblemRequestDto } from './dtos/requests/create-problem.request.dto';
import { ProblemResponseDto } from './dtos/responses/problem.response.dto';
import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @MessageResponse(MESSAGES.GET_ALL_PROBLEMS_SUCCESS)
  @Serialize(ProblemResponseDto)
  async getProblems() {
    const { data, metadata } = await this.problemsService.getProblems();
    return {
      data,
      metadata,
    };
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  @MessageResponse(MESSAGES.GET_PROBLEM_SUCCESS)
  @Serialize(ProblemResponseDto)
  async getProblemBySlug(@Param('slug') slug: string) {
    const { data } = await this.problemsService.getProblemBySlug(slug);
    return {
      data,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @MessageResponse(MESSAGES.CREATE_PROBLEM_SUCCESS)
  @Serialize(ProblemResponseDto)
  async createProblem(@Body() body: CreateProblemRequestDto) {
    const { data } = await this.problemsService.createProblem(body);
    return {
      data,
    };
  }

  // TODO: implement api update problem

  // TODO: implement api delete problem
}
