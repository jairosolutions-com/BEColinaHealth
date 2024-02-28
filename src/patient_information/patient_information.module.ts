import { Module } from '@nestjs/common';
import { PatientInformationService } from './patient_information.service';
import { PatientInformationResolver } from './patient_information.resolver';
import { PatientInformationController } from './patient_information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientInformation } from './entities/patient_information.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatientInformation])],
  providers: [PatientInformationResolver, PatientInformationService],
  controllers: [PatientInformationController],
})
export class PatientInformationModule {}
