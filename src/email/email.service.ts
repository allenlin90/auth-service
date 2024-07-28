import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigKeys } from '../config';
import ProviderKeys from '../constants/provider';

@Injectable()
export class EmailService {
  constructor(
    private config: ConfigService,
    @Inject(ProviderKeys.EMAIL_SERVICE)
    private emailService: nodemailer.Transporter<SMTPTransport.SentMessageInfo>,
  ) {}

  // TODO: refine email subject and content
  async sendResetPasswordEmail(toEmail: string, resetToken: string) {
    const resetLink = this.generateResetLink(resetToken);
    // TODO: offload email sending to a queue
    this.emailService.sendMail({
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
