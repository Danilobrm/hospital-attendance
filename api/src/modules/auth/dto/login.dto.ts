import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Patient email',
    example: 'john.doe@hospital.com',
  })
  email: string;

  @ApiProperty({
    description: 'Patient password',
    example: 'secretpatientpassword',
  })
  password: string;
}
