import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsResolver } from './appointments.resolver';
import { AppointmentsController } from './appointments.controller';

@Module({
  providers: [AppointmentsResolver, AppointmentsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule { }
