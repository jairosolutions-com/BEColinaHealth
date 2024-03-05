import { Module } from '@nestjs/common';
import { VitalSignsService } from './vital_signs.service';
import { VitalSignsResolver } from './vital_signs.resolver';
import { VitalSignsController } from './vital_signs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalSigns } from './entities/vital_sign.entity';
import { IdService } from 'services/uuid/id.service';

@Module({
  imports: [TypeOrmModule.forFeature([VitalSigns])],

  providers: [VitalSignsResolver, VitalSignsService, IdService],
  controllers: [VitalSignsController],
})
export class VitalSignsModule {}
