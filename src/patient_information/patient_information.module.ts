import { Module } from '@nestjs/common';
import { PatientInformationService } from './patient_information.service';
import { PatientInformationResolver } from './patient_information.resolver';
import { PatientInformationController } from './patient_information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientInformation } from './entities/patient_information.entity';
import { IdService } from 'services/uuid/id.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientInformation])],
  providers: [PatientInformationResolver, PatientInformationService, IdService],
  controllers: [PatientInformationController],
})
export class PatientInformationModule {}
