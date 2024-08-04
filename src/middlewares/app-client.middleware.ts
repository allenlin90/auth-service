import type { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AppClientMiddleware implements NestMiddleware {
  async use(_req: Request, _res: Response, next: NextFunction) {
    // TODO: verify the app client requesting authentication service
    // deny unregistered app clients
    next();
  }
}
