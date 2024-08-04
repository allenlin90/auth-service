import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';
import { ConfigKeys } from './config';

const PORT = parseInt(process.env.PORT, 10) || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // redis session store
  const redisClient = createClient(config.get(ConfigKeys.REDIS_OPTIONS));
  redisClient.connect();
  const redisStore = new RedisStore({
    client: redisClient,
    ...config.get(ConfigKeys.REDIS_SESSION_STORE_OPTIONS),
  });

  const expressSession = session({
    store: redisStore,
    secret: config.get(ConfigKeys.SESSION_SECRET),
    resave: false,
    saveUninitialized: false,
    cookie: config.get(ConfigKeys.SESSION_COOKIE_OPTIONS),
  });

  // register all plugins and extension
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableVersioning({ type: VersioningType.URI });
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use(expressSession);
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(PORT, () => {
    console.log(`Application running at port ${PORT}`);
  });
}
bootstrap();
