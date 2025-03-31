import { Injectable } from '@nestjs/common';

import { Testcase } from '@/problems/entities/testcase.entity';
import { ProblemsService } from '@/problems/problems.service';
import { SubmissionsService } from '@/submissions/submissions.service';

import { JUDGE0_STATUS } from './config/judge0.config';
import { RunCodeRequestDto } from './dtos/requests/run-code.request.dto';
import { SubmitCodeRequestDto } from './dtos/requests/submit-code.request.dto';
import { Judge0Service } from './judge0.service';
import { Judge0SubmissionResult } from './types/judge0.types';

const createPythonTemplate = (templateRunning: string, solution: string) => `
${solution}

${templateRunning}
`;

@Injectable()
export class CodingService {
  constructor(
    private readonly judge0Service: Judge0Service,
    private readonly problemService: ProblemsService,
    private readonly submissionsService: SubmissionsService,
  ) {}

  async runCode(runCodeDto: RunCodeRequestDto): Promise<{
    data: {
      status: string;
      stdin: string | null;
      output: string | null;
      expectedOutput: string | null;
    }[];
  }> {
    const { problemSlug, code, language, testcases } = runCodeDto;
    const languageId = this.judge0Service.getLanguageId(language);

    const { data: problem } =
      await this.problemService.getProblemBySlug(problemSlug);

    const systemSubmissionTokens =
      await this.judge0Service.createSubmissionBatch(
        testcases.map((testcase) => ({
          source_code: createPythonTemplate(
            problem.templateRunning,
            problem.solution,
          ),
          language_id: languageId,
          stdin: testcase.input.map((input) => input.value).join('\n'),
        })),
      );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const { submissions: systemResults } =
      await this.judge0Service.getSubmissionBatchResult(systemSubmissionTokens);

    const submissionTokens = await this.judge0Service.createSubmissionBatch(
      testcases.map((testcase, index) => ({
        source_code: createPythonTemplate(problem.templateRunning, code),
        language_id: languageId,
        stdin: testcase.input.map((input) => input.value).join('\n'),
        expected_output: systemResults[index].stdout ?? undefined,
      })),
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const results =
      await this.judge0Service.getSubmissionBatchResult(submissionTokens);

    // TODO: should return submission object instead of array of custom object
    return {
      data: results.submissions.map((submission) => ({
        status: submission.status.description,
        stdin: submission.stdin,
        output: submission.stdout,
        expectedOutput: submission.expected_output ?? null,
      })),
    };
  }

  async submitCode(
    userId: string,
    submitCodeDto: SubmitCodeRequestDto,
  ): Promise<{
    data: {
      submissionId: string;
    };
  }> {
    const { problemSlug, code, language } = submitCodeDto;
    const languageId = this.judge0Service.getLanguageId(language);

    const { data: problem } =
      await this.problemService.getProblemBySlug(problemSlug);

    let error: {
      testcase: Testcase;
      systemResults: Judge0SubmissionResult;
      userResults: Judge0SubmissionResult;
    } | null = null;

    for (const testcase of problem.testcases) {
      const systemSubmission = await this.judge0Service.createSubmission({
        source_code: createPythonTemplate(
          problem.templateRunning,
          problem.solution,
        ),
        language_id: languageId,
        stdin: (
          JSON.parse(testcase.input) as { field: string; value: string }[]
        )
          .map((input) => input.value)
          .join('\n'),
      });

      const systemResults =
        await this.judge0Service.getSubmissionResult(systemSubmission);

      const userSubmission = await this.judge0Service.createSubmission({
        source_code: createPythonTemplate(problem.templateRunning, code),
        language_id: languageId,
        stdin: (
          JSON.parse(testcase.input) as { field: string; value: string }[]
        )
          .map((input) => input.value)
          .join('\n'),
        expected_output: systemResults.stdout ?? undefined,
      });

      const userResults =
        await this.judge0Service.getSubmissionResult(userSubmission);

      if (userResults.status.id !== JUDGE0_STATUS.ACCEPTED) {
        error = {
          testcase,
          systemResults,
          userResults,
        };
        break;
      }
    }

    const submission = await this.submissionsService.createSubmission({
      problemId: problem.id,
      userId: userId,
      code,
      language,
      status: error ? error.userResults.status.description : 'Accepted',
      testcase: JSON.stringify(error?.testcase.input),
      output: error?.userResults.stdout ?? undefined,
      expectedOutput: error?.systemResults.stdout ?? undefined,
    });

    return {
      data: {
        submissionId: submission.id,
      },
    };
  }
}
