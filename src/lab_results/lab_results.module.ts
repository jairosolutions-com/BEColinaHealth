import { Module } from '@nestjs/common';
import { LabResultsService } from './lab_results.service';
import { LabResultsResolver } from './lab_results.resolver';
import { LabResultsController } from './lab_results.controller';

@Module({
  providers: [LabResultsResolver, LabResultsService],
  controllers: [LabResultsController],
})
export class LabResultsModule {}
