import { SetMetadata } from '@nestjs/common';
import { METADATA_KEYS } from '../constants/metadata-key.constant';

export const MessageResponse = (message: string) => {
  return SetMetadata(METADATA_KEYS.MESSAGE_RESPONSE, message);
};
