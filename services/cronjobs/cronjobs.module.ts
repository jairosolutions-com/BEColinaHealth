import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { IdService } from 'services/uuid/id.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments])],

  providers: [CronjobsService, AppointmentsService, IdService] // Include AppointmentsService here
})

export class CronjobsModule {

}
