// src/db/drizzle.provider.ts
import { Provider } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from './constants';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config';

export const drizzleProvider: Provider = {
  provide: DrizzleAsyncProvider,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const connectionString = configService.get<string>('DATABASE_URL');
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in the environment.');
    }

    const pool = new Pool({
      connectionString,
    });

    return drizzle(pool, { schema });
  },
};
