import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

export type RedisClient = Redis;

export const redisProvider: Provider = {
  useFactory: (): RedisClient => {
    return new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    });
  },
  provide: REDIS_CLIENT,
};
