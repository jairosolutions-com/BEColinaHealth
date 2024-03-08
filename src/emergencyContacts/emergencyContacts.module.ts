import { Module } from '@nestjs/common';
import { EmergencyContactsService } from './emergencyContacts.service';
import { EmergencyContactsResolver } from './emergencyContacts.resolver';
import { EmergencyContactsController } from './emergencyContacts.controller';

@Module({
  providers: [EmergencyContactsResolver, EmergencyContactsService],
  controllers: [EmergencyContactsController],
})
export class EmergencyContactsModule { }
