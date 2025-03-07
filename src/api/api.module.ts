import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ProblemsModule } from './problems/problems.module';
import { SolutionsModule } from './solutions/solutions.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { TagsModule } from './tags/tags.module';
import { TestcasesModule } from './testcases/testcases.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ProblemsModule,
    UsersModule,
    AuthModule,
    SolutionsModule,
    TestcasesModule,
    TagsModule,
    SubmissionsModule,
  ],
})
export class ApiModule {}
