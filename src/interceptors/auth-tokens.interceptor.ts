import type { Response } from 'express';
import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';

import { ConfigKeys } from '../config';
import { RefreshToken } from '../auth/schemas/refresh-token.schema';

interface Tokens {
  accessToken: string;
  refreshToken: RefreshToken;
}

@Injectable()
export class AuthTokensInterceptor implements NestInterceptor {
  constructor(private config: ConfigService) {}
  intercept(
    ctx: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const res = ctx.switchToHttp().getResponse();

    return next.handle().pipe(
      map(({ accessToken, refreshToken }: Tokens) => {
        this.setRefreshTokenCookie(res, refreshToken);

        return { accessToken };
      }),
    );
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
