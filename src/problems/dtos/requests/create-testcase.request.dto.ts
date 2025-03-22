import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateTestcaseRequestDto {
  @IsString()
  @IsNotEmpty()
  input: string;

  @IsBoolean()
  @IsNotEmpty()
  isSample: boolean;
}
