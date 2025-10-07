import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq, sql } from 'drizzle-orm';
import { DrizzleAsyncProvider } from 'src/infrasctructure/drizzle/constants';
import { doctors } from 'src/infrasctructure/drizzle/schema';
import { CreateDoctorDto } from 'src/modules/doctors/dto/create-doctor.dto';
import { Doctor } from 'src/modules/doctors/entities/doctor.entity';
import { RedisService } from 'src/infrasctructure/redis/redis.service';

const DOCTORS_LIST_TTL_SECONDS = 60 * 5;
const ALL_DOCTORS_CACHE_KEY = 'doctors:all';

type DoctorsList = Omit<Doctor, 'availableSlots'>[];

@Injectable()
export class DoctorsRepository {
  constructor(
    private redisService: RedisService,
    @Inject(DrizzleAsyncProvider) private readonly db: NodePgDatabase,
  ) {}

  async create(doctorData: CreateDoctorDto): Promise<number> {
    const [result] = await this.db
      .insert(doctors)
      .values({
        name: doctorData.name,
        specialty: doctorData.specialty,
        availableSlots: doctorData.availableSlots,
        email: doctorData.email,
        passwordHash: doctorData.passwordHash,
      })
      .returning({ id: doctors.id });

    try {
      await this.redisService.del(ALL_DOCTORS_CACHE_KEY);
      console.log(`[CACHE] Invalidated key: ${ALL_DOCTORS_CACHE_KEY}`);
    } catch (error) {
      console.error(
        'Redis cache invalidation failed during doctor creation:',
        error,
      );
    }

    return result.id;
  }

  async findOneById(id: number): Promise<Doctor | undefined> {
    const [result] = await this.db
      .select({
        id: doctors.id,
        name: doctors.name,
        specialty: doctors.specialty,
        availableSlots: doctors.availableSlots,
        isActive: doctors.isActive,
      })
      .from(doctors)
      .where(eq(doctors.id, id))
      .limit(1);

    if (!result) {
      throw new NotFoundException(`Doctor not found`);
    }

    return result;
  }

  async findAll(): Promise<DoctorsList> {
    try {
      const cachedDoctors = await this.redisService.getJson<DoctorsList>(
        ALL_DOCTORS_CACHE_KEY,
      );

      if (cachedDoctors) {
        console.log('[CACHE] Returning doctors list from Redis cache.');
        return cachedDoctors;
      }
    } catch (error) {
      console.error('Redis cache read failed:', error);
    }

    const doctorsList = await this.db
      .select({
        id: doctors.id,
        name: doctors.name,
        specialty: doctors.specialty,
        isActive: doctors.isActive,
      })
      .from(doctors);

    try {
      await this.redisService.setJson(
        ALL_DOCTORS_CACHE_KEY,
        doctorsList,
        DOCTORS_LIST_TTL_SECONDS,
      );
      console.log('[CACHE] Doctor list updated in Redis.');
    } catch (error) {
      console.error('Redis cache write failed:', error);
    }

    return doctorsList;
  }

  async findAllActive(): Promise<Doctor[]> {
    return this.db.select().from(doctors).where(eq(doctors.isActive, true));
  }

  async findAvailableSlot(doctorId: number, slotISO: string): Promise<boolean> {
    const [result] = await this.db
      .select()
      .from(doctors)
      .where(
        and(
          eq(doctors.id, doctorId),
          sql`${doctors.availableSlots} @> ARRAY[${slotISO}]::text[]`,
        ),
      )
      .limit(1);

    return result !== undefined;
  }

  async removeUnavailableSlot(
    doctorId: number,
    slotISO: string,
  ): Promise<void> {
    await this.db
      .update(doctors)
      .set({
        availableSlots: sql`array_remove(${doctors.availableSlots}, ${slotISO})`,
      })
      .where(eq(doctors.id, doctorId));
  }
}
