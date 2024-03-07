import { Module } from '@nestjs/common';
import { SurgeryService } from './surgery.service';
import { SurgeryController } from './surgery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Surgery } from './entities/surgery.entity';
import { PatientInformation } from 'src/patient_information/entities/patient_information.entity';
import { IdService } from 'services/uuid/id.service';

@Module({
  imports: [TypeOrmModule.forFeature([Surgery, PatientInformation])],
  controllers: [SurgeryController],
  providers: [SurgeryService, IdService],
})
export class SurgeryModule {}
