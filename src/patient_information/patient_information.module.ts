import { Module } from '@nestjs/common';
import { PatientInformationService } from './patient_information.service';
import { PatientInformationResolver } from './patient_information.resolver';
import { PatientInformationController } from './patient_information.controller';

@Module({
  providers: [PatientInformationResolver, PatientInformationService],
  controllers: [PatientInformationController],
})
export class PatientInformationModule {}
