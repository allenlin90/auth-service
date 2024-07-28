import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigKeys } from '../config';

@Injectable()
export class EmailService {
  constructor(private config: ConfigService) {}

  async sendResetPasswordEmail(toEmail: string, resetToken: string) {
    const resetLink = this.generateResetLink(resetToken);
    // TODO: offload email sending to a queue
  }

  // to generate a link to reset password
  private generateResetLink(token: string) {
    return `${this.config.get(ConfigKeys.RESET_SERVICE_URL)}?token=${token}`;
  }
}
