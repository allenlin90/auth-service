import { v4 } from 'uuid';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EncryptionService } from './encryption.service';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/refresh-token.schema';
import { AuthRepository } from './auth.repository';
import ProviderKeys from '../constants/provider';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
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
  ],
})
export class AuthModule {}
