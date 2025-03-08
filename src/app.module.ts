import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from '@/config/app.config';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ProblemsModule } from './problems/problems.module';
import { SolutionsModule } from './solutions/solutions.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { TagsModule } from './tags/tags.module';
import { TestcasesModule } from './testcases/testcases.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    // TODO: check environment to use synchronize: true or false
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('database.url'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    ProblemsModule,
    SolutionsModule,
    TestcasesModule,
    TagsModule,
    SubmissionsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
