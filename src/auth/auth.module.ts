import { nanoid } from 'nanoid';
import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderKeys } from '../constants';
import { UsersModule } from '../users/users.module';
import { EmailModule } from '../email/email.module';

import { EncryptionService } from './encryption.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import {
  RefreshToken,
  RefreshTokenSchema,
} from './schemas/refresh-token.schema';
import { ResetToken, ResetTokenSchema } from './schemas/reset-token.schema';
import { GoogleOauthController } from './google-oauth/google-oauth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { GoogleOAuthMiddleware } from '../middlewares/google-oauth.middleware';
import { AppClientMiddleware } from '../middlewares/app-client.middleware';

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
  controllers: [AuthController, GoogleOauthController],
  providers: [
    AuthService,
    AuthRepository,
    EncryptionService,
    { provide: ProviderKeys.NANO_ID, useValue: nanoid },
    GoogleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AppClientMiddleware, GoogleOAuthMiddleware)
      .forRoutes('auth/google/*');
  }
}
