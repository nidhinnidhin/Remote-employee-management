import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';

import { RedisService } from 'src/shared/services/redis.service';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: process.env.REDIS_URL,
    }),
  ],
  providers: [RedisService],
  exports: [RedisModule, RedisService],
})
export class AppRedisModule { }
