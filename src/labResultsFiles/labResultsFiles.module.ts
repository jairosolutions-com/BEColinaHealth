import { Module } from '@nestjs/common';
import { LabResultsFilesService } from './labResultsFiles.service';
import { LabResultsFilesController } from './labResultsFiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import LabResultsFiles from './entities/labResultsFiles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LabResultsFiles])],

  controllers: [LabResultsFilesController],
  providers: [LabResultsFilesService],
})
export class LabResultsFilesModule { }
