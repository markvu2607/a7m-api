import { Expose } from 'class-transformer';

import { TokenResponseDto } from './token.response.dto';

export class LoginResponseDto {
  @Expose()
  data: TokenResponseDto;
}
