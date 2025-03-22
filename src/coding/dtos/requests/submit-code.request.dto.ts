import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitCodeRequestDto {
  @IsString()
  @IsNotEmpty()
  problemSlug: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  language: string;
}
