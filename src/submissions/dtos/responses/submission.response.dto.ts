import { Expose } from 'class-transformer';

export class SubmissionResponseDto {
  @Expose()
  id: string;
  @Expose()
  userId: string;

  @Expose()
  code: string;

  @Expose()
  language: string;

  @Expose()
  status: string;

  @Expose()
  testcase: string;

  @Expose()
  output: string;

  @Expose()
  expectedOutput: string;

  @Expose()
  createdAt: Date;
}
