import { Module } from '@nestjs/common';
import { FormsService } from './forms.service';
import { FormsController } from './forms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { Forms } from './entities/form.entity';
import { FormFiles } from 'src/formFiles/entities/formFiles.entity';
import { PatientsService } from 'src/patients/patients.service';
import { FormsFilesService } from 'src/formFiles/formFiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Forms, FormFiles, Patients])],
  controllers: [FormsController],
  providers: [FormsService, IdService, FormsFilesService, PatientsService],
})
export class FormsModule {}
