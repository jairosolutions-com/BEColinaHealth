import { Module } from '@nestjs/common';
import { EmergencyContactsService } from './emergencyContacts.service';
import { EmergencyContactsResolver } from './emergencyContacts.resolver';
import { EmergencyContactsController } from './emergencyContacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyContacts } from './entities/emergencyContacts.entity';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import { PrescriptionsFiles } from 'src/prescriptionsFiles/entities/prescriptionsFiles.entity';
import { PrescriptionFilesService } from 'src/prescriptionsFiles/prescriptionsFiles.service';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';

@Module({  imports: [TypeOrmModule.forFeature([EmergencyContacts,MedicationLogs, Patients,Prescriptions, PrescriptionsFiles])],
  providers: [EmergencyContactsResolver, PrescriptionFilesService,EmergencyContactsService,PrescriptionsService, PatientsService, IdService],

  controllers: [EmergencyContactsController],
})
export class EmergencyContactsModule { }
