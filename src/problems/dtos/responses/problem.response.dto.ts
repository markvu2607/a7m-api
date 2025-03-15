import { Expose } from 'class-transformer';
import { Difficulty } from '../../enums/difficulty.enum';

export class TestcaseResponseDto {
  @Expose()
  id: string;

  @Expose()
  input: string;

  @Expose()
  output: string;

  @Expose()
  isSample: boolean;
}

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
  difficulty: Difficulty;

  @Expose()
  testcases: TestcaseResponseDto;
}
