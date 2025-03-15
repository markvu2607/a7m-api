import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateTestcaseRequestDto {
  @IsString()
  @IsNotEmpty()
  input: string;

  @IsString()
  @IsNotEmpty()
  output: string;

  @IsBoolean()
  @IsNotEmpty()
  isSample: boolean;
}
