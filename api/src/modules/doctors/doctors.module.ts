import { Module } from '@nestjs/common';
import { DoctorsRepository } from 'src/repositories/doctors.repository';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';
import { DrizzleModule } from '../../infrasctructure/drizzle/drizzle.module';
import { RedisModule } from 'src/infrasctructure/redis/redis.module';

@Module({
  imports: [DrizzleModule, RedisModule],
  controllers: [DoctorsController],
  providers: [DoctorsService, DoctorsRepository],
  exports: [DoctorsService],
})
export class DoctorsModule {}
