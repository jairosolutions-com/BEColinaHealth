import { Module } from '@nestjs/common';
import { VitalSignsService } from './vitalSigns.service';
import { VitalSignsResolver } from './vitalSigns.resolver';
import { VitalSignsController } from './vitalSigns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalSigns } from './entities/vitalSigns.entity';
import { IdService } from 'services/uuid/id.service';

@Module({
  imports: [TypeOrmModule.forFeature([VitalSigns])],

  providers: [VitalSignsResolver, VitalSignsService, IdService],
  controllers: [VitalSignsController],
})
export class VitalSignsModule { }
