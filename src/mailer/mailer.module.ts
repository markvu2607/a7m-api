import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailerService } from './mailer.service';

@Module({
  imports: [
    NestMailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mailer.host'),
          port: configService.get<number>('mailer.port'),
          secure: configService.get<boolean>('mailer.secure'),
          auth: {
            user: configService.get<string>('mailer.auth.user'),
            pass: configService.get<string>('mailer.auth.password'),
          },
        },
        defaults: {
          from: configService.get<string>('mailer.defaultFrom'),
        },
      }),
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
