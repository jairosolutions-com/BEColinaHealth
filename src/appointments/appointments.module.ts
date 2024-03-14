import {  Logger, Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsResolver } from './appointments.resolver';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from './entities/appointments.entity';
import { IdService } from 'services/uuid/id.service';
// import { AppointmentScheduler } from 'services/scheduler/appointment.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments])],
  providers: [AppointmentsResolver, AppointmentsService, IdService, Logger],
  controllers: [AppointmentsController],
})
export class AppointmentsModule { }
