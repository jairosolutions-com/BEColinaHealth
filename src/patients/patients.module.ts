import { Module } from '@nestjs/common';
import { PatientsResolver } from './patients.resolver';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patients } from './entities/patients.entity';
import { IdService } from 'services/uuid/id.service';
import { PatientsService } from './patients.service';
import { Allergies } from 'src/allergies/entities/allergies.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, Allergies])],
  providers: [PatientsResolver, PatientsService, IdService],
  controllers: [PatientsController],
})
export class PatientsModule {}
