import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PatientsService } from '../patients/patients.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly patientsService: PatientsService,
  ) {}

  async loginPatient({ email, password }: LoginDto): Promise<{
    token: string;
  }> {
    const patient = await this.patientsService.findOneByEmail(email.trim());

    if (!patient) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(password, patient.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: patient.id,
      email: patient.email,
      role: patient.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }

  async getProfile(id: number) {
    console.log('Fetching profile for user ID:', id);
    return this.patientsService.findOneById(id);
  }
}
