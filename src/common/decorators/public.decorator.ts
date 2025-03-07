import { SetMetadata } from '@nestjs/common';

import { METADATA_KEYS } from '@/common/constants/metadata-key.constant';

export const Public = () => SetMetadata(METADATA_KEYS.IS_PUBLIC_ROUTE, true);
