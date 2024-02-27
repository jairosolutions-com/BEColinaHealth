import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentResolver } from './appointment.resolver';
import { AppointmentController } from './appointment.controller';

@Module({
  providers: [AppointmentResolver, AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
