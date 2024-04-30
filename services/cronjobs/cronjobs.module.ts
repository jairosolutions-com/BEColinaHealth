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
import { PrescriptionFilesService } from 'src/prescriptionsFiles/prescriptionsFiles.service';
import { PrescriptionsFiles } from 'src/prescriptionsFiles/entities/prescriptionsFiles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments, Patients, Prescriptions,MedicationLogs,PrescriptionsFiles])],

  providers: [CronjobsService, AppointmentsService, PrescriptionsService,MedicationLogsService,  PrescriptionFilesService, IdService] // Include AppointmentsService here
})

export class CronjobsModule {

}
