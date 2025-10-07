import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseInterceptors,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { FindAppointmentsDto } from './dto/find-appointments.dto';
import { IdempotencyInterceptor } from 'src/idempotency/idempotency.interceptor';
import { ApiHeader, ApiSecurity } from '@nestjs/swagger';
import { User } from '../auth/decorators/current-user.decorator';
import { UserPayload } from '../auth/types/jwt.user.payload';
import { JwtAuthGuards } from '../auth/guards/jwt.guards';
import { RolesGuard } from '../auth/guards/roles.guards';
import { PATIENT_ROLE } from '../auth/roles';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiSecurity('jwt')
@UseGuards(JwtAuthGuards, RolesGuard)
@Roles(PATIENT_ROLE)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiHeader({
    name: 'idempotency-key',
    required: true,
    schema: {
      type: 'string',
      example: 'c4b1f970-8f4e-4c8e-9b1f-2f4f51f3bdf3',
    },
  })
  @UseInterceptors(IdempotencyInterceptor)
  create(
    @User() user: UserPayload,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    const patientId = user.id;
    return this.appointmentsService.create(patientId, createAppointmentDto);
  }

  @Get()
  findAll(
    @User() user: UserPayload,
    @Query() findAppointmentsDto: FindAppointmentsDto,
  ) {
    return this.appointmentsService.findAll(findAppointmentsDto);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.appointmentsService.findOneById(+id);
  }

  @Post(':id/confirm')
  confirmAppointment(@Param('id') id: string) {
    return this.appointmentsService.confirmAppointment(+id);
  }
}
