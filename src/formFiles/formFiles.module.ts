import { Module } from '@nestjs/common';
import { FormsFilesService } from './formFiles.service';
import { FormFilesController } from './formFiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormFiles } from './entities/formFiles.entity';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import { IdService } from 'services/uuid/id.service';
import { Forms } from 'src/forms/entities/form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, FormFiles, Forms])],
  controllers: [FormFilesController],
  providers: [FormsFilesService, IdService, PatientsService],
})
export class FormFilesModule { }
