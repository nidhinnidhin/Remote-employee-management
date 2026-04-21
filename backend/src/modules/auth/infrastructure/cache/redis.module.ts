import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

import { RedisService } from 'src/shared/services/redis/redis.service';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
  ],
  providers: [
    {
      provide: 'IRedisService',
      useClass: RedisService,
    },
    RedisService,
  ],
  exports: [RedisModule, 'IRedisService', RedisService],
})
export class AppRedisModule {}
