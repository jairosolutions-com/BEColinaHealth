import { Module } from '@nestjs/common';
import { MedicationLogsService } from './medicationLogs.service';
import { MedicationLogsResolver } from './medicationLogs.resolver';
import { MedicationLogsController } from './medicationLogs.controller';
import { IdService } from 'services/uuid/id.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationLogs } from './entities/medicationLogs.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { PatientsService } from 'src/patients/patients.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PrescriptionsFiles } from 'src/prescriptionsFiles/entities/prescriptionsFiles.entity';
import { PrescriptionFilesService } from 'src/prescriptionsFiles/prescriptionsFiles.service';
@Module({
  imports: [TypeOrmModule.forFeature([MedicationLogs, Prescriptions, Patients, PrescriptionsFiles])],
  providers: [MedicationLogsResolver, MedicationLogsService, IdService, PatientsService, PrescriptionsService, PrescriptionFilesService],
  controllers: [MedicationLogsController],
})
export class MedicationLogsModule { }
