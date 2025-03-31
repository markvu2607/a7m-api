import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ProblemsModule } from '@/problems/problems.module';
import { SubmissionsModule } from '@/submissions/submissions.module';

import { CodingController } from './coding.controller';
import { CodingService } from './coding.service';
import { Judge0Service } from './judge0.service';

@Module({
  imports: [HttpModule, ProblemsModule, SubmissionsModule],
  controllers: [CodingController],
  // TODO: Separate judge0 to another module
  providers: [CodingService, Judge0Service],
})
export class CodingModule {}
