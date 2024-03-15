import { Module } from '@nestjs/common';
import { AllergiesService } from './allergies.service';
import { AllergiesController } from './allergies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allergies } from './entities/allergies.entity';
import { Patients } from 'src/patients/entities/patients.entity';
import { IdService } from 'services/uuid/id.service';
import { PatientsService } from 'src/patients/patients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Allergies, Patients])],
  controllers: [AllergiesController],
  providers: [AllergiesService, IdService, PatientsService],
})
export class AllergiesModule { }
