import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

import { ConfigKeys } from '../config';
import { ProviderKeys, EMAIL_QUEUE_NAME } from '../constants';
import { EmailService } from './email.service';
import { EmailConsumer } from './email.consumer';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: EMAIL_QUEUE_NAME,
    }),
    BullBoardModule.forFeature({
      name: EMAIL_QUEUE_NAME,
      adapter: BullMQAdapter,
    }),
    forwardRef(() => AuthModule),
  ],
  providers: [
    EmailService,
    {
      provide: ProviderKeys.EMAIL_SERVICE,
      useFactory: (config: ConfigService) =>
        nodemailer.createTransport(
          config.get<SMTPTransport.Options>(ConfigKeys.EMAIL_SERVICE_OPTIONS),
        ),
      inject: [ConfigService],
    },
    EmailConsumer,
  ],
  exports: [EmailService],
})
export class EmailModule {}
