import { SetMetadata } from '@nestjs/common';
import { METADATA_KEYS } from '@/common/constants/metadata-key.constant';

export const RefreshToken = () =>
  SetMetadata(METADATA_KEYS.IS_REFRESH_TOKEN_ROUTE, true);
