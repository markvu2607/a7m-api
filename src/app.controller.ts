import { Controller, Get } from '@nestjs/common';

import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get('health-check')
  healthCheck(): string {
    return 'OK';
  }
}
