import { Module } from '@nestjs/common';

import { TestcasesController } from './testcases.controller';
import { TestcasesService } from './testcases.service';

@Module({
  controllers: [TestcasesController],
  providers: [TestcasesService],
})
export class TestcasesModule {}
