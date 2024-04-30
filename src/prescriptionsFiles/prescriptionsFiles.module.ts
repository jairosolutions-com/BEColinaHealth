import { Module } from '@nestjs/common';
import { PrescriptionFilesService } from './prescriptionsFiles.service';
import { PrescriptionsFilesController } from './prescriptionsFiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import {PrescriptionsFiles} from './entities/prescriptionsFiles.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, PrescriptionsFiles, Prescriptions, MedicationLogs])],

  controllers: [PrescriptionsFilesController],
  providers: [PrescriptionFilesService, IdService, PrescriptionsService, PatientsService],
})
export class PrescriptionFilesModule { }
