import { Module } from '@nestjs/common';
import { EmergencyContactsService } from './emergencyContacts.service';
import { EmergencyContactsResolver } from './emergencyContacts.resolver';
import { EmergencyContactsController } from './emergencyContacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmergencyContacts } from './entities/emergencyContacts.entity';
import { IdService } from 'services/uuid/id.service';

@Module({  imports: [TypeOrmModule.forFeature([EmergencyContacts])],
  providers: [EmergencyContactsResolver, EmergencyContactsService, IdService],
  controllers: [EmergencyContactsController],
})
export class EmergencyContactsModule { }
