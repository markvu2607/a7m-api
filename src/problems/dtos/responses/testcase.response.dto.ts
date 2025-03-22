import { Expose, Transform } from 'class-transformer';

export class TestcaseResponseDto {
  @Expose()
  @Transform(
    ({ value }: { value: string }) =>
      JSON.parse(value) as { field: string; value: string }[],
  )
  input: { field: string; value: string }[];
}
