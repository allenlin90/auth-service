import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { EncryptionService } from './encryption.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, BcryptService],
  providers: [
    AuthService,
    EncryptionService,
  ],
})
export class AuthModule {}
