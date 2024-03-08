import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsResolver } from './prescriptions.resolver';
import { PrescriptionsController } from './prescriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescriptions } from './entities/prescriptions.entity';
import { IdService } from 'services/uuid/id.service';

@Module({
  imports: [TypeOrmModule.forFeature([Prescriptions])],

  providers: [PrescriptionsResolver, IdService, PrescriptionsService],
  controllers: [PrescriptionsController],
})
export class PrescriptionsModule { }
