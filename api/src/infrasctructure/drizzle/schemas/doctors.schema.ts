import { relations } from 'drizzle-orm';
import { pgTable, text, serial, boolean, index } from 'drizzle-orm/pg-core';
import { appointments } from './appointment.schema';
import { varchar } from 'drizzle-orm/pg-core';

export const doctors = pgTable(
  'doctors',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('passwordHash', { length: 255 }).notNull(),
    specialty: varchar('specialty', { length: 255 }).notNull(),
    availableSlots: text('availableSlots').array().notNull(),
    isActive: boolean('isActive').default(true).notNull(),
    role: varchar('role', { length: 50 }).default('DOCTOR').notNull(),
  },
  (table) => [
    index('idx_doctors_specialty').on(table.specialty),
    index('idx_doctors_is_active').on(table.isActive),
  ],
);

export const doctorsRelations = relations(doctors, ({ many }) => ({
  appointments: many(appointments),
}));
