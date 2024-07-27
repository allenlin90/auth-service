import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { SignupDto } from './dtos/signup.dto';
import { EncryptionService } from './encryption.service';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private encryptionService: EncryptionService,
    private jwtService: JwtService,
    private authRepository: AuthRepository,
    @Inject('UUIDV4') private uuidv4: () => string,
  ) {}

  async signup(signupData: SignupDto) {
    const { email, password, name } = signupData;
    const emailInUse = await this.usersService.findOne({ email });

    if (emailInUse) {
      throw new BadRequestException('email in use');
    }

    const hashedPassword = await this.encryptionService.hash(password, 10);

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

  async generateTokens(userId: string) {
    const accessToken = this.jwtService.sign({ userId });
    const refreshToken = await this.authRepository.createRefreshToken(
      userId,
      this.uuidv4(),
    );

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    // this ensures the user can only login to one client at a time
    const token = await this.authRepository.findOneAndDeleteRefreshToken({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('invalid refresh token');
    }

    return this.generateTokens(token.userId.toString());
  }
}
