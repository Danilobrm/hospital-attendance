import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { AppointmentsRepository } from 'src/repositories/appointments.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { DoctorsService } from '../doctors/doctors.service';
import { PatientsService } from '../patients/patients.service';
import { NotificationService } from '../notifications/notification.service';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly patientsService: PatientsService,
    private readonly doctorsService: DoctorsService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(patientId: number, createAppointmentDto: CreateAppointmentDto) {
    const { doctorId, scheduledAt, notes } = createAppointmentDto;

    const patient = await this.patientsService.findOneById(patientId);
    const doctor = await this.doctorsService.findOneById(doctorId);

    if (!doctor?.isActive) {
      throw new ConflictException(
        `Doctor is not active and cannot take appointments.`,
      );
    }

    const requestedSlotISO = scheduledAt;
    const isSlotAvailable = await this.doctorsService.findAvailableSlot(
      doctorId,
      requestedSlotISO,
    );

    if (!isSlotAvailable) {
      throw new BadRequestException(
        'The requested time slot is not in the doctor’s defined available slots.',
      );
    }

    const existingAppointmentForDoctor =
      await this.appointmentsRepository.findByDoctorAndSlot(
        doctorId,
        requestedSlotISO,
      );

    if (existingAppointmentForDoctor) {
      throw new ConflictException(
        `Dr. ${doctor.name} is already booked at ${new Date(requestedSlotISO).toLocaleTimeString()}`,
      );
    }

    const existingAppointmentForPatient =
      await this.appointmentsRepository.findByPatientAndSlot(
        patientId,
        requestedSlotISO,
      );

    if (existingAppointmentForPatient) {
      throw new ConflictException(
        `You already have an appointment booked at ${new Date(
          requestedSlotISO,
        ).toLocaleTimeString()}`,
      );
    }

    const newAppointmentData = {
      doctorId,
      patientId,
      scheduledAt: requestedSlotISO,
      status: 'CREATED',
      notes: notes,
    };

    const appointment = await this.appointmentsRepository.create(
      patientId,
      newAppointmentData,
    );

    if (appointment) {
      await this.doctorsService.removeUnavailableSlot(
        doctorId,
        requestedSlotISO,
      );
    }

    return appointment;
  }

  async confirmAppointment(appointmentId: number): Promise<Appointment> {
    const appointment = await this.findOneById(appointmentId);

    if (!appointment) {
      throw new BadRequestException('Appointment not found.');
    }

    //     if (appointment.status !== 'CREATED') {
    //       throw new BadRequestException(
    //         'Only appointments with status CREATED can be confirmed.',
    //       );
    //     }
    //
    //     const updatedAppointment = await this.appointmentsRepository.updateStatus(
    //       appointmentId,
    //       'CONFIRMED',
    //     );

    // if (!updatedAppointment) {
    //   throw new BadRequestException('Failed to confirm the appointment.');
    // }

    appointment.status = 'CONFIRMED';

    this.notificationService
      .sendAppointmentNotification(appointment, 'CONFIRMATION')
      .catch((err) => {
        console.error('Asynchronous notification failed:', err);
      });

    return appointment;
  }
  async findAll(findAppointmentsDto: FindAppointmentsDto) {
    return await this.appointmentsRepository.findAll(findAppointmentsDto);
  }

  findOneById(id: number) {
    return this.appointmentsRepository.findOneById(id);
  }
}
