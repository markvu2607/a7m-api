import {
  ISendMailOptions,
  MailerService as NestMailerService,
} from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  constructor(
    private readonly mailerService: NestMailerService,
    private readonly configService: ConfigService,
  ) {}

  // TODO: implement email template
  async sendMail(options: ISendMailOptions): Promise<void> {
    const defaultFrom = this.configService.get<string>('mailer.defaultFrom');
    await this.mailerService.sendMail({
      from: defaultFrom,
      ...options,
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const webUrl = this.configService.get<string>('web.url');
    const verificationLink = `${webUrl}/verify-email?token=${token}`;

    await this.sendMail({
      to: email,
      subject: 'Verify your email',
      html: `
        <p>Please click the link below to verify your email address:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>If you did not request this verification, please ignore this email.</p>
      `,
    });
  }

  async sendWelcomeEmail(email: string): Promise<void> {
    await this.sendMail({
      to: email,
      subject: 'Welcome to A7M',
      html: '<p>Welcome to A7M</p>',
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const webUrl = this.configService.get<string>('web.url');
    const resetLink = `${webUrl}/reset-password?token=${token}`;

    await this.sendMail({
      to: email,
      subject: 'Reset your password',
      html: `
        <p>Please click the link below to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this password reset, please ignore this email.</p>
      `,
    });
  }
}
