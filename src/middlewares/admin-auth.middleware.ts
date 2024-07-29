import type { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigKeys } from '../config';

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const isProduction = this.configService.get(
      ConfigKeys.IS_PRODUCTION,
      false,
    );

    // TODO: implement admin authz and authn
    if (isProduction && !req.headers.authorization) {
      res.redirect('/admin');
      return;
    }

    next();
  }
}
