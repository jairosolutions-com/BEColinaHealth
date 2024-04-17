import { Module } from '@nestjs/common';
import { LabResultsService } from './labResults.service';
import { LabResultsResolver } from './labResults.resolver';
import { LabResultsController } from './labResults.controller';
import { LabResults } from './entities/labResults.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import LabResultsFiles from 'src/labResultsFiles/entities/labResultsFiles.entity';
import { LabResultsFilesService } from 'src/labResultsFiles/labResultsFiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([LabResults, LabResultsFiles, Patients])],
  providers: [
    LabResultsResolver,
    LabResultsService,
    PatientsService,
    IdService,
    LabResultsFilesService,
  ],

  controllers: [LabResultsController],
})
export class LabResultsModule {}
