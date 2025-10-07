import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { DrizzleModule } from '../../infrasctructure/drizzle/drizzle.module';
import { PatientsRepository } from 'src/repositories/patients.repository';

@Module({
  imports: [DrizzleModule],
  controllers: [PatientsController],
  providers: [PatientsRepository, PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
