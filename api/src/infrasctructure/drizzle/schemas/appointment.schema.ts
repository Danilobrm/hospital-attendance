import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { doctors } from './doctors.schema';
import { patients } from './patient.schema';

export const appointmentStatusEnum = pgEnum('appointment_status', [
  'CREATED',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED',
]);

export const appointments = pgTable(
  'appointments',
  {
    id: serial('id').primaryKey(),
    doctorId: serial('doctorId')
      .notNull()
      .references(() => doctors.id),
    patientId: serial('patientId')
      .notNull()
      .references(() => patients.id),
    scheduledAt: timestamp('scheduledAt', { withTimezone: true }).notNull(),
    status: appointmentStatusEnum('status').default('CREATED').notNull(),
    notes: text('notes'),
  },
  (table) => [
    index('idx_appointments_doctor_id').on(table.doctorId),
    index('idx_appointments_patient_id').on(table.patientId),
    index('idx_appointments_status').on(table.status),
    index('idx_appointments_scheduled_at').on(table.scheduledAt),
  ],
);

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  doctor: one(doctors, {
    fields: [appointments.doctorId],
    references: [doctors.id],
  }),
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
}));
