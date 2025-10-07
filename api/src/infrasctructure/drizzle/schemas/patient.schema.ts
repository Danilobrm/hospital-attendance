import { relations } from 'drizzle-orm';
import { pgTable, timestamp, serial, varchar } from 'drizzle-orm/pg-core';
import { appointments } from './appointment.schema';

export const patients = pgTable('patients', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  passwordHash: varchar('passwordHash', { length: 255 }).notNull(),
  birthDate: timestamp('birthDate', { withTimezone: true }).notNull(),
  phone: varchar('phone', { length: 20 }),
  role: varchar('role', { length: 50 }).default('PATIENT').notNull(),
});

export const patientsRelations = relations(patients, ({ many }) => ({
  appointments: many(appointments),
}));
