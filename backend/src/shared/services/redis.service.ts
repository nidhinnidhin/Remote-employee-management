import { Injectable, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  onModuleInit() {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
      throw new Error('REDIS_URL is not defined');
    }

    this.client = new Redis(redisUrl);
  }

  async set(key: string, value: string, ttlSeconds: number) {
    await this.client.set(key, value, 'EX', ttlSeconds);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string) {
    await this.client.del(key);
  }
}
