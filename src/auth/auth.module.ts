import { v4 } from 'uuid';
import { randomUUID } from 'crypto';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import ProviderKeys from '../constants/provider';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { UsersModule } from '../users/users.module';
import { EncryptionService } from './encryption.service';
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
