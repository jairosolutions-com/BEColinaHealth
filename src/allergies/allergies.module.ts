import { Module } from '@nestjs/common';
import { AllergiesService } from './allergies.service';
import { AllergiesController } from './allergies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allergies } from './entities/allergies.entity';
import { Patients } from 'src/patients/entities/patients.entity';
import { IdService } from 'services/uuid/id.service';
import { PatientsService } from 'src/patients/patients.service';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Allergies, Patients,Prescriptions,MedicationLogs])],
  controllers: [AllergiesController],
  providers: [AllergiesService, IdService, PatientsService,PrescriptionsService],
})
export class AllergiesModule { }
