import { Module } from '@nestjs/common';
import { drizzleProvider } from './drizzle.provider';
import { ConfigModule } from '@nestjs/config';
import { DrizzleAsyncProvider } from './constants';

@Module({
  imports: [ConfigModule],
  providers: [drizzleProvider],
  exports: [DrizzleAsyncProvider],
})
export class DrizzleModule {}
