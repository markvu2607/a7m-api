import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Submission } from './entities/submission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,
  ) {}

  async createSubmission(createSubmission: {
    problemId: string;
    userId: string;
    code: string;
    language: string;
    status: string;
    testcaseId?: string;
  }) {
    const submission = this.submissionsRepository.create(createSubmission);
    return this.submissionsRepository.save(submission);
  }
}
