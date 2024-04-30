import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsResolver } from './prescriptions.resolver';
import { PrescriptionsController } from './prescriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescriptions } from './entities/prescriptions.entity';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import {PrescriptionsFiles} from 'src/prescriptionsFiles/entities/prescriptionsFiles.entity';
import { PrescriptionFilesService } from 'src/prescriptionsFiles/prescriptionsFiles.service';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Prescriptions, Patients, MedicationLogs, PrescriptionsFiles,MedicationLogs])],

  providers: [PrescriptionsResolver, IdService, PrescriptionsService, PatientsService,PrescriptionFilesService],
  controllers: [PrescriptionsController],
})
export class PrescriptionsModule { }
