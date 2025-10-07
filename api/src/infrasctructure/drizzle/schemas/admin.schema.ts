import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const admin = pgTable('admin', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  passwordHash: varchar('passwordHash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).default('ADMIN').notNull(),
});
