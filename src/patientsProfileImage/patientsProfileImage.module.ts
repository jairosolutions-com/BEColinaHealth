import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import { PatientsProfileImage } from './entities/patientsProfileImage.entity';
import { PatientsProfileImageService } from './patientsProfileImage.service';
import {PatientsProfileImageController} from './patientsProfileImage.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, PatientsProfileImage,])],

  controllers: [PatientsProfileImageController],
  providers: [PatientsProfileImageService, IdService, PatientsService],
})
export class PrescriptionFilesModule { }
