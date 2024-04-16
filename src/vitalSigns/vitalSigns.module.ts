import { Module } from '@nestjs/common';
import { VitalSignsService } from './vitalSigns.service';
import { VitalSignsResolver } from './vitalSigns.resolver';
import { VitalSignsController } from './vitalSigns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalSigns } from './entities/vitalSigns.entity';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import { PrescriptionsFiles } from 'src/prescriptionsFiles/entities/prescriptionsFiles.entity';
import { PrescriptionFilesService } from 'src/prescriptionsFiles/prescriptionsFiles.service';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VitalSigns, Patients, Prescriptions, PrescriptionsFiles, MedicationLogs])],


  providers: [
    VitalSignsResolver,
    VitalSignsService,
    PatientsService,
    PrescriptionsService,
    IdService,
    PrescriptionFilesService,
  ],
  controllers: [VitalSignsController],
})
export class VitalSignsModule {}
