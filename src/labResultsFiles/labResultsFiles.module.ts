import { Module } from '@nestjs/common';
import { LabResultsFilesService } from './labResultsFiles.service';
import { LabResultsFilesController } from './labResultsFiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import LabResultsFiles from './entities/labResultsFiles.entity';
import { IdService } from 'services/uuid/id.service';
import { LabResults } from 'src/labResults/entities/labResults.entity';
import { LabResultsService } from 'src/labResults/labResults.service';

@Module({
  imports: [TypeOrmModule.forFeature([LabResultsFiles, LabResults])],

  controllers: [LabResultsFilesController],
  providers: [LabResultsFilesService, IdService, LabResults ,LabResultsService],
})
export class LabResultsFilesModule { }
