import type { nanoid as nanoId } from 'nanoid';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { ConfigKeys } from '../config';
import { ProviderKeys } from '../constants';
import { UsersService } from '../users/users.service';
import { EncryptionService } from './encryption.service';
import { EmailService } from 'src/email/email.service';
import { AuthRepository } from './auth.repository';
import { SignupDto } from './dtos/signup.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private usersService: UsersService,
    private encryptionService: EncryptionService,
    private jwtService: JwtService,
    private authRepository: AuthRepository,
    private emailService: EmailService,
    @Inject(ProviderKeys.NANO_ID) private nanoid: typeof nanoId,
  ) {}

  async signup(signupData: SignupDto) {
    const { email, password, name } = signupData;
    const emailInUse = await this.usersService.findOne({ email });

    if (emailInUse) {
      throw new BadRequestException('email in use');
    }

    const hashedPassword = await this.hashPassword(password);

    return await this.usersService.create({
      name,
      email,
      password: hashedPassword,
    });
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    const isMatch = await this.encryptionService.compare(
      password,
      user.password,
    );

    if (!isMatch) {
      throw new BadRequestException('invalid credentials');
    }

    return this.generateTokens(user.id);
  }

  async refreshToken(refreshToken: string) {
    // this ensures the user can only fresh access token of one client at a time
    const token = await this.authRepository.findOneAndDeleteRefreshToken({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('invalid refresh token');
    }

    return this.generateTokens(token.userId.toString());
  }

  async changePassword(userId: string, passwords: ChangePasswordDto) {
    const { oldPassword, newPassword } = passwords;

    if (oldPassword === newPassword) {
      throw new BadRequestException("your new password can't be the same");
    }

    const user = await this.usersService.findOne({ _id: userId });

    if (!user) {
      throw new BadRequestException('user not found');
    }

    const isMatch = await this.encryptionService.compare(
      oldPassword,
      user.password,
    );

    if (!isMatch) {
      throw new BadRequestException('invalid password');
    }

    const hashedPassword = await this.hashPassword(newPassword);

    await this.usersService.findOneAndUpdate(
      { _id: user.id },
      { $set: { password: hashedPassword } },
    );

    return user;
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findOne({ email });

    if (user) {
      await this.emailService.sendResetPasswordEmail(user.email, user.id);
    }

    return { message: 'OK' };
  }

  async resetPassword({ token, password }: ResetPasswordDto) {
    const resetToken = await this.authRepository.findOneAndDeleteResetToken({
      token,
      expiryDate: { $gte: new Date() },
    });

    if (!resetToken) {
      throw new BadRequestException('invalid token');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await this.usersService.findOneAndUpdate(
      { _id: resetToken.userId },
      { $set: { password: hashedPassword } },
    );

    return user;
  }

  // to refresh the access token
  async generateRefreshToken(userId: string) {
    const expiryDate = new Date();
    const expiresIn = this.config.get<number>(
      ConfigKeys.REFRESH_TOKEN_EXPIRES_IN,
    );
    expiryDate.setDate(expiryDate.getDate() + expiresIn);

    const refreshToken = await this.authRepository.createRefreshToken({
      userId,
      token: `refresh_${this.nanoid()}`, // TODO: generate uuid with prefix for purpose
      expiryDate,
    });

    return refreshToken;
  }

  // to generate a for resetting password
  async generateResetToken(userId: string) {
    const expiryDate = new Date();
    const expiresIn = this.config.get<number>(
      ConfigKeys.RESET_TOKEN_EXPIRES_IN,
    );
    expiryDate.setHours(expiryDate.getHours() + expiresIn);

    return await this.authRepository.createResetToken({
      userId,
      token: `reset_${this.nanoid()}`, // TODO: generate uuid with prefix for purpose
      expiryDate,
    });
  }

  private async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign({ userId });

    const refreshToken = await this.generateRefreshToken(userId);

    return { accessToken, refreshToken };
  }

  private async hashPassword(password: string) {
    return this.encryptionService.hash(password, 10);
  }
}
