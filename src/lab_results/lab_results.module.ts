import { Module } from '@nestjs/common';
import { LabResultsService } from './lab_results.service';
import { LabResultsResolver } from './lab_results.resolver';
import { LabResultsController } from './lab_results.controller';
import { LabResults } from './entities/lab_result.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';

@Module({  imports: [TypeOrmModule.forFeature([LabResults])],
  providers: [LabResultsResolver, LabResultsService,IdService],
  controllers: [LabResultsController],
})
export class LabResultsModule {}
