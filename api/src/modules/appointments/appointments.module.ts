import { Module } from '@nestjs/common';
import { AppointmentsRepository } from 'src/repositories/appointments.repository';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { DoctorsModule } from '../doctors/doctors.module';
import { DrizzleModule } from '../../infrasctructure/drizzle/drizzle.module';
import { PatientsModule } from '../patients/patients.module';
import { IdempotencyModule } from 'src/idempotency/idempotency.module';
import { NotificationService } from '../notifications/notification.service';

@Module({
  imports: [DrizzleModule, IdempotencyModule, DoctorsModule, PatientsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsRepository, AppointmentsService, NotificationService],
})
export class AppointmentsModule {}
