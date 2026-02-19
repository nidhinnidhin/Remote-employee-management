import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import type { Redis } from 'ioredis';
import type { PendingRegistrationRepository } from '../../../domain/repositories/cache/auth-repository/pending-registration.repository';
import { PendingRegistrationData } from 'src/shared/types/cache/pending-registration.type';
import { CACHE_MESSAGES } from 'src/shared/constants/messages/cache/cache.messages';

@Injectable()
export class RedisPendingRegistrationRepository implements PendingRegistrationRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  private readonly PREFIX = CACHE_MESSAGES.CACHE_PREFIX;

  async save(
    email: string,
    data: PendingRegistrationData,
    ttl: number,
  ): Promise<void> {
    await this.redis.set(
      `${this.PREFIX}:${email}`,
      JSON.stringify(data),
      'EX',
      ttl,
    );
  }

  async find(email: string): Promise<PendingRegistrationData | null> {
    const raw = await this.redis.get(`${this.PREFIX}:${email}`);
    return raw ? (JSON.parse(raw) as PendingRegistrationData) : null;
  }

  async delete(email: string): Promise<void> {
    await this.redis.del(`${this.PREFIX}:${email}`);
  }
}
