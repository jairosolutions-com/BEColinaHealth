import { Module } from '@nestjs/common';
import { AllergiesService } from './allergies.service';
import { AllergiesController } from './allergies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Allergies } from './entities/allergies.entity';
import { Patients } from 'src/patients/entities/patients.entity';
import { IdService } from 'services/uuid/id.service';

@Module({
  imports: [TypeOrmModule.forFeature([Allergies, Patients])],
  controllers: [AllergiesController],
  providers: [AllergiesService, IdService],
})
export class AllergiesModule { }
