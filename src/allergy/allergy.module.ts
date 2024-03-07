import { Module } from '@nestjs/common';
import { AllergyService } from './allergy.service';
import { AllergyController } from './allergy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allergy } from './entities/allergy.entity';
import { PatientInformation } from 'src/patient_information/entities/patient_information.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Allergy, PatientInformation])],
  controllers: [AllergyController],
  providers: [AllergyService],
})
export class AllergyModule {}
