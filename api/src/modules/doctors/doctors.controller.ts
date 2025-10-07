import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { DoctorsService } from './doctors.service';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuards } from '../auth/guards/jwt.guards';
import { ADMIN_ROLE, PATIENT_ROLE } from '../auth/roles';
import { ApiHeader, ApiSecurity } from '@nestjs/swagger';

@ApiSecurity('jwt')
@UseGuards(JwtAuthGuards, RolesGuard)
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @Roles(ADMIN_ROLE)
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @Roles(PATIENT_ROLE)
  async findAll() {
    return await this.doctorsService.findAll();
  }

  @Get(':id')
  @Roles(PATIENT_ROLE)
  findOneById(@Param('id') id: number) {
    return this.doctorsService.findOneById(id);
  }
}
