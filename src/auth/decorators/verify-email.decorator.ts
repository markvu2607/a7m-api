import { SetMetadata } from '@nestjs/common';
import { METADATA_KEYS } from '@/common/constants/metadata-key.constant';

export const VerifyEmail = () =>
  SetMetadata(METADATA_KEYS.IS_VERIFY_EMAIL_ROUTE, true);
