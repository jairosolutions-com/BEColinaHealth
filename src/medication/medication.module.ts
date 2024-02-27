import { Module } from '@nestjs/common';
import { MedicationService } from './medication.service';
import { MedicationResolver } from './medication.resolver';
import { MedicationController } from './medication.controller';

@Module({
  providers: [MedicationResolver, MedicationService],
  controllers: [MedicationController],
})
export class MedicationModule {}
