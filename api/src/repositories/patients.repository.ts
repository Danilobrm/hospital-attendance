import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { DrizzleAsyncProvider } from 'src/infrasctructure/drizzle/constants';
import { patients } from 'src/infrasctructure/drizzle/schema';
import { CreatePatientDto } from 'src/modules/patients/dto/create-patient.dto';
import { Patient } from 'src/modules/patients/entities/patient.entity';

@Injectable()
export class PatientsRepository {
  constructor(
    @Inject(DrizzleAsyncProvider) private readonly db: NodePgDatabase,
  ) {}

  async create(patientData: CreatePatientDto): Promise<Patient> {
    const [createdPatient] = await this.db
      .insert(patients)
      .values({
        name: patientData.name,
        email: patientData.email,
        passwordHash: patientData.password,
        phone: patientData.phone,
        birthDate: new Date(patientData.birthDate),
      })
      .returning();

    return { ...createdPatient, password: createdPatient.passwordHash };
  }

  async findOneById(
    id: number,
  ): Promise<Omit<Patient, 'password'> | undefined> {
    const [result] = await this.db
      .select()
      .from(patients)
      .where(eq(patients.id, id))
      .limit(1);

    return { ...result };
  }

  async findOneByEmail(email: string): Promise<Patient | undefined> {
    const [result] = await this.db
      .select()
      .from(patients)
      .where(eq(patients.email, email))
      .limit(1);

    return { ...result, password: result?.passwordHash };
  }
}
