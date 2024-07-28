import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor() {}

  async sendResetPasswordEmail(toEmail: string, resetPasswordLink: string) {
    // TODO: offload email sending to a queue
  }
}
