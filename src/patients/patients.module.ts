import { Module } from '@nestjs/common';
import { PatientsResolver } from './patients.resolver';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patients } from './entities/patients.entity';
import { IdService } from 'services/uuid/id.service';
import { PatientsService } from './patients.service';
import { PatientsProfileImage } from 'src/patientsProfileImage/entities/patientsProfileImage.entity';
import { PatientsProfileImageService } from 'src/patientsProfileImage/patientsProfileImage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, PatientsProfileImage])],

  providers: [PatientsResolver, PatientsService, IdService, PatientsProfileImageService],
  controllers: [PatientsController],
})
export class PatientsModule {}
