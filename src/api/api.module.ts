import { Module } from '@nestjs/common';

import { AuthModule } from '@/api/auth/auth.module';
import { ProblemsModule } from '@/api/problems/problems.module';
import { UsersModule } from '@/api/users/users.module';

@Module({
  imports: [ProblemsModule, UsersModule, AuthModule],
})
export class ApiModule {}
