import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientsRepository } from 'src/repositories/patients.repository';
import * as bcrypt from 'bcrypt';

// return this.db.select().from(patients).where(eq(patients.id, id)).limit(1);

@Injectable()
export class PatientsService {
  constructor(private patientsRepository: PatientsRepository) {}

  async create(createPatientDto: CreatePatientDto): Promise<any> {
    const patientExists = await this.patientsRepository.findOneByEmail(
      createPatientDto.email,
    );

    console.log(patientExists);

    if (patientExists) {
      throw new ConflictException('Patient with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(createPatientDto.password, 10);

    return this.patientsRepository.create({
      ...createPatientDto,
      password: hashedPassword,
    });
  }

  async findOneById(id: number) {
    const patient = await this.patientsRepository.findOneById(id);
    if (!patient) {
      throw new NotFoundException(`Patient not found.`);
    }
    return patient;
  }

  async findOneByEmail(email: string) {
    const patient = await this.patientsRepository.findOneByEmail(email);
    if (!patient) {
      throw new NotFoundException(`Patient not found.`);
    }
    return patient;
  }
}
