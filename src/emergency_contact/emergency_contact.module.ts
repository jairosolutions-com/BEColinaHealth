import { Module } from '@nestjs/common';
import { EmergencyContactService } from './emergency_contact.service';
import { EmergencyContactResolver } from './emergency_contact.resolver';
import { EmergencyContactController } from './emergency_contact.controller';

@Module({
  providers: [EmergencyContactResolver, EmergencyContactService],
  controllers: [EmergencyContactController],
})
export class EmergencyContactModule {}
