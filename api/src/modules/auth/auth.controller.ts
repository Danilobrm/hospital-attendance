import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiSecurity } from '@nestjs/swagger';
import { JwtAuthGuards } from './guards/jwt.guards';
import { Roles } from './decorators/roles.decorator';
import { PATIENT_ROLE } from './roles';
import { UserPayload } from './types/jwt.user.payload';
import { User } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login/patient')
  @ApiBody({ type: LoginDto, description: 'Patient login credentials' })
  async loginPatient(@Body() body: LoginDto) {
    return await this.authService.loginPatient(body);
  }

  @ApiSecurity('jwt')
  @UseGuards(JwtAuthGuards)
  @Roles(PATIENT_ROLE)
  @Get('me')
  getProfile(@User() user: UserPayload) {
    console.log(user);
    return this.authService.getProfile(user.id);
  }
}
