import { Module } from '@nestjs/common';
import { PatientsResolver } from './patients.resolver';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patients } from './entities/patients.entity';
import { IdService } from 'services/uuid/id.service';
import { PatientsService } from './patients.service';
import { Allergies } from 'src/allergies/entities/allergies.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, Allergies, Prescriptions, MedicationLogs])],
  providers: [
    PatientsResolver,
    PatientsService,
    PrescriptionsService,
    IdService,
  ],
  controllers: [PatientsController],
})
export class PatientsModule {}
