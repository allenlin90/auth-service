import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import { ConfigKeys } from '../config';
import ProviderKeys from '../constants/provider';
import { EmailService } from './email.service';

@Module({
  providers: [
    EmailService,
    {
      inject: [ConfigService],
      provide: ProviderKeys.EMAIL_SERVICE,
      useFactory: (config: ConfigService) => {
        const options = config.get<SMTPTransport.Options>(
          ConfigKeys.EMAIL_SERVICE_OPTIONS,
        );
        return nodemailer.createTransport(options);
      },
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
