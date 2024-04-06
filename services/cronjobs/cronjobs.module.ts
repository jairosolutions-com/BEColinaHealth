import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import { MedicationLogsService } from 'src/medicationLogs/medicationLogs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments, Patients, Prescriptions,MedicationLogs])],

  providers: [CronjobsService, AppointmentsService, PrescriptionsService,MedicationLogsService, IdService] // Include AppointmentsService here
})

export class CronjobsModule {

}
