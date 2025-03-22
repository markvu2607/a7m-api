import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import {
  Judge0SubmissionBatchResponse,
  Judge0SubmissionRequest,
  Judge0SubmissionResponse,
  Judge0SubmissionResult,
} from './types/judge0.types';
import { JUDGE0_LANGUAGE_IDS, JUDGE0_STATUS } from './config/judge0.config';

interface Judge0ErrorResponse {
  message: string;
}

@Injectable()
export class Judge0Service {
  private readonly headers = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': '9bc67dd17cmsh26578bdd99dd528p1246cfjsn10f6ffee3702',
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
  };

  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = 'https://judge0-ce.p.rapidapi.com';
    // this.baseUrl =
    //   this.configService.get<string>('judge0.url') || 'http://localhost:2358';
  }

  getLanguageId(language: string): number {
    const languageKey =
      language.toUpperCase() as keyof typeof JUDGE0_LANGUAGE_IDS;
    const languageId = JUDGE0_LANGUAGE_IDS[languageKey];

    if (!languageId) {
      throw new BadRequestException(`Unsupported language: ${language}`);
    }

    return languageId;
  }

  async createSubmissionBatch(
    submissions: Judge0SubmissionRequest[],
  ): Promise<string[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<Judge0SubmissionResponse[]>(
          `${this.baseUrl}/submissions/batch`,
          {
            submissions,
          },
          {
            headers: this.headers,
          },
        )
        .pipe(
          catchError((error: AxiosError<Judge0ErrorResponse>) => {
            const errorResponse = error.response?.data;
            throw new BadRequestException(
              errorResponse?.message || 'Failed to create submission',
            );
          }),
        ),
    );

    return data.map((submission) => submission.token);
  }

  async createSubmission(
    data: Judge0SubmissionRequest,
  ): Promise<Judge0SubmissionResponse> {
    const { data: response } = await firstValueFrom(
      this.httpService
        .post<Judge0SubmissionResponse>(`${this.baseUrl}/submissions`, data, {
          headers: this.headers,
        })
        .pipe(
          catchError((error: AxiosError<Judge0ErrorResponse>) => {
            const errorResponse = error.response?.data;
            throw new BadRequestException(
              errorResponse?.message || 'Failed to create submission',
            );
          }),
        ),
    );

    return response;
  }

  async getSubmissionResult({
    token,
  }: Judge0SubmissionResponse): Promise<Judge0SubmissionResult> {
    const { data: response } = await firstValueFrom(
      this.httpService
        .get<Judge0SubmissionResult>(`${this.baseUrl}/submissions/${token}`, {
          headers: this.headers,
          params: {
            base64_encoded: false,
            fields: '*',
          },
        })
        .pipe(
          catchError((error: AxiosError<Judge0ErrorResponse>) => {
            const errorResponse = error.response?.data;
            throw new BadRequestException(
              errorResponse?.message || 'Failed to get submission result',
            );
          }),
        ),
    );

    if (
      response.status.id === JUDGE0_STATUS.IN_QUEUE ||
      response.status.id === JUDGE0_STATUS.PROCESSING
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return this.getSubmissionResult({ token });
    }

    return response;
  }

  async getSubmissionBatchResult(
    tokens: string[],
  ): Promise<Judge0SubmissionBatchResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<Judge0SubmissionBatchResponse>(
          `${this.baseUrl}/submissions/batch`,
          {
            headers: this.headers,
            params: {
              base64_encoded: false,
              fields: '*',
              tokens: tokens.join(','),
            },
          },
        )
        .pipe(
          catchError((error: AxiosError<Judge0ErrorResponse>) => {
            const errorResponse = error.response?.data;
            throw new BadRequestException(
              errorResponse?.message || 'Failed to get submission result',
            );
          }),
        ),
    );

    return data;
  }
}
