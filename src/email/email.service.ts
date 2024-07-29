import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';

import { EMAIL_QUEUE_NAME, EmailTasks } from '../constants';

@Injectable()
export class EmailService {
  constructor(
    @InjectQueue(EMAIL_QUEUE_NAME)
    private emailQueue: Queue<Record<string, any>>,
  ) {}

  async sendResetPasswordEmail(toEmail: string, userId: string) {
    const job = await this.emailQueue.add(EmailTasks.SEND_RESET_MAIL, {
      toEmail,
      userId,
    });

    return job.id;
  }
}
