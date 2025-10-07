import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/infrasctructure/redis/redis.service';

// TTL in seconds (e.g., 24 hours for idempotency keys)
const IDEMPOTENCY_KEY_TTL = 60 * 60 * 24;
const IDEMPOTENCY_PREFIX = 'idempotency:';

interface IdempotencyRecord {
  status: number;
  data: unknown;
}

@Injectable()
export class IdempotencyService {
  constructor(private readonly redisService: RedisService) {}

  private getRecordKey(idempotencyKey: string): string {
    return `${IDEMPOTENCY_PREFIX}${idempotencyKey}`;
  }

  async getRecord(key: string): Promise<IdempotencyRecord | null> {
    const redisKey = this.getRecordKey(key);

    return await this.redisService.getJson<IdempotencyRecord>(redisKey);
  }

  async saveRecord(key: string, status: number, data: unknown): Promise<void> {
    const redisKey = this.getRecordKey(key);
    const record: IdempotencyRecord = { status, data };

    await this.redisService.setJson(redisKey, record, IDEMPOTENCY_KEY_TTL);
  }

  async deleteIdempotencyCache(key: string): Promise<number> {
    const redisKey = this.getRecordKey(key);
    const deleted = await this.redisService.del(redisKey);
    console.log(`[IDEMPOTENCY] ${key} deleted`);
    return deleted;
  }
}
