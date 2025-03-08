import { SetMetadata } from '@nestjs/common';
import { METADATA_KEYS } from '@/common/constants/metadata-key.constant';

export const ResetPassword = () =>
  SetMetadata(METADATA_KEYS.IS_RESET_PASSWORD_ROUTE, true);
