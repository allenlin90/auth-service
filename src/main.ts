import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

const PORT = parseInt(process.env.PORT, 10) || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // register all plugins and extension
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableVersioning({ type: VersioningType.URI });
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(PORT, () => {
    console.log(`Application running at port ${PORT}`);
  });
}
bootstrap();
