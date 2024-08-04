import type { NextFunction, Request, Response } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

declare global {
  namespace Express {
    interface Request {
      session: {
        oauthProvider?: string;
        intent?: string;
      };
    }
  }
}

@Injectable()
export class GoogleOAuthMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction) {
    req.session.oauthProvider = 'google';

    if (req.baseUrl === '/auth/google/login') {
      req.session.intent = 'login';
    }

    if (req.baseUrl === '/auth/google/signup') {
      req.session.intent = 'signup';
    }

    next();
  }
}
