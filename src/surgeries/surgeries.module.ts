import { Module } from '@nestjs/common';
import { SurgeriesService } from './surgeries.service';
import { SurgeriesController } from './surgeries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Surgeries } from './entities/surgeries.entity';
import { Patients } from 'src/patients/entities/patients.entity';
import { IdService } from 'services/uuid/id.service';

@Module({
  imports: [TypeOrmModule.forFeature([Surgeries, Patients])],
  controllers: [SurgeriesController],
  providers: [SurgeriesService, IdService],
})
export class SurgeriesModule { }
