import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty({
    description: 'The name of the doctor',
    example: 'Dr. John Doe', // Example of a valid input
  })
  name: string;

  @ApiProperty({
    description: 'The email of the doctor',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password hash of the doctor',
    example: 'hashed_password',
  })
  passwordHash: string;

  @ApiProperty({
    description: 'The medical specialty of the doctor',
    example: 'Cardiology',
  })
  specialty: string;

  @ApiProperty({
    description: 'An array of available appointment slots',
    example: ['2025-10-27T09:00:00Z', '2025-10-27T10:00:00Z'],
    isArray: true,
  })
  availableSlots: string[];

  @ApiProperty({
    description: 'The active status of the doctor',
    example: true,
    default: true,
  })
  isActive: boolean;
}
