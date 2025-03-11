import { Expose } from 'class-transformer';

import { TokenResponseDto } from './token.response.dto';

export class RefreshTokenResponseDto {
  @Expose()
  data: TokenResponseDto;
}
