import { Module } from '@nestjs/common';
import { LabResultsFilesService } from './labResultsFiles.service';
import { LabResultsFilesController } from './labResultsFiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import LabResultsFiles from './entities/labResultsFiles.entity';
import { IdService } from 'services/uuid/id.service';
import { LabResults } from 'src/labResults/entities/labResults.entity';
import { LabResultsService } from 'src/labResults/labResults.service';
import { Patients } from 'src/patients/entities/patients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, LabResultsFiles, LabResults])],

  controllers: [LabResultsFilesController],
  providers: [LabResultsFilesService, IdService, LabResultsService],
})
export class LabResultsFilesModule {}
