import * as schema from 'src/infrasctructure/drizzle/schema';
import * as bcrypt from 'bcrypt';
import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'src/infrasctructure/drizzle/constants';
import { eq } from 'drizzle-orm';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);
  private readonly SHOULD_SEED: boolean;

  constructor(
    @Inject(DrizzleAsyncProvider) private db: NodePgDatabase,
    private configService: ConfigService,
  ) {
    this.SHOULD_SEED = this.configService.get<string>('RUN_SEEDER') === 'true';
  }

  // --- Main NestJS Lifecycle Hook ---
  async onModuleInit() {
    console.log('');
    this.logger.log('Seeder module initialized');

    if (this.SHOULD_SEED) {
      this.logger.warn('Seeding is enabled. Starting seeding process...');
    }

    try {
      await this.seedAdmin();
      await this.seedDoctors();
      await this.seedPatients();
    } catch (error) {
      this.logger.error('Seeding failed', error);
    }
    this.logger.log('Seeding process completed\n');
  }

  // --- Seed Functions ---

  private async seedAdmin() {
    const adminEmail = 'admin@hospital.com';
    const adminPassword = 'secretadminpassword';

    // Check for existing data
    const existing = await this.db
      .select()
      .from(schema.admin)
      .where(eq(schema.admin.email, adminEmail));

    if (existing.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await this.db.insert(schema.admin).values({
        name: 'Admin User',
        email: adminEmail,
        passwordHash: hashedPassword,
      });

      this.logger.log(`[ADMIN] Created user: ${adminEmail}`);
      this.logger.log(`[🔐 AUTH] Password: ${adminPassword} (Hashed)`);
    } else {
      this.logger.warn('[ADMIN] Admin user already exists. Skipping seed.');
    }
  }

  private async seedDoctors() {
    const existing = await this.db.select().from(schema.doctors);

    if (existing.length === 0) {
      await this.db.insert(schema.doctors).values([
        {
          email: 'evelyn.reed@hospital.com',
          passwordHash: await bcrypt.hash('secretdoctorpassword', 10),
          name: 'Evelyn Reed',
          specialty: 'Cardiology',
          isActive: true,
          availableSlots: ['2025-10-28T09:00:00Z', '2025-10-28T10:00:00Z'],
        },
        {
          email: 'michael.chen@hospital.com',
          passwordHash: await bcrypt.hash('secretdoctorpassword', 10),
          name: 'Michael Chen',
          specialty: 'Dermatology',
          isActive: true,
          availableSlots: ['2025-10-28T14:00:00Z', '2025-10-28T15:00:00Z'],
        },
        {
          email: 'isabella.rossi@hospital.com',
          passwordHash: await bcrypt.hash('secretdoctorpassword', 10),
          name: 'Isabella Rossi',
          specialty: 'Neurology',
          isActive: true,
          availableSlots: ['2025-10-29T11:00:00Z', '2025-10-29T12:00:00Z'],
        },
      ]);
      this.logger.log('[DOCTOR] SUCCESS: 3 Doctors created.');
    } else {
      this.logger.warn('[DOCTOR] Doctors already exist. Skipping seed.');
    }
  }

  private async seedPatients() {
    const existing = await this.db.select().from(schema.patients);

    if (existing.length === 0) {
      await this.db.insert(schema.patients).values([
        {
          email: 'john.doe@hospital.com',
          passwordHash: await bcrypt.hash('secretpatientpassword', 10),
          name: 'John Doe',
          birthDate: new Date('1990-01-01'),
        },
        {
          email: 'jane.smith@hospital.com',
          passwordHash: await bcrypt.hash('secretpatientpassword', 10),
          name: 'Jane Smith',
          birthDate: new Date('1985-05-15'),
        },
        {
          email: 'robert.brown@hospital.com',
          passwordHash: await bcrypt.hash('secretpatientpassword', 10),
          name: 'Robert Brown',
          birthDate: new Date('2000-10-30'),
        },
      ]);
      this.logger.log('[PATIENT] SUCCESS: 3 Patients created.');
    } else {
      this.logger.warn('[PATIENT] Patients already exist. Skipping seed.');
    }
  }

  private async clearDatabase() {
    await this.db
      .delete(schema.appointments)
      .where(eq(schema.appointments.id, schema.appointments.id));

    await this.db
      .delete(schema.patients)
      .where(eq(schema.patients.id, schema.patients.id));

    await this.db
      .delete(schema.doctors)
      .where(eq(schema.doctors.id, schema.doctors.id));

    await this.db
      .delete(schema.admin)
      .where(eq(schema.admin.id, schema.admin.id));

    this.logger.log('Database cleared.');
  }
}
