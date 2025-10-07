import { Inject, Injectable } from '@nestjs/common';
import type { RedisClient } from './redis.provider';
import { REDIS_CLIENT } from './redis.constants';

// Default TTL for generic cache operations (e.g., 1 hour)
const DEFAULT_TTL_SECONDS = 60 * 60;

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {}

  /**
   * Sets a key-value pair in Redis, converting the value to a JSON string.
   * @param key The Redis key.
   * @param value The value to store (can be any object).
   * @param ttlSeconds The time-to-live in seconds. Defaults to 1 hour.
   */
  async setJson(
    key: string,
    value: unknown,
    ttlSeconds: number = DEFAULT_TTL_SECONDS,
  ): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      // Use 'EX' for setting expiration in seconds
      await this.redisClient.set(key, serializedValue, 'EX', ttlSeconds);
    } catch (error) {
      console.error(`[RedisService] Failed to set key ${key}:`, error);
    }
  }

  /**
   * Retrieves a value from Redis and parses it from a JSON string.
   * @param key The Redis key.
   * @returns The parsed object, or null if the key doesn't exist.
   */
  async getJson<T>(key: string): Promise<T | null> {
    try {
      const cachedValue = await this.redisClient.get(key);
      if (!cachedValue) {
        return null;
      }
      return JSON.parse(cachedValue) as T;
    } catch (error) {
      console.error(`[RedisService] Failed to get key ${key}:`, error);
      return null;
    }
  }

  /**
   * Deletes a key from Redis.
   * @param key The Redis key.
   * @returns 1 if the key was deleted, 0 otherwise.
   */
  async del(key: string): Promise<number> {
    try {
      return await this.redisClient.del(key);
    } catch (error) {
      console.error(`[RedisService] Failed to delete key ${key}:`, error);
      return 0;
    }
  }

  // Optional: Expose the raw client for advanced operations (e.g., Pub/Sub, custom commands)
  public getClient(): RedisClient {
    return this.redisClient;
  }
}
