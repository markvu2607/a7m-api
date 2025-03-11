import { Expose } from 'class-transformer';

export class TokenResponseDto {
  @Expose()
  tokenType: string;

  @Expose()
  accessToken: string;

  @Expose()
  expiresIn: number;

  @Expose()
  refreshToken: string;
}
