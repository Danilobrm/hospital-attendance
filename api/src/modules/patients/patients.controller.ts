import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientsService } from './patients.service';
import { ADMIN_ROLE, PATIENT_ROLE } from '../auth/roles';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuards } from '../auth/guards/jwt.guards';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @ApiSecurity('jwt')
  @UseGuards(JwtAuthGuards)
  @Roles(ADMIN_ROLE, PATIENT_ROLE)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.patientsService.findOneById(id);
  }
}
