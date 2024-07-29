import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule as BoardModule } from '@bull-board/nestjs';

import { ConfigKeys } from '../config';
import { QUEUE_ROUTE } from '../constants';
import { AdminAuthMiddleware } from '../middlewares/admin-auth.middleware';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        connection: {
          host: config.get<string>(ConfigKeys.REDIS_HOST),
          port: config.get<number>(ConfigKeys.REDIS_PORT),
        },
      }),
      inject: [ConfigService],
    }),
    BoardModule.forRoot({
      route: QUEUE_ROUTE,
      adapter: ExpressAdapter,
    }),
  ],
})
export class BullMQModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminAuthMiddleware).forRoutes(`${QUEUE_ROUTE}/*`);
  }
}
