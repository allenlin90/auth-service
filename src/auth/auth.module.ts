import { v4 } from 'uuid';
import { randomUUID } from 'crypto';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ProviderKeys from '../constants/provider';
import { UsersModule } from '../users/users.module';
import { EmailModule } from 'src/email/email.module';

import { EncryptionService } from './encryption.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/refresh-token.schema';
import { ResetToken, ResetTokenSchema } from './schemas/reset-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
      },
      {
        name: ResetToken.name,
        schema: ResetTokenSchema,
      },
    ]),
    UsersModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    EncryptionService,
    {
      provide: ProviderKeys.UUIDV4,
      useValue: v4,
    },
    {
      provide: ProviderKeys.UUID,
      useValue: randomUUID,
    },
  ],
})
export class AuthModule {}
