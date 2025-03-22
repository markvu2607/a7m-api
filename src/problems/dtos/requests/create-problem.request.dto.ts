import { Difficulty } from '@/problems/enums/difficulty.enum';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsArray,
} from 'class-validator';
import { CreateTestcaseRequestDto } from './create-testcase.request.dto';

export class CreateProblemRequestDto {
  @IsNumber()
  @IsNotEmpty()
  index: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Difficulty)
  @IsNotEmpty()
  difficulty: Difficulty;

  @IsString()
  @IsNotEmpty()
  templateRunning: string;

  @IsString()
  @IsNotEmpty()
  solution: string;

  @IsString()
  @IsNotEmpty()
  defaultCode: string;

  @IsArray()
  @IsNotEmpty()
  testcases: CreateTestcaseRequestDto[];
}
