import { createKeyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from '@/config/app.config';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ResponseFormatInterceptor } from './common/interceptors/response-format.interceptor';
import { ProblemsModule } from './problems/problems.module';
import { SolutionsModule } from './solutions/solutions.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import { CodingModule } from './coding/coding.module';

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
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        stores: [createKeyv(configService.get('redis.url'))],
      }),
    }),
    AuthModule,
    UsersModule,
    ProblemsModule,
    SolutionsModule,
    TagsModule,
    SubmissionsModule,
    CodingModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseFormatInterceptor,
    },
  ],
})
export class AppModule {}
