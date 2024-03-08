import { Module } from '@nestjs/common';
import { MedicationLogsService } from './medicationLogs.service';
import { MedicationLogsResolver } from './medicationLogs.resolver';
import { MedicationLogsController } from './medicationLogs.controller';
import { IdService } from 'services/uuid/id.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationLogs } from './entities/medicationLogs.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';


@Module({
  imports: [TypeOrmModule.forFeature([MedicationLogs, Prescriptions])],
  providers: [MedicationLogsResolver, MedicationLogsService, IdService, PrescriptionsService],
  controllers: [MedicationLogsController],
})
export class MedicationLogsModule { }
