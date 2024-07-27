import type { Request, Response } from 'express';
import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { UserDto } from '../users/dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import type { RefreshToken } from './schemas/refresh-token.schema';

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

  private setRefreshTokenCookie(res: Response, refreshToken: RefreshToken) {
    res.cookie('refreshToken', refreshToken.token, {
      httpOnly: true,
      // sameSite: 'none', // required when client is on a different domain
      expires: refreshToken.expiryDate,
      secure: this.config.get('IS_PRODUCTION'),
    });
  }
}
