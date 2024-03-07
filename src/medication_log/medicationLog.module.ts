import { Module } from '@nestjs/common';
import { MedicationService } from './medicationLog.service';
import { MedicationResolver } from './medicationLog.resolver';
import { MedicationController } from './medicationLog.controller';
import { IdService } from 'services/uuid/id.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medication } from './entities/medicationLog.entity';
import { PrescriptionService } from 'src/prescription/prescription.service';
import { Prescription } from 'src/prescription/entities/prescription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Medication, Prescription])],
  providers: [MedicationResolver, MedicationService, IdService, PrescriptionService],
  controllers: [MedicationController],
})
export class MedicationModule { }
