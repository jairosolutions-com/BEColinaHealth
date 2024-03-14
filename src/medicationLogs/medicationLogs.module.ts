import { Module } from '@nestjs/common';
import { MedicationLogsService } from './medicationLogs.service';
import { MedicationLogsResolver } from './medicationLogs.resolver';
import { MedicationLogsController } from './medicationLogs.controller';
import { IdService } from 'services/uuid/id.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationLogs } from './entities/medicationLogs.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { PatientsService } from 'src/patients/patients.service';
import { Patients } from 'src/patients/entities/patients.entity';


@Module({
  imports: [TypeOrmModule.forFeature([MedicationLogs, Prescriptions, Patients])],
  providers: [MedicationLogsResolver, MedicationLogsService, IdService, PatientsService, PrescriptionsService],
  controllers: [MedicationLogsController],
})
export class MedicationLogsModule { }
