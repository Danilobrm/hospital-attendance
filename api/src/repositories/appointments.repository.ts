import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, gte, lte } from 'drizzle-orm';
import { DrizzleAsyncProvider } from 'src/infrasctructure/drizzle/constants';
import {
  appointments,
  doctors,
  patients,
} from 'src/infrasctructure/drizzle/schema';
import { CreateAppointmentDto } from 'src/modules/appointments/dto/create-appointment.dto';
import { Appointment } from 'src/modules/appointments/entities/appointment.entity';
import { FindAppointmentsDto } from 'src/modules/appointments/dto/find-appointments.dto';

@Injectable()
export class AppointmentsRepository {
  constructor(
    @Inject(DrizzleAsyncProvider) private readonly db: NodePgDatabase,
  ) {}

  async create(
    patientId: number,
    appointmentData: CreateAppointmentDto,
  ): Promise<number> {
    const [result] = await this.db
      .insert(appointments)
      .values({
        doctorId: appointmentData.doctorId,
        patientId: patientId,
        scheduledAt: new Date(appointmentData.scheduledAt),
        notes: appointmentData.notes,
      })
      .returning({ id: appointments.id });

    return result.id;
  }

  async findByDoctorAndSlot(
    doctorId: number,
    slot: string,
  ): Promise<number | undefined> {
    const slotDate = new Date(slot);

    const [result] = await this.db
      .select({ id: appointments.id })
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          eq(appointments.scheduledAt, slotDate),
        ),
      )
      .limit(1);

    return result?.id;
  }

  async findByPatientAndSlot(
    patientId: number,
    slot: string,
  ): Promise<number | undefined> {
    const slotDate = new Date(slot);

    const [result] = await this.db
      .select({ id: appointments.id })
      .from(appointments)
      .where(
        and(
          eq(appointments.patientId, patientId),
          eq(appointments.scheduledAt, slotDate),
        ),
      )
      .limit(1);

    return result?.id;
  }

  private setFilters(params: FindAppointmentsDto): any[] {
    const { doctorId, patientId, status, from, to } = params;

    const filters: any[] = [];

    if (doctorId) {
      filters.push(eq(appointments.doctorId, doctorId));
    }

    if (patientId) {
      filters.push(eq(appointments.patientId, patientId));
    }

    if (status) {
      filters.push(
        eq(
          appointments.status,
          status as unknown as
            | 'CREATED'
            | 'CONFIRMED'
            | 'CANCELLED'
            | 'COMPLETED',
        ),
      );
    }

    if (from) {
      filters.push(gte(appointments.scheduledAt, new Date(from)));
    }

    if (to) {
      filters.push(lte(appointments.scheduledAt, new Date(to)));
    }

    return filters;
  }

  async findAll(filter: FindAppointmentsDto): Promise<
    {
      id: number;
      doctorId: number;
      doctorName: string;
      doctorSpecialty?: string;
      scheduledAt: Date;
      notes: string | null;
      status: 'CREATED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    }[]
  > {
    const result = await this.db
      .select({
        id: appointments.id,
        doctorId: appointments.doctorId,
        doctorName: doctors.name,
        doctorSpecialty: doctors.specialty,
        scheduledAt: appointments.scheduledAt,
        notes: appointments.notes,
        status: appointments.status,
      })
      .from(appointments)
      .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
      .where(and(...this.setFilters(filter)));

    return result.map((item) => ({
      ...item,
      doctorName: item.doctorName ?? '',
      doctorSpecialty: item.doctorSpecialty ?? undefined,
    }));
  }

  async findOneById(appointmentId: number): Promise<Appointment | null> {
    const [result] = await this.db
      .select({
        id: appointments.id,
        patientEmail: patients.email,
        patientName: patients.name,
        doctorId: appointments.doctorId,
        doctorName: doctors.name,
        doctorSpecialty: doctors.specialty,
        scheduledAt: appointments.scheduledAt,
        notes: appointments.notes,
        status: appointments.status,
      })
      .from(appointments)
      .leftJoin(patients, eq(appointments.patientId, patients.id))
      .leftJoin(doctors, eq(appointments.doctorId, doctors.id))
      .where(eq(appointments.id, appointmentId))
      .limit(1);

    if (!result) {
      return null;
    }

    return {
      ...result,
      doctorName: result.doctorName ?? '',
      doctorSpecialty: result.doctorSpecialty ?? undefined,
      patientEmail: result.patientEmail ?? '',
      patientName: result.patientName ?? '',
    };
  }

  async updateStatus(
    appointmentId: number,
    newStatus: 'CREATED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED',
  ): Promise<number> {
    return await this.db
      .update(appointments)
      .set({ status: newStatus })
      .where(eq(appointments.id, appointmentId))
      .returning({ id: appointments.id })
      .then((res) => res[0].id);
  }
}
