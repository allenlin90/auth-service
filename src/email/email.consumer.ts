import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { ConfigService } from '@nestjs/config';

import { ConfigKeys } from '../config';
import { EMAIL_QUEUE_NAME, EmailTasks, ProviderKeys } from '../constants';
import { AuthService } from '../auth/auth.service';

@Processor(EMAIL_QUEUE_NAME)
@Injectable()
export class EmailConsumer extends WorkerHost {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
    @Inject(ProviderKeys.EMAIL_SERVICE)
    private emailService: nodemailer.Transporter<SMTPTransport.SentMessageInfo>,
  ) {
    super();
  }

  async process(job: Job) {
    switch (job.name) {
      case EmailTasks.SEND_RESET_MAIL:
        const { userId, toEmail } = job.data;
        const resetToken = await this.authService.generateResetToken(userId);
        const resetLink = this.generateResetLink(resetToken.token);
        const res = await this.sendEmail(toEmail, resetLink);

        return job.id;
      default:
        throw new Error(`Unknown job name: ${job.name}`);
    }
  }

  // TODO: refine email subject and content
  private async sendEmail(toEmail: string, resetLink: string) {
    return this.emailService.sendMail({
      from: this.config.get(ConfigKeys.EMAIL_FROM),
      to: toEmail,
      subject: 'Reset Password',
      html: `<a href="${resetLink}">Reset Password</a>`,
    });
  }

  // to generate a link to reset password
  private generateResetLink(token: string) {
    return `${this.config.get(ConfigKeys.RESET_SERVICE_URL)}?token=${token}`;
  }
}
