import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ConfigKeys } from '../config';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  constructor(readonly config: ConfigService) {
    const { accessType } = config.get(ConfigKeys.GOOGLE_OAUTH_SETTINGS);
    super({ accessType });
  }

  async canActivate(context: ExecutionContext) {
    const activate = (await super.canActivate(context)) as boolean;

    return activate;
  }
}
