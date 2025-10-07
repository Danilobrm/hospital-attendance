import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({
    description: 'The name of the patient',
    example: 'Alice Johnson',
  })
  name: string;

  @ApiProperty({
    description: 'The email address of the patient',
    example: 'alice@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the patient',
    example: 'password',
  })
  password: string;

  @ApiProperty({
    description: 'The birth date of the patient (ISO 8601 format)',
    example: '1990-05-15T00:00:00Z',
  })
  birthDate: string;

  @ApiProperty({
    description: 'The phone number of the patient',
    example: '+1 (555) 123-4567',
  })
  phone: string;
}
