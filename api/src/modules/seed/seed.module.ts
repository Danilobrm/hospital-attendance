import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { DrizzleModule } from 'src/infrasctructure/drizzle/drizzle.module';

@Module({
  imports: [DrizzleModule],
  providers: [SeedService],
})
export class SeedModule {}
