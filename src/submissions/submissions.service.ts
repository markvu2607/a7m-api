import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProblemsService } from '@/problems/problems.service';

import { Submission } from './entities/submission.entity';
import { MESSAGES } from '@/common/constants/message.constant';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,
    private readonly problemsService: ProblemsService,
  ) {}

  async getSubmissionsByProblemSlug(userId: string, problemSlug: string) {
    const { data: problem } =
      await this.problemsService.getProblemBySlug(problemSlug);

    const submissions = await this.submissionsRepository.find({
      where: {
        userId,
        problemId: problem.id,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: submissions,
    };
  }

  async getSubmissionById(userId: string, id: string) {
    const submission = await this.submissionsRepository.findOne({
      where: { id },
    });

    if (!submission) {
      throw new NotFoundException(MESSAGES.SUBMISSION_NOT_FOUND);
    }

    if (submission.userId !== userId) {
      throw new ForbiddenException(MESSAGES.SUBMISSION_NOT_ALLOWED);
    }

    return {
      data: submission,
    };
  }

  async createSubmission(createSubmission: {
    problemId: string;
    userId: string;
    code: string;
    language: string;
    status: string;
    testcase?: string;
    output?: string;
    expectedOutput?: string;
  }) {
    const submission = this.submissionsRepository.create(createSubmission);
    return this.submissionsRepository.save(submission);
  }
}
