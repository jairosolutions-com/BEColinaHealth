import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments, Patients])],

  providers: [CronjobsService, AppointmentsService, IdService] // Include AppointmentsService here
})

export class CronjobsModule {

}
