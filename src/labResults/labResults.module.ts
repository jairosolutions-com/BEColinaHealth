import { Module } from '@nestjs/common';
import { LabResultsService } from './labResults.service';
import { LabResultsResolver } from './labResults.resolver';
import { LabResultsController } from './labResults.controller';
import { LabResults } from './entities/labResults.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';

@Module({
  imports: [TypeOrmModule.forFeature([LabResults])],
  providers: [LabResultsResolver, LabResultsService, IdService],
  controllers: [LabResultsController],
})
export class LabResultsModule { }
