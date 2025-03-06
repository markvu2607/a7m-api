import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import config from '@/config/app.config';

import { AppController } from './app.controller';
import { ProblemsModule } from './problems/problems.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ProblemsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
