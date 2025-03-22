import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class TestCaseRequestDto {
  @IsNotEmpty()
  input: {
    field: string;
    value: string;
  }[];
}

export class RunCodeRequestDto {
  @IsString()
  @IsNotEmpty()
  problemSlug: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsArray()
  @Type(() => TestCaseRequestDto)
  testcases: TestCaseRequestDto[];
}
