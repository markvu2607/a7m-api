import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';

import { MESSAGES } from '@/common/constants/message.constant';

import { CreateProblemRequestDto } from './dtos/requests/create-problem.request.dto';
import { Problem } from './entities/problem.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemsRepository: Repository<Problem>,
  ) {}

  // TODO: implement pagination
  async getProblems() {
    const problems = await this.problemsRepository.find();
    return { data: problems, metadata: { total: problems.length } };
  }

  async getProblemBySlug(slug: string) {
    const problem = await this.problemsRepository.findOne({
      where: {
        slug,
        testcases: {
          isSample: true,
        },
      },
    });

    if (!problem) {
      throw new NotFoundException(MESSAGES.PROBLEM_NOT_FOUND);
    }
    return { data: problem };
  }

  async createProblem(data: CreateProblemRequestDto) {
    const problem = this.problemsRepository.create({
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      templateRunning: data.templateRunning,
      solution: data.solution,
      defaultCode: data.defaultCode,
      slug: slugify(data.title, { lower: true }),
      index: data.index,
      testcases: data.testcases.map((testcase) => ({
        input: testcase.input,
        isSample: testcase.isSample,
      })),
    });

    const savedProblem = await this.problemsRepository.save(problem);
    return { data: savedProblem };
  }

  async getProblemById(id: string) {
    const problem = await this.problemsRepository.findOne({
      where: { id },
    });

    if (!problem) {
      throw new NotFoundException(MESSAGES.PROBLEM_NOT_FOUND);
    }

    return { data: problem };
  }
}
