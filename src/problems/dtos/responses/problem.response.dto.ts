import { Expose } from 'class-transformer';

import { Difficulty } from '../../enums/difficulty.enum';
import { TestcaseResponseDto } from './testcase.response.dto';

export class ProblemResponseDto {
  @Expose()
  id: string;

  @Expose()
  slug: string;

  @Expose()
  index: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  defaultCode: string;

  @Expose()
  difficulty: Difficulty;

  @Expose()
  testcases: TestcaseResponseDto;
}
