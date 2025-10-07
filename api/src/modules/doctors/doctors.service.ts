import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorsRepository } from 'src/repositories/doctors.repository';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(private readonly doctorsRepository: DoctorsRepository) {}

  create(createDoctorDto: CreateDoctorDto) {
    return this.doctorsRepository.create(createDoctorDto);
  }

  findAll() {
    return this.doctorsRepository.findAll();
  }

  async findOneById(id: number): Promise<Doctor | null> {
    const doctor = await this.doctorsRepository.findOneById(id);

    if (!doctor) {
      return null;
    }

    const now = new Date();

    const futureSlots = doctor.availableSlots.filter((slotString) => {
      const slotDate = new Date(slotString);

      return slotDate.getTime() > now.getTime();
    });

    doctor.availableSlots = futureSlots;

    return doctor;
  }

  async findAvailableSlot(doctorId: number, slotISO: string) {
    return this.doctorsRepository.findAvailableSlot(doctorId, slotISO);
  }

  async removeUnavailableSlot(doctorId: number, slotISO: string) {
    return this.doctorsRepository.removeUnavailableSlot(doctorId, slotISO);
  }

  //   async findActiveDoctor(id: number) {
  //     const doctor = await this.doctorsRepository.findOneById(id);
  //
  //     if (!doctor?.isActive) {
  //       throw new ConflictException(`Doctor is not active`);
  //     }
  //
  //     return doctor;
  //   }
}
