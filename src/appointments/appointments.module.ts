import {  Logger, Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsResolver } from './appointments.resolver';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from './entities/appointments.entity';
import { IdService } from 'services/uuid/id.service';
import { PatientsService } from 'src/patients/patients.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
// import { AppointmentScheduler } from 'services/scheduler/appointment.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments, Patients,Prescriptions])],
  providers: [AppointmentsResolver, AppointmentsService, IdService,PrescriptionsService, Logger, PatientsService],
  controllers: [AppointmentsController],
})
export class AppointmentsModule { }
