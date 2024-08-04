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
import { EmailService } from '../email/email.service';
import { AuthRepository } from './auth.repository';
import { SignupDto } from './dtos/signup.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { GoogleUserDto } from '../users/dtos/google-user.dto';

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
    return this.signupUser(signupData);
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new BadRequestException('invalid credentials');
    }

    await this.validatePassword(password, user.password);

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

  async changePassword(
    userId: string,
    { oldPassword, newPassword }: ChangePasswordDto,
  ) {
    if (oldPassword === newPassword) {
      throw new BadRequestException("your new password can't be the same");
    }

    const user = await this.usersService.findOne({ _id: userId });

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    await this.validatePassword(oldPassword, user.password);

    // update new password
    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

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

  // to generate a refresh token to issue an access token
  async generateRefreshToken(userId: string) {
    const expiryDate = new Date();
    const expiresIn = this.config.get<number>(
      ConfigKeys.REFRESH_TOKEN_EXPIRES_IN,
    );
    expiryDate.setDate(expiryDate.getDate() + expiresIn);

    const refreshToken = await this.authRepository.createRefreshToken({
      userId,
      token: `refresh_${this.nanoid()}`,
      expiryDate,
    });

    return refreshToken;
  }

  // to generate a reset token to reset password
  async generateResetToken(userId: string) {
    const expiryDate = new Date();
    const expiresIn = this.config.get<number>(
      ConfigKeys.RESET_TOKEN_EXPIRES_IN,
    );
    expiryDate.setHours(expiryDate.getHours() + expiresIn);

    return await this.authRepository.createResetToken({
      userId,
      token: `reset_${this.nanoid()}`,
      expiryDate,
    });
  }

  async googleOAuthCallback(profile: GoogleUserDto, signup = false) {
    if (signup) {
      return this.googleOAuthSignup(profile);
    }

    return this.googleOAuthLogin(profile);
  }

  private async googleOAuthSignup({
    id: googleId,
    email,
    firstName,
    lastName,
  }: GoogleUserDto) {
    const name = `${firstName} ${lastName}`;

    const password = await this.generateRandomPassword();

    return this.signupUser({ email, name, password, googleId });
  }

  private async googleOAuthLogin(profile: GoogleUserDto) {
    const user = await this.usersService.findOne({ googleId: profile.id });

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    return await this.generateTokens(user.id);
  }

  private async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign({ userId });

    const refreshToken = await this.generateRefreshToken(userId);

    return { accessToken, refreshToken };
  }

  private async hashPassword(password: string) {
    return this.encryptionService.hash(password, 10);
  }

  private async validatePassword(password: string, hashedPassword: string) {
    const isMatch = await this.encryptionService.compare(
      password,
      hashedPassword,
    );

    if (!isMatch) {
      throw new BadRequestException('invalid credentials');
    }
  }

  private async generateRandomPassword() {
    const randomBytes = this.encryptionService.generateRandomBytes();

    const password = `A!@${randomBytes}`;

    return this.encryptionService.hash(password, 10);
  }

  private async signupUser({ email, password, ...objectData }: SignupDto) {
    const emailInUse = await this.usersService.findOne({ email });

    if (emailInUse) {
      throw new BadRequestException('user already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      ...objectData,
    });

    return this.generateTokens(user.id);
  }
}
