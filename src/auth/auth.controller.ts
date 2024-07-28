import type { Request, Response } from 'express';
import type { RefreshToken } from './schemas/refresh-token.schema';

import {
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '../config';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { UserDto } from '../users/dtos/user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ForgetPasswordDto } from './dtos/forget-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private config: ConfigService,
  ) {}

  @Serialize(UserDto)
  @Post('signup')
  async signup(@Body() signupData: SignupDto) {
    return this.authService.signup(signupData);
  }

  @Post('login')
  async login(
    @Body() credentials: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(credentials);

    this.setRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken: token } = req.cookies;

    if (!token) {
      new UnauthorizedException('invalid refresh token');
    }

    const { accessToken, refreshToken } =
      await this.authService.refreshToken(token);

    this.setRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  @HttpCode(204)
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

  @HttpCode(204)
  @Serialize(UserDto)
  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }

  private setRefreshTokenCookie(res: Response, refreshToken: RefreshToken) {
    res.cookie('refreshToken', refreshToken.token, {
      httpOnly: true,
      // sameSite: 'none', // required when client is on a different domain
      expires: refreshToken.expiryDate,
      secure: this.config.get(ConfigKeys.IS_PRODUCTION),
    });
  }
}
