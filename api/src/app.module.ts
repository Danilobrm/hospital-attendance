import { Module } from '@nestjs/common';
import { DoctorsModule } from './modules/doctors/doctors.module';
import { PatientsModule } from './modules/patients/patients.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AuthModule } from './modules/auth/auth.module';
import { DrizzleModule } from './infrasctructure/drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { SeedModule } from './modules/seed/seed.module';
import { RedisModule } from './infrasctructure/redis/redis.module';
import { IdempotencyModule } from './idempotency/idempotency.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    IdempotencyModule,
    AuthModule,
    PatientsModule,
    DoctorsModule,
    AppointmentsModule,
    DrizzleModule,
    SeedModule,
  ],
})
export class AppModule {}
