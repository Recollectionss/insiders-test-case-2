import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  async setRefreshToken(key: string, value: object, ttlInSeconds?: number) {
    key = `auth:refresh:${key}`;
    await this.setJsonCache(key, value, ttlInSeconds);
  }
  async setAccessToken(key: string, value: object, ttlInSeconds?: number) {
    key = `auth:access:${key}`;
    await this.setJsonCache(key, value, ttlInSeconds);
  }

  async setJsonCache(key: string, value: object, ttlInSeconds?: number) {
    await this.redisClient.set(key, '$', value);
    if (ttlInSeconds) {
      await this.redisClient.expire(key, ttlInSeconds);
    }
  }

  async getJsonCache(key: string) {
    return await this.redisClient.json.get(key);
  }

  async deleteRefreshToken(key: string) {
    key = `auth:refresh:${key}`;
    return this.deleteJsonCache(key);
  }
  async deleteAccessToken(key: string) {
    key = `auth:access:${key}`;
    return this.deleteJsonCache(key);
  }
  async deleteJsonCache(key: string) {
    return await this.redisClient.json.del(key);
  }
}
