import type { Request } from 'express';
import {
  BadRequestException,
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';
import { GoogleOAuthGuard } from '../../guards/google-oauth.guard';
import { GoogleUser } from './google-user.interface';
import { AuthTokensInterceptor } from '../../interceptors/auth-tokens.interceptor';

@Controller('auth/google')
export class GoogleOauthController {
  constructor(
    private readonly authService: AuthService,
    protected readonly config: ConfigService,
  ) {}

  @UseGuards(GoogleOAuthGuard)
  @Get('login')
  async googleOAuth(@Req() _req: Request) {}

  @UseGuards(GoogleOAuthGuard)
  @Get('signup')
  async googleOAuthSignup(@Req() _req: Request) {}

  @UseInterceptors(AuthTokensInterceptor)
  @UseGuards(GoogleOAuthGuard)
  @Get('callback')
  async googleOAuthCallback(@Req() req: Request) {
    if (req.session.oauthProvider !== 'google') {
      throw new BadRequestException('invalid oauth provider');
    }

    if (!req.user) {
      throw new UnauthorizedException('invalid google user');
    }

    return this.authService.googleOAuthCallback(
      req.user as GoogleUser,
      req.session.intent === 'signup',
    );
  }
}
