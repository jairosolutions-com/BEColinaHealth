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

@Module({  imports: [TypeOrmModule.forFeature([EmergencyContacts, Patients,Prescriptions])],
  providers: [EmergencyContactsResolver, EmergencyContactsService,PrescriptionsService, PatientsService, IdService],
  controllers: [EmergencyContactsController],
})
export class EmergencyContactsModule { }
