import { Module } from '@nestjs/common';
import { LabResultsService } from './labResults.service';
import { LabResultsResolver } from './labResults.resolver';
import { LabResultsController } from './labResults.controller';
import { LabResults } from './entities/labResults.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import LabResultsFiles from 'src/labResultsFiles/entities/labResultsFiles.entity';
import { LabResultsFilesService } from 'src/labResultsFiles/labResultsFiles.service';
import { PrescriptionFilesService } from 'src/prescriptionsFiles/prescriptionsFiles.service';
import { PrescriptionsFiles } from 'src/prescriptionsFiles/entities/prescriptionsFiles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LabResults, LabResultsFiles,  Patients,Prescriptions, PrescriptionsFiles])],
  providers: [LabResultsResolver, LabResultsService, PatientsService,PrescriptionFilesService,PrescriptionsService, IdService,LabResultsFilesService ],

  controllers: [LabResultsController],
})
export class LabResultsModule { }
