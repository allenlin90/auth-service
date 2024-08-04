import type { Request } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { UserDto } from '../users/dtos/user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgetPasswordDto } from './dtos/forget-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthTokensInterceptor } from '../interceptors/auth-tokens.interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    protected readonly config: ConfigService,
  ) {}

  @UseInterceptors(AuthTokensInterceptor)
  @Post('signup')
  async signup(@Body() signupData: SignupDto) {
    return this.authService.signup(signupData);
  }

  @UseInterceptors(AuthTokensInterceptor)
  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @UseInterceptors(AuthTokensInterceptor)
  @Post('refresh')
  async refresh(@Req() req: Request) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      new UnauthorizedException('invalid refresh token');
    }

    return this.authService.refreshToken(refreshToken);
  }

  @HttpCode(200)
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  @Put('/change-password')
  async changePassword(@Body() data: ChangePasswordDto, @Req() req: Request) {
    return this.authService.changePassword(req.userId, data);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() { email }: ForgetPasswordDto) {
    return this.authService.forgotPassword(email);
  }

  @HttpCode(200)
  @Serialize(UserDto)
  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}
