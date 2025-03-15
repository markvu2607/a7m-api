import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Problem } from './entities/problem.entity';
import { Testcase } from './entities/testcase.entity';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';

@Module({
  imports: [TypeOrmModule.forFeature([Problem, Testcase])],
  controllers: [ProblemsController],
  providers: [ProblemsService],
})
export class ProblemsModule {}
