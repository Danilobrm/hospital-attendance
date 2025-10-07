import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({
    description: 'ID of the doctor for the appointment',
    example: 1,
  })
  doctorId: number;

  // @ApiProperty({
  //   description: 'ID of the patient for the appointment',
  //   example: 1,
  // })
  // patientId: number;

  @ApiProperty({
    description:
      'Scheduled date and time for the appointment in ISO 8601 format',
    example: '2025-10-28T09:00:00Z',
  })
  scheduledAt: string;

  @ApiProperty({
    description: 'Additional notes for the appointment',
    example: '',
  })
  notes: string;
}

// CREATE TABLE appointments (
//     id SERIAL PRIMARY KEY,
//     "doctorId" INTEGER NOT NULL,
//     "patientId" INTEGER NOT NULL,
//     "scheduledAt" TIMESTAMP NOT NULL,
//     status appointment_status NOT NULL DEFAULT 'CREATED',
//     notes TEXT,
//     FOREIGN KEY ("doctorId") REFERENCES doctors(id),
//     FOREIGN KEY ("patientId") REFERENCES patients(id)
// );
