import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderKeys } from '../constants';
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
import { nanoid } from 'nanoid';

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
    forwardRef(() => EmailModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    EncryptionService,
    { provide: ProviderKeys.NANO_ID, useValue: nanoid },
  ],
  exports: [AuthService],
})
export class AuthModule {}
